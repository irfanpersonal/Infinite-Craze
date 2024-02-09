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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const http_status_codes_1 = require("http-status-codes");
const models_1 = require("../models");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let totalEarnings = 0;
    let totalOrders = 0;
    let totalUsers = 0;
    let totalProducts = 0;
    let totalReviews = 0;
    const orders = yield models_1.Order.find();
    orders.map(order => {
        totalEarnings += order.total;
    });
    totalOrders += orders.length;
    const users = yield models_1.User.find({ role: 'user' });
    totalUsers += users.length;
    const products = yield models_1.Product.find();
    totalProducts += products.length;
    const reviews = yield models_1.Review.find();
    totalReviews += reviews.length;
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        totalEarnings: totalEarnings / 100, totalOrders, totalUsers, totalProducts, totalReviews
    });
});
exports.getStats = getStats;
