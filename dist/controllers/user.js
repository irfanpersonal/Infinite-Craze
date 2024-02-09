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
exports.deleteAccount = exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.showCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const models_1 = require("../models");
const errors_1 = __importDefault(require("../errors"));
const cloudinary_1 = require("cloudinary");
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
});
exports.showCurrentUser = showCurrentUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, sort } = req.query;
    const queryObject = {};
    if (search) {
        queryObject.name = { $regex: search, $options: 'i' };
    }
    let result = models_1.User.find(queryObject);
    if (sort === 'a-z') {
        result = result.sort('name');
    }
    if (sort === 'z-a') {
        result = result.sort('-name');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = yield result.select('-password');
    const totalUsers = yield models_1.User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ users, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findOne({ _id: id }).select('-password');
    if (!user) {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    if (req.user.role === 'admin' || req.user.userID === id) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
    }
    throw new errors_1.default.ForbiddenError('You are not allowed to access single user data unless you are an admin or the user account belongs to you!');
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.role = "user";
    const updatedUser = (yield models_1.User.findOneAndUpdate({ _id: req.user.userID }, req.body, {
        new: true,
        runValidators: true,
    }).select('-password'));
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture) {
        if (updatedUser.profilePicture) {
            const oldImage = updatedUser.profilePicture.substring(updatedUser.profilePicture.indexOf('INFINITE'));
            yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const profilePicture = req.files.profilePicture;
        if (!profilePicture.mimetype.startsWith('image')) {
            yield (0, utils_1.deleteImage)(profilePicture.tempFilePath);
            throw new errors_1.default.BadRequestError('File must be an image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            yield (0, utils_1.deleteImage)(profilePicture.tempFilePath);
            throw new errors_1.default.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'profile' + '_' + profilePicture.name;
        const result = yield cloudinary_1.v2.uploader.upload(profilePicture.tempFilePath, {
            public_id: uniqueIdentifier,
            folder: 'INFINITE-CRAZE/PROFILE_IMAGES'
        });
        yield (0, utils_1.deleteImage)(profilePicture.tempFilePath);
        updatedUser.profilePicture = result.secure_url;
        yield updatedUser.save();
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: updatedUser });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (yield models_1.User.findOne({ _id: req.user.userID }));
    const isCorrect = yield user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    yield user.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user: {
            userID: user._id,
            name: user.name,
            email: user.email
        } });
});
exports.updateUserPassword = updateUserPassword;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const user = (yield models_1.User.findOne({ _id: req.user.userID }));
    if (!password) {
        throw new errors_1.default.BadRequestError('Please provide password!');
    }
    const isCorrect = yield user.comparePassword(password);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Password');
    }
    yield user.deleteOne();
    res.clearCookie('token');
    yield models_1.Review.deleteMany({ user: user._id });
    return res.status(http_status_codes_1.StatusCodes.OK).send();
});
exports.deleteAccount = deleteAccount;
