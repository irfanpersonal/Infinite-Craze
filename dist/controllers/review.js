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
exports.deleteSingleReview = exports.updateSingleReview = exports.getSingleReview = exports.createReview = exports.getAllProductReviews = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const errors_1 = __importDefault(require("../errors"));
const utils_1 = require("../utils");
const getAllProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productID } = req.params;
    const { ratingValue, sortValue } = req.query;
    const product = yield models_1.Product.findOne({ _id: productID });
    if (!product) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    const queryObject = {
        product: productID
    };
    if (ratingValue) {
        queryObject.rating = ratingValue;
    }
    let result = models_1.Review.find(queryObject).populate({
        path: 'user',
        select: '-password'
    });
    if (sortValue === 'latest') {
        result = result.sort('-createdAt');
    }
    if (sortValue === 'oldest') {
        result = result.sort('createdAt');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const reviews = yield result;
    const totalReviews = yield models_1.Review.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, totalReviews, numberOfPages });
});
exports.getAllProductReviews = getAllProductReviews;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productID, reviewID } = req.params;
    const didOrder = yield models_1.Order.findOne({
        user: req.user.userID,
        items: {
            $elemMatch: {
                product: productID
            }
        }
    });
    const doesProductExist = yield models_1.Product.findOne({ _id: productID });
    if (!doesProductExist) {
        throw new errors_1.default.NotFoundError('No Product Found with the ID Provided!');
    }
    if (!didOrder) {
        throw new errors_1.default.NotFoundError('You need to have bought this product at some point in time to leave a review.');
    }
    const didWriteReviewAlready = yield models_1.Review.findOne({
        user: req.user.userID,
        product: productID
    });
    if (didWriteReviewAlready) {
        throw new errors_1.default.BadRequestError('You already wrote a review for this product!');
    }
    req.body.product = productID;
    req.body.user = req.user.userID;
    const review = yield models_1.Review.create(req.body);
    const newAverageRating = (yield models_1.Product.findOne({ _id: productID })).averageRating;
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ review, newAverageRating });
});
exports.createReview = createReview;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewID } = req.params;
    const review = yield models_1.Review.findOne({ _id: reviewID });
    if (!review) {
        throw new errors_1.default.NotFoundError('No Review Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.getSingleReview = getSingleReview;
const updateSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productID, reviewID } = req.params;
    const review = yield models_1.Review.findOne({ _id: reviewID });
    if (!review) {
        throw new errors_1.default.NotFoundError('No Review Found with the ID Provided!');
    }
    (0, utils_1.checkIfAllowed)(req.user, review.user);
    const { rating, title, comment } = req.body;
    if (rating) {
        if (rating === '1' || rating === '2' || rating === '3' || rating === '4' || rating === '5') {
            review.rating = rating;
        }
    }
    if (title) {
        review.title = title;
    }
    if (comment) {
        review.comment = comment;
    }
    yield review.save();
    const newAverageRating = (yield models_1.Product.findOne({ _id: productID })).averageRating;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ review, newAverageRating });
});
exports.updateSingleReview = updateSingleReview;
const deleteSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productID, reviewID } = req.params;
    const review = yield models_1.Review.findOne({ _id: reviewID });
    if (!review) {
        throw new errors_1.default.NotFoundError('No Review Found with the ID Provided!');
    }
    yield review.deleteOne();
    const newAverageRating = (yield models_1.Product.findOne({ _id: productID })).averageRating;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Review!', newAverageRating });
});
exports.deleteSingleReview = deleteSingleReview;
