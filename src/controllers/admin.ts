import {StatusCodes} from 'http-status-codes';
import {Order, Product, Review, User} from '../models';
import {Request, Response} from 'express';

const getStats = async(req: Request, res: Response) => {
    let totalEarnings = 0;
    let totalOrders = 0;
    let totalUsers = 0;
    let totalProducts = 0;
    let totalReviews = 0;
    const orders = await Order.find();
    orders.map(order => {
        totalEarnings += order.total;
    });
    totalOrders += orders.length;
    const users = await User.find({role: 'user'});
    totalUsers += users.length;
    const products = await Product.find();
    totalProducts += products.length;
    const reviews = await Review.find();
    totalReviews += reviews.length;
    const ordersPerMonth = await Order.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 } 
            }
        },
        {
            $project: {
                month: "$_id",
                count: 1,
                _id: 0
            }
        }
    ]);
    return res.status(StatusCodes.OK).json({
        totalEarnings: totalEarnings / 100, totalOrders, totalUsers, totalProducts, totalReviews, ordersPerMonth
    });
}

export {
    getStats
};