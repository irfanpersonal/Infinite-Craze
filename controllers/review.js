const {StatusCodes} = require('http-status-codes');
const Review = require('../models/Review.js');
const Product = require('../models/Product.js');
const CustomError = require('../errors');
const {checkIfAllowed} = require('../utils');

const getAllReviews = async(req, res) => {
    const reviews = await Review.find();
    return res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}

const createReview = async(req, res) => {
    const {product} = req.body;
    const isValidProduct = await Product.findOne({_id: product});
    if (!isValidProduct) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const alreadySubmitted = await Review.findOne({user: req.user.userID, product});
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError('You already submitted a review for this product!');
    }
    req.body.user = req.user.userID;
    const review = await Review.create(req.body);
    return res.status(StatusCodes.CREATED).json({review});
}

const getSingleReview = async(req, res) => {
    const {id} = req.params;
    const review = await Review.findOne({_id: id});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({review});
}

const updateSingleReview = async(req, res) => {
    const {id} = req.params;
    const {title, rating, comment} = req.body;
    const review = await Review.findOne({_id: id});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    checkIfAllowed(req.user, review.user);
    if (title) {
        review.title = title;
    }
    if (rating) {
        review.rating = rating;
    }
    if (comment) {
        review.comment = comment;
    }
    await review.save();
    return res.status(StatusCodes.OK).json({review});
}

const deleteSingleReview = async(req, res) => {
    const {id} = req.params;
    const review = await Review.findOne({_id: id});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    checkIfAllowed(req.user, review.user);
    await review.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Successfully Deleted Review'});
}

const getSingleProductReviews = async(req, res) => {
    const {id} = req.params;
    const reviews = await Review.find({product: id}).populate('user');
    return res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}

module.exports = {
    getAllReviews,
    createReview,
    getSingleReview,
    updateSingleReview,
    deleteSingleReview,
    getSingleProductReviews
};