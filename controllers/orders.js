const {StatusCodes} = require('http-status-codes');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const CustomError = require('../errors');
const {checkIfAllowed} = require('../utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getAllOrders = async(req, res) => {
    const orders = await Order.find();
    return res.status(StatusCodes.OK).json({orders, count: orders.length});
}

const createPaymentIntent = async (req, res) => {
    const {tax, shippingFee, items} = req.body;
    if (!tax || !shippingFee || !items.length) {
        throw new CustomError.BadRequestError('Please provide tax, shippingFee, and items!');
    }
    let subTotal = 0;
    let total = 0;
    for (const item of items) {
        if (!item.product || !item.amount || !item.color) {
            throw new CustomError.BadRequestError('Invalid Format of Cart Items!');
        }
        const dbProduct = await Product.findOne({_id: item.product});
        if (!dbProduct) {
            throw new CustomError.NotFoundError('No Product Found with the ID Provided for Cart Item!');
        }
        if (!dbProduct.colors.includes(item.color)) {
            throw new CustomError.BadRequestError('Unsupported Color Provided for Cart Item!');
        }
        const {price} = dbProduct;
        subTotal += price * item.amount;
    }
    total += subTotal + tax + shippingFee;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd'
    });
    return res.status(StatusCodes.OK).json({clientSecret: paymentIntent.client_secret});
};

const createOrder = async(req, res) => {
    const {items} = req.body;
    for (const item of items) {
        const dbProduct = await Product.findOne({_id: item.product});
        dbProduct.inventory = dbProduct.inventory - item.amount;
        await dbProduct.save();
    }
    req.body.user = req.user.userID;
    req.body.subTotal = req.body.total - 499 - 299;
    const order = await Order.create(req.body);
    return res.status(StatusCodes.CREATED).json({order});
}

const getCurrentUserOrders = async(req, res) => {
    const orders = await Order.find({user: req.user.userID}).populate('user');
    return res.status(StatusCodes.OK).json({orders, count: orders.length});
}

const getSingleOrder = async(req, res) => {
    const {id} = req.params;
    const order = await Order.findOne({_id: id});
    if (!order) {
        throw new CustomError.NotFoundError('No Order Found with the ID Provided!');
    }
    checkIfAllowed(req.user, order.user);
    return res.status(StatusCodes.OK).json({order});
}

const updateSingleOrder = async(req, res) => {
    const {id} = req.params;
    const order = await Order.findOne({_id: id});
    if (!order) {
        throw new CustomError.NotFoundError('No Order Found with the ID Provided!');
    }
    checkIfAllowed(req.user, order.user);
    const {status} = req.body;
    const allowedStatusValues = ['paid', 'preparing', 'shipped', 'delivered'];
    if (status) {
        if (allowedStatusValues.includes(status)) {
            order.status = status;
        } else {
            throw new CustomError.BadRequestError('Invalid Status Provided!');
        }
    }
    await order.save();
    return res.status(StatusCodes.OK).json({order});
}

module.exports = {
    getAllOrders,
    createPaymentIntent,
    createOrder,
    getCurrentUserOrders,
    getSingleOrder,
    updateSingleOrder
};