const {StatusCodes} = require('http-status-codes');
const User = require('../models/User.js');
const Order = require('../models/Order.js');
const CustomError = require('../errors');

const getStats = async(req, res) => {
    let totalUsers = await User.find().countDocuments();
    let earnings = 0;
    const orders = await Order.find();
    let numberOfOrders = orders.length;
    for (let i = 0; i < orders.length; i++) {
        earnings += orders[i].total;
    }
    return res.status(StatusCodes.OK).json({totalUsers, numberOfOrders, earnings});
}

module.exports = {
    getStats
};