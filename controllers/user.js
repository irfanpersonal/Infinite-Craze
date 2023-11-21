const {StatusCodes} = require('http-status-codes');
const User = require('../models/User.js');
const CustomError = require('../errors');
const {checkIfAllowed} = require('../utils');

const getAllUsers = async(req, res) => {
    const users = await User.find().select('name email role');
    return res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async(req, res) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id});
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the Information Provided!');
    }
    checkIfAllowed(req.user, id);
    return res.status(StatusCodes.OK).json({user});
}

const showCurrentUser = async(req, res) => {
    return res.status(StatusCodes.OK).json({user: req.user});
}

const updateUser = async(req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email!');
    }
    const user = await User.findOne({_id: req.user.userID});
    user.name = name;
    user.email = email;
    await user.save();
    return res.status(StatusCodes.OK).json({user: {
        name: user.name,
        email: user.email,
        role: user.role
    }});
}

const updateUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = await User.findOne({_id: req.user.userID});
    const isOldPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    user.save();
    return res.status(StatusCodes.OK).json({user: {
        name: user.name,
        email: user.email,
        role: user.role
    }});
}

const deleteSingleUser = async(req, res) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id});
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    await user.deleteOne();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Single User!'});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteSingleUser
};