const {StatusCodes} = require('http-status-codes');
const Product = require('../models/Product.js');
const CustomError = require('../errors');
const path = require('node:path');
const cloudinary = require('cloudinary').v2;
const fs = require('node:fs');

const getAllProducts = async(req, res) => {
    const queryObject = {};
    const {search} = req.query;
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = Product.find(queryObject);
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = await result;
    const totalProducts = await Product.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalProducts / limit);
    return res.status(StatusCodes.OK).json({products, totalProducts, numberOfPages});
}

const createProduct = async(req, res) => {
    if (!req?.files?.image || !req.body.colors) {
        throw new CustomError.BadRequestError('Please check all inputs!');
    }
    const image = req.files.image;
    if (!image.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('File Must Be Image!');
    }
    const limit = 1000000 * 2;
    if (image.size > limit) {
        throw new CustomError.BadRequestError('Image Must Be Below 2MB!');
    }
    const uniqueIdentifier = new Date().getTime() + '_' + image.name;
    const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
    await image.mv(destination);
    const result = await cloudinary.uploader.upload(destination, {
        use_filename: true,
        folder: 'INFINITE-CRAZE-API-IMAGES'
    });
    await fs.unlink(destination, (err) => {
        if (err) {
            console.log(err);
        }
    });
    req.body.price = req.body.price * 100;
    req.body.image = result.secure_url;
    req.body.user = req.user.userID;
    req.body.colors = req.body.colors.split(' ');
    const product = await Product.create(req.body);
    return res.status(StatusCodes.CREATED).json({product});
}

const getSingleProduct = async(req, res) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({product});
}

const updateSingleProduct = async(req, res) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const {name, category, price, colors, inventory} = req.body;
    if (name) {
        product.name = name;
    }
    if (category) {
        const acceptableCategories = ['motors', 'electronics', 'fashion', 'toys', 'essentials'];
        if (!acceptableCategories.includes(category)) {
            throw new CustomError.BadRequestError('Unsupported Category Value Provided!');
        }
        product.category = category;
    }
    if (price) {
        product.price = price * 100;
    }
    if (colors) {
        const stringToArray = colors.split(' ');
        product.colors = stringToArray;
    }
    if (inventory) {
        product.inventory = inventory;
    }
    if (req?.files?.image) {
        const image = req.files.image;
        if (!image.mimetype.startsWith('image')) {
            throw new CustomError.BadRequestError('File Must Be Image!');
        }
        const limit = 1000000 * 2;
        if (image.size > limit) {
            throw new CustomError.BadRequestError('Image Must Be Below 2MB!');
        }
        const imageIdentifier = product.image.split('/INFINITE-CRAZE-API-IMAGES/')[1].split('.')[0];
        await cloudinary.uploader.destroy(`INFINITE-CRAZE-API-IMAGES/${imageIdentifier}`);
        const uniqueIdentifier = new Date().getTime() + '_' + image.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await image.mv(destination);
        const result = await cloudinary.uploader.upload(destination, {
            use_filename: true,
            folder: 'INFINITE-CRAZE-API-IMAGES'
        });
        product.image = result.secure_url;
        await fs.unlink(destination, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }    
    await product.save();
    return res.status(StatusCodes.OK).json({product});
}

const deleteSingleProduct = async(req, res) => {
    const {id} = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new CustomError.NotFoundError('No Product Found with the ID Provided!');
    }
    const imageIdentifier = product.image.split('/INFINITE-CRAZE-API-IMAGES/')[1].split('.')[0];
    await cloudinary.uploader.destroy(`INFINITE-CRAZE-API-IMAGES/${imageIdentifier}`);
    await product.deleteOne();
    return res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct
};