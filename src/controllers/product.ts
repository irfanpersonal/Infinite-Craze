import {IProduct} from '../models/Product';
import {Product, Review, Order} from '../models';
import {ITokenPayload, deleteImage} from '../utils';
import CustomError from '../errors';
import mongoose from 'mongoose';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {v2 as cloudinary} from 'cloudinary';
import {UploadedFile} from 'express-fileupload';

const validateProduct = async(productData: IProduct) => {
    const productInstance = new Product(productData);
    try {
        await productInstance.validate();
        return true;
    } catch (error) {
        return false; 
    }
};

interface ProductRequest extends Request {
    params: {id: string}
    body: IProduct,
    query: {
        [index: string]: any,
        search?: string,
        category?: string,
        state?: 'new' | 'used' | 'refurbished' | 'damaged',
        minimumBudget?: string,
        maximumBudget?: string,
        sort?: 'a-z' | 'z-a' | 'lowest' | 'highest',
        rating?: number,
        limit?: string,
        page?: string
    },
    user?: ITokenPayload,
}

interface IQueryObject {
    name?: {$regex: string, $options: string},
    category?: {$regex: string, $options: string},
    condition?: {$regex: string, $options: string},
    price?: {$gte: number, $lte: number}
}

const getAllProducts = async(req: ProductRequest, res: Response) => {
    const {search, category, state, minimumBudget, maximumBudget, sort} = req.query;
    const queryObject: IQueryObject = {}
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    if (category) {
        queryObject.category = {$regex: category, $options: 'i'};
    }
    if (state) {
        queryObject.condition = {$regex: state, $options: 'i'};
    }
    if (minimumBudget && maximumBudget) {
        queryObject.price = {$gte: Number(minimumBudget) * 100, $lte: Number(maximumBudget) * 100};
    }
    let result = Product.find(queryObject);
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
    const products = await result.select('-password');
    const totalProducts = await Product.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalProducts / limit);
    return res.status(StatusCodes.OK).json({products, totalProducts, numberOfPages});
}

const createProduct = async(req: ProductRequest, res: Response) => {
    req.body.user = req.user!.userID as unknown as mongoose.Schema.Types.ObjectId;
    req.body.image = 'JUST TO SATISFY MONGOOSE';
    const productInstance = new Product(req.body);
    const isValid = await validateProduct(productInstance);
    if (!isValid) {
        if (req.files?.image) {
            await deleteImage((req.files.image as UploadedFile).tempFilePath);
        }
        throw new CustomError.BadRequestError('Please provide/check all inputs for product creation!');
    }
    if (!req.files?.image) {
        await deleteImage((req.files?.image as UploadedFile).tempFilePath);
        throw new CustomError.BadRequestError('Please provide a product image!');
    }
    const image = req.files.image as UploadedFile;
    if (!image.mimetype.startsWith('image')) {
        await deleteImage(image.tempFilePath);
        throw new CustomError.BadRequestError('File must be an image!');
    }
    if (image.size > 1000000 * 2) {
        await deleteImage(image.tempFilePath);
        throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'product' + '_' + image.name;
    const result = await cloudinary.uploader.upload(image.tempFilePath, {
        public_id: uniqueIdentifier, 
        folder: 'INFINITE-CRAZE/PRODUCT_IMAGES'
    });
    await deleteImage(image.tempFilePath);
    req.body.image = result.secure_url;
    const product = await Product.create(req.body);
    return res.status(StatusCodes.CREATED).json({product});
}

const getSingleProduct = async(req: ProductRequest, res: Response) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({product});
}

const getSingleProductWithAuth = async(req: ProductRequest, res: Response) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const alreadyWroteReview = Boolean(await Review.findOne({product: id, user: req.user!.userID}));
    const order = await Order.findOne({user: req.user!.userID, items: {$elemMatch: {product: id}}}).sort('-createdAt');
    const didOrder = Boolean(order);
    return res.status(StatusCodes.OK).json({product, alreadyWroteReview, didOrder, latestOrderForThisProduct: order});
}

const updateSingleProduct = async(req: ProductRequest, res: Response) => {
    const {id} = req.params;
    const product = (await Product.findOneAndUpdate({_id: id}, req.body, {
        new: true,
        runValidators: true,
    }))!;
    const updateMe = (await Product.findOne({_id: id}))!;
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    if (req.files?.image) {
        const image = req.files.image as UploadedFile;
        if (!image.mimetype.startsWith('image')) {
            await deleteImage(image.tempFilePath);
            throw new CustomError.BadRequestError('File must be an image!');
        }
        if (image.size > 1000000 * 2) {
            await deleteImage(image.tempFilePath);
            throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'product' + '_' + image.name;
        const oldImage = product.image.substring(product.image.indexOf('INFINITE'));
        await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            public_id: uniqueIdentifier, 
            folder: 'INFINITE-CRAZE/PRODUCT_IMAGES'
        });
        await deleteImage(image.tempFilePath);
        updateMe.image = result.secure_url;
        await updateMe.save();
    }
    return res.status(StatusCodes.OK).json({product: updateMe});
}

const deleteSingleProduct = async(req: ProductRequest, res: Response) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const image = product.image.substring(product.image.indexOf('INFINITE'));
    await cloudinary.uploader.destroy(image.substring(0, image.lastIndexOf('.')));
    await product.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Product!'});
}

export {
    getAllProducts,
    createProduct,
    getSingleProduct,
    getSingleProductWithAuth,
    updateSingleProduct,
    deleteSingleProduct
};