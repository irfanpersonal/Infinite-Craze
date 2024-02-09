import {StatusCodes} from 'http-status-codes';
import {Review, Order, Product} from '../models';
import CustomError from '../errors';
import {Request, Response} from 'express';
import {ITokenPayload, checkIfAllowed} from '../utils';
import {IReview} from '../models/Review';
import mongoose from 'mongoose';

interface ReviewRequest extends Request {
    params: {
        id: string,
        reviewID: string
    },
    query: {
        limit?: string,
        page?: string,
        ratingValue?: string,
        sortValue: 'latest' | 'oldest'
    }
    body: IReview,
    user?: ITokenPayload
}

interface IQueryObject {
    product?: string,
    rating?: any
}

const getAllProductReviews = async(req: ReviewRequest, res: Response) => {
    const {id: productID} = req.params;
    const {ratingValue, sortValue} = req.query;
    const product = await Product.findOne({_id: productID});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const queryObject: IQueryObject = {
        product: productID
    };
    if (ratingValue) {
        queryObject.rating = ratingValue;
    }
    let result = Review.find(queryObject).populate({
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
    const reviews = await result;
    const totalReviews = await Review.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(StatusCodes.OK).json({reviews, totalReviews, numberOfPages});
}

const createReview = async(req: ReviewRequest, res: Response) => {
    const {id: productID, reviewID} = req.params;
    const didOrder = await Order.findOne({
        user: req.user!.userID, 
        items: {
            $elemMatch: {
                product: productID
            }
        }
    });
    const doesProductExist = await Product.findOne({_id: productID});
    if (!doesProductExist) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    if (!didOrder) {
        throw new CustomError.NotFoundError('You need to have bought this product at some point in time to leave a review.');
    }
    const didWriteReviewAlready = await Review.findOne({
        user: req.user!.userID,
        product: productID
    });
    if (didWriteReviewAlready) {
        throw new CustomError.BadRequestError('You already wrote a review for this product!');
    }
    req.body.product = productID as unknown as mongoose.Schema.Types.ObjectId;
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    const review = await Review.create(req.body);
    const newAverageRating = (await Product.findOne({_id: productID}))!.averageRating;
    return res.status(StatusCodes.CREATED).json({review, newAverageRating});
}

const getSingleReview = async(req: ReviewRequest, res: Response) => {
    const {reviewID} = req.params;
    const review = await Review.findOne({_id: reviewID});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({review});
}

const updateSingleReview = async(req: ReviewRequest, res: Response) => {
    const {id: productID, reviewID} = req.params;
    const review = await Review.findOne({_id: reviewID});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    checkIfAllowed(req.user!, review.user as any);
    const {rating, title, comment} = req.body;
    if (rating) {
        if ((rating as any) === '1' || (rating as any) === '2' || (rating as any) === '3' || (rating as any) === '4' || (rating as any) === '5') {
            review.rating = rating;
        }
    }
    if (title) {
        review.title = title;
    }
    if (comment) {
        review.comment = comment;
    }
    await review.save();
    const newAverageRating = (await Product.findOne({_id: productID}))!.averageRating;
    return res.status(StatusCodes.OK).json({review, newAverageRating});
}

const deleteSingleReview = async(req: ReviewRequest, res: Response) => {
    const {id: productID, reviewID} = req.params;
    const review = await Review.findOne({_id: reviewID});
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    await review.deleteOne();
    const newAverageRating = (await Product.findOne({_id: productID}))!.averageRating;
    return res.status(StatusCodes.OK).json({msg: 'Deleted Review!', newAverageRating});
}

export {
    getAllProductReviews,
    createReview,
    getSingleReview,
    updateSingleReview,
    deleteSingleReview
};