"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const order_1 = require("../controllers/order");
const authentication_1 = require("../middleware/authentication");
router.route('/').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), order_1.getAllOrders).post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('user'), order_1.createOrder);
router.route('/getUserSpecificOrders').get(authentication_1.authentication, order_1.getUserSpecificOrders);
router.route('/createPaymentIntent').post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('user'), order_1.createPaymentIntent);
router.route('/:id').get(authentication_1.authentication, order_1.getSingleOrder).patch(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), order_1.updateSingleOrder).delete(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), order_1.deleteSingleOrder);
exports.default = router;
