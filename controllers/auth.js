const {StatusCodes} = require('http-status-codes');
const User = require('../models/User.js');
const {createToken, createCookieWithToken} = require('../utils');
const CustomError = require('../errors');

const register = async(req, res) => {
    const {name, email, password} = req.body;
    const isFirstAccount = await User.countDocuments() === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({name, email, password, role});
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.CREATED).json({user: {
        name: user.name,
        email: user.email,
        role: user.role
    }});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password!');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new CustomError.BadRequestError('No User Found with the Email Provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Invalid Password!');
    }
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.OK).json({user: {
        name: user.name,
        email: user.email,
        role: user.role
    }});
}

const logout = async(req, res) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({msg: 'Logout'});
}

module.exports = {
    register,
    login,
    logout
};