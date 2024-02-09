import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import mongoose from 'mongoose';
import {IOrder} from '../models/Order';
import {Order, Product, User} from '../models';
import {ITokenPayload} from '../utils';
import CustomError from '../errors';
import Stripe from 'stripe';
import {checkIfAllowed} from '../utils';
import moment from 'moment';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const parseJSONWithFallback = (input: string) => {
    try {
        return JSON.parse(input);
    } catch (error) {
        return false;
    }
}

const isValidPaymentIntent = async(clientSecret: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
        return paymentIntent;
    } 
    catch (error: any) {
        return false;
    }
};

interface OrderRequest extends Request {
    params: {
        id: string
    },
    body: IOrder & {
        items: string
    },
    query: {
        username?: string,
        startDate?: string,
        endDate?: string,
        minimumTotal?: string,
        maximumTotal?: string,
        orderStatus?: 'paid' | 'preparing' | 'shipped' | 'delivered',
        sortBy: 'newest' | 'oldest',
        limit?: string,
        page?: string
    },
    user?: ITokenPayload
}

interface IQueryObject {
    user?: string,
    createdAt?: {$gte: Date, $lte: Date},
    total?: {$gte: number, $lte: number},
    status?: {$regex: string, $options: string}
}

const getAllOrders = async(req: OrderRequest, res: Response) => {
    const {username, startDate, endDate, minimumTotal, maximumTotal, orderStatus, sortBy} = req.query;
    const queryObject: IQueryObject = {};
    const startMoment = moment(startDate, 'MM/DD/YYYY');
    const endMoment = moment(endDate, 'MM/DD/YYYY');
    if (username) {
        const user = await User.findOne({name: username});
        if (user) {
            queryObject.user = user._id;
        }
    }
    if (startMoment.isValid() && endMoment.isValid()) {
        queryObject.createdAt = {
            $gte: startMoment.startOf('day').toDate(),
            $lte: endMoment.endOf('day').toDate()
        };
    }
    if (minimumTotal && maximumTotal) {
        queryObject.total = {$gte: Number(minimumTotal) * 100, $lte: Number(maximumTotal) * 100};
    }
    if (orderStatus) {
        queryObject.status = {$regex: orderStatus, $options: 'i'};
    }
    let result = Order.find(queryObject).populate({
        path: 'items.product',
        select: 'name image'
    }).populate({
        path: 'user',
        select: '-password'
    });
    if (sortBy === 'newest') {
        result = result.sort('-createdAt');
    }
    if (sortBy === 'oldest') {
        result = result.sort('createdAt');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const orders = await result;
    const totalOrders = await Order.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalOrders / limit);
    return res.status(StatusCodes.OK).json({orders, totalOrders, numberOfPages});
}

const getUserSpecificOrders = async(req: OrderRequest, res: Response) => {
    const {startDate, endDate, minimumTotal, maximumTotal, orderStatus, sortBy} = req.query;
    const queryObject: IQueryObject = {
        user: req.user!.userID
    };
    const startMoment = moment(startDate, 'MM/DD/YYYY');
    const endMoment = moment(endDate, 'MM/DD/YYYY');
    if (startMoment.isValid() && endMoment.isValid()) {
        queryObject.createdAt = {
            $gte: startMoment.startOf('day').toDate(),
            $lte: endMoment.endOf('day').toDate()
        };
    }
    if (minimumTotal && maximumTotal) {
        queryObject.total = {$gte: Number(minimumTotal) * 100, $lte: Number(maximumTotal) * 100};
    }
    if (orderStatus) {
        queryObject.status = {$regex: orderStatus, $options: 'i'};
    }
    let result = Order.find(queryObject).populate({
        path: 'items.product',
        select: 'name image'
    }).populate({
        path: 'user',
        select: '-password'
    });
    if (sortBy === 'newest') {
        result = result.sort('-createdAt');
    }
    if (sortBy === 'oldest') {
        result = result.sort('createdAt');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const orders = await result;
    const totalOrders = await Order.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalOrders / limit);
    return res.status(StatusCodes.OK).json({orders, totalOrders, numberOfPages});
}

const createPaymentIntent = async(req: OrderRequest, res: Response) => {
    const {items} = req.body;
    const itemsJSON = parseJSONWithFallback(items);
    if (!itemsJSON || !Array.isArray(itemsJSON)) {
        // The input is not valid JSON or equal to an array
        throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
    }
    if (!itemsJSON.length) {
        // The input is an empty array
        throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
    }
    let subTotal = 0;
    let total = 0;
    let shippingTotal = 0;
    for (const item of itemsJSON) {
        if (typeof item !== 'object') {
            // The item is not an object
            throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (!item.product || !item.amount || !item.color || !item.condition) {
            // The item does not follow the correct format
            throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        const productFromDatabase = await Product.findOne({_id: item.product});
        if (!productFromDatabase) {
            // The item is not a valid product
            throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (!productFromDatabase.colors.includes(item.color)) {
            // The item has a color that is not provided in the product listing
            throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (productFromDatabase.condition !== item.condition) {
            // The item is set to a condition that is not provided in the product listing
            throw new CustomError.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        const {price, shippingFee} = productFromDatabase;
        shippingTotal += shippingFee;
        subTotal += (price * item.amount);
    }
    total += subTotal + shippingTotal;
    const tax = total * 0.05; // Tax is 5% as thats the average according to Google, so that would be 0.05
    total += tax;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd'
    });
    return res.status(StatusCodes.OK).json({
        total: total, 
        subTotal: subTotal,
        shippingFee: shippingTotal,
        tax: tax,
        items: itemsJSON,
        clientSecret: paymentIntent.client_secret
    });
}

const createOrder = async(req: OrderRequest, res: Response) => {
    const {clientSecret} = req.body;
    // Because we are going to use the clientSecret to do some checks we first need to check if it exists
    if (!clientSecret) {
        throw new CustomError.BadRequestError('Please provide clientSecret for order creation!');
    }
    // Before checking if the paymentIntent is valid, we first need to manipulate the clientSecret by returning only a certain part which is everything before the "_secret_" text in the clientSecret.
    const paymentIntent = await isValidPaymentIntent(clientSecret.split('_secret_')[0]);
    if (!paymentIntent) {
        throw new CustomError.BadRequestError('Invalid Client Secret!');
    }
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    const order = await Order.create(req.body);
    return res.status(StatusCodes.CREATED).json({order});
}

const getSingleOrder = async(req: OrderRequest, res: Response) => {
    const {id} = req.params;
    const order = await Order.findOne({_id: id}).populate({
        path: 'items.product'
    });
    if (!order) {
        throw new CustomError.NotFoundError('No Order Found with the ID Provided!');
    }
    checkIfAllowed(req.user!, order.user as any);
    return res.status(StatusCodes.OK).json({order});
}

const updateSingleOrder = async(req: OrderRequest, res: Response) => {
    const {id} = req.params;
    const order = await Order.findOne({_id: id});
    if (!order) {
        throw new CustomError.NotFoundError('No Order Found with the ID Provided!');
    }
    checkIfAllowed(req.user!, order.user as any);
    const updatedOrder = (await Order.findOneAndUpdate({_id: id}, req.body, {
        new: true,
        runValidators: true,
    }).populate({
        path: 'items.product'
    }))!;
    return res.status(StatusCodes.OK).json({order: updatedOrder});
}

const deleteSingleOrder = async(req: OrderRequest, res: Response) => {
    const {id} = req.params;
    const order = await Order.findOne({_id: id});
    if (!order) {
        throw new CustomError.NotFoundError('No Order Found with the ID Provided!');
    }
    await order.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Order!'});
}

export {
    getAllOrders,
    getUserSpecificOrders, 
    createPaymentIntent,
    createOrder,
    getSingleOrder,
    updateSingleOrder,
    deleteSingleOrder
};