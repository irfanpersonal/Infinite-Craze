"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleOrder = exports.updateSingleOrder = exports.getSingleOrder = exports.createOrder = exports.createPaymentIntent = exports.getUserSpecificOrders = exports.getAllOrders = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const errors_1 = __importDefault(require("../errors"));
const stripe_1 = __importDefault(require("stripe"));
const utils_1 = require("../utils");
const moment_1 = __importDefault(require("moment"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const parseJSONWithFallback = (input) => {
    try {
        return JSON.parse(input);
    }
    catch (error) {
        return false;
    }
};
const isValidPaymentIntent = (clientSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.retrieve(clientSecret);
        return paymentIntent;
    }
    catch (error) {
        return false;
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, startDate, endDate, minimumTotal, maximumTotal, orderStatus, sortBy } = req.query;
    const queryObject = {};
    const startMoment = (0, moment_1.default)(startDate, 'MM/DD/YYYY');
    const endMoment = (0, moment_1.default)(endDate, 'MM/DD/YYYY');
    if (username) {
        const user = yield models_1.User.findOne({ name: username });
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
        queryObject.total = { $gte: Number(minimumTotal) * 100, $lte: Number(maximumTotal) * 100 };
    }
    if (orderStatus) {
        queryObject.status = { $regex: orderStatus, $options: 'i' };
    }
    let result = models_1.Order.find(queryObject).populate({
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
    const orders = yield result;
    const totalOrders = yield models_1.Order.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalOrders / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ orders, totalOrders, numberOfPages });
});
exports.getAllOrders = getAllOrders;
const getUserSpecificOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, minimumTotal, maximumTotal, orderStatus, sortBy } = req.query;
    const queryObject = {
        user: req.user.userID
    };
    const startMoment = (0, moment_1.default)(startDate, 'MM/DD/YYYY');
    const endMoment = (0, moment_1.default)(endDate, 'MM/DD/YYYY');
    if (startMoment.isValid() && endMoment.isValid()) {
        queryObject.createdAt = {
            $gte: startMoment.startOf('day').toDate(),
            $lte: endMoment.endOf('day').toDate()
        };
    }
    if (minimumTotal && maximumTotal) {
        queryObject.total = { $gte: Number(minimumTotal) * 100, $lte: Number(maximumTotal) * 100 };
    }
    if (orderStatus) {
        queryObject.status = { $regex: orderStatus, $options: 'i' };
    }
    let result = models_1.Order.find(queryObject).populate({
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
    const orders = yield result;
    const totalOrders = yield models_1.Order.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalOrders / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ orders, totalOrders, numberOfPages });
});
exports.getUserSpecificOrders = getUserSpecificOrders;
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    const itemsJSON = parseJSONWithFallback(items);
    if (!itemsJSON || !Array.isArray(itemsJSON)) {
        // The input is not valid JSON or equal to an array
        throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
    }
    if (!itemsJSON.length) {
        // The input is an empty array
        throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
    }
    let subTotal = 0;
    let total = 0;
    let shippingTotal = 0;
    for (const item of itemsJSON) {
        if (typeof item !== 'object') {
            // The item is not an object
            throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (!item.product || !item.amount || !item.color || !item.condition) {
            // The item does not follow the correct format
            throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        const productFromDatabase = yield models_1.Product.findOne({ _id: item.product });
        if (!productFromDatabase) {
            // The item is not a valid product
            throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (!productFromDatabase.colors.includes(item.color)) {
            // The item has a color that is not provided in the product listing
            throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        if (productFromDatabase.condition !== item.condition) {
            // The item is set to a condition that is not provided in the product listing
            throw new errors_1.default.BadRequestError('Cart Items Data/Format is Incorrect!');
        }
        const { price, shippingFee } = productFromDatabase;
        shippingTotal += shippingFee;
        subTotal += (price * item.amount);
    }
    total += subTotal + shippingTotal;
    const tax = total * 0.05; // Tax is 5% as thats the average according to Google, so that would be 0.05
    total += tax;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: total,
        currency: 'usd'
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        total: total,
        subTotal: subTotal,
        shippingFee: shippingTotal,
        tax: tax,
        items: itemsJSON,
        clientSecret: paymentIntent.client_secret
    });
});
exports.createPaymentIntent = createPaymentIntent;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientSecret } = req.body;
    // Because we are going to use the clientSecret to do some checks we first need to check if it exists
    if (!clientSecret) {
        throw new errors_1.default.BadRequestError('Please provide clientSecret for order creation!');
    }
    // Before checking if the paymentIntent is valid, we first need to manipulate the clientSecret by returning only a certain part which is everything before the "_secret_" text in the clientSecret.
    const paymentIntent = yield isValidPaymentIntent(clientSecret.split('_secret_')[0]);
    if (!paymentIntent) {
        throw new errors_1.default.BadRequestError('Invalid Client Secret!');
    }
    req.body.user = req.user.userID;
    const order = yield models_1.Order.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ order });
});
exports.createOrder = createOrder;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield models_1.Order.findOne({ _id: id }).populate({
        path: 'items.product'
    });
    if (!order) {
        throw new errors_1.default.NotFoundError('No Order Found with the ID Provided!');
    }
    (0, utils_1.checkIfAllowed)(req.user, order.user);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ order });
});
exports.getSingleOrder = getSingleOrder;
const updateSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield models_1.Order.findOne({ _id: id });
    if (!order) {
        throw new errors_1.default.NotFoundError('No Order Found with the ID Provided!');
    }
    (0, utils_1.checkIfAllowed)(req.user, order.user);
    const updatedOrder = (yield models_1.Order.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    }).populate({
        path: 'items.product'
    }));
    return res.status(http_status_codes_1.StatusCodes.OK).json({ order: updatedOrder });
});
exports.updateSingleOrder = updateSingleOrder;
const deleteSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield models_1.Order.findOne({ _id: id });
    if (!order) {
        throw new errors_1.default.NotFoundError('No Order Found with the ID Provided!');
    }
    yield order.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Order!' });
});
exports.deleteSingleOrder = deleteSingleOrder;
