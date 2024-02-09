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
exports.deleteSingleProduct = exports.updateSingleProduct = exports.getSingleProductWithAuth = exports.getSingleProduct = exports.createProduct = exports.getAllProducts = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("cloudinary");
const validateProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const productInstance = new models_1.Product(productData);
    try {
        yield productInstance.validate();
        return true;
    }
    catch (error) {
        return false;
    }
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category, state, minimumBudget, maximumBudget, sort } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    if (category) {
        queryObject.category = { $regex: category, $options: 'i' };
    }
    if (state) {
        queryObject.condition = { $regex: state, $options: 'i' };
    }
    if (minimumBudget && maximumBudget) {
        queryObject.price = { $gte: Number(minimumBudget) * 100, $lte: Number(maximumBudget) * 100 };
    }
    let result = models_1.Product.find(queryObject);
    if (sort === 'a-z') {
        result = result.sort('name');
    }
    else if (sort === 'z-a') {
        result = result.sort('-name');
    }
    else if (sort === 'lowest') {
        result = result.sort('price');
    }
    else if (sort === 'highest') {
        result = result.sort('-price');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = yield result.select('-password');
    const totalProducts = yield models_1.Product.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalProducts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ products, totalProducts, numberOfPages });
});
exports.getAllProducts = getAllProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.body.user = req.user.userID;
    req.body.image = 'JUST TO SATISFY MONGOOSE';
    const productInstance = new models_1.Product(req.body);
    const isValid = yield validateProduct(productInstance);
    if (!isValid) {
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) {
            yield (0, utils_1.deleteImage)(req.files.image.tempFilePath);
        }
        throw new errors_1.default.BadRequestError('Please provide/check all inputs for product creation!');
    }
    if (!((_b = req.files) === null || _b === void 0 ? void 0 : _b.image)) {
        yield (0, utils_1.deleteImage)(((_c = req.files) === null || _c === void 0 ? void 0 : _c.image).tempFilePath);
        throw new errors_1.default.BadRequestError('Please provide a product image!');
    }
    const image = req.files.image;
    if (!image.mimetype.startsWith('image')) {
        yield (0, utils_1.deleteImage)(image.tempFilePath);
        throw new errors_1.default.BadRequestError('File must be an image!');
    }
    if (image.size > 1000000 * 2) {
        yield (0, utils_1.deleteImage)(image.tempFilePath);
        throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'product' + '_' + image.name;
    const result = yield cloudinary_1.v2.uploader.upload(image.tempFilePath, {
        public_id: uniqueIdentifier,
        folder: 'INFINITE-CRAZE/PRODUCT_IMAGES'
    });
    yield (0, utils_1.deleteImage)(image.tempFilePath);
    req.body.image = result.secure_url;
    const product = yield models_1.Product.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ product });
});
exports.createProduct = createProduct;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield models_1.Product.findOne({ _id: id });
    if (!product) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const getSingleProductWithAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield models_1.Product.findOne({ _id: id });
    if (!product) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    const alreadyWroteReview = Boolean(yield models_1.Review.findOne({ product: id, user: req.user.userID }));
    const order = yield models_1.Order.findOne({ user: req.user.userID, items: { $elemMatch: { product: id } } }).sort('-createdAt');
    const didOrder = Boolean(order);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ product, alreadyWroteReview, didOrder, latestOrderForThisProduct: order });
});
exports.getSingleProductWithAuth = getSingleProductWithAuth;
const updateSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { id } = req.params;
    const product = (yield models_1.Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    }));
    const updateMe = (yield models_1.Product.findOne({ _id: id }));
    if (!product) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    if ((_d = req.files) === null || _d === void 0 ? void 0 : _d.image) {
        const image = req.files.image;
        if (!image.mimetype.startsWith('image')) {
            yield (0, utils_1.deleteImage)(image.tempFilePath);
            throw new errors_1.default.BadRequestError('File must be an image!');
        }
        if (image.size > 1000000 * 2) {
            yield (0, utils_1.deleteImage)(image.tempFilePath);
            throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'product' + '_' + image.name;
        const oldImage = product.image.substring(product.image.indexOf('INFINITE'));
        yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = yield cloudinary_1.v2.uploader.upload(image.tempFilePath, {
            public_id: uniqueIdentifier,
            folder: 'INFINITE-CRAZE/PRODUCT_IMAGES'
        });
        yield (0, utils_1.deleteImage)(image.tempFilePath);
        updateMe.image = result.secure_url;
        yield updateMe.save();
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ product: updateMe });
});
exports.updateSingleProduct = updateSingleProduct;
const deleteSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield models_1.Product.findOne({ _id: id });
    if (!product) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    const image = product.image.substring(product.image.indexOf('INFINITE'));
    yield cloudinary_1.v2.uploader.destroy(image.substring(0, image.lastIndexOf('.')));
    yield product.deleteOne();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Product!' });
});
exports.deleteSingleProduct = deleteSingleProduct;
