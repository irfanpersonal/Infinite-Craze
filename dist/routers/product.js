"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authentication_1 = require("../middleware/authentication");
const product_1 = require("../controllers/product");
const review_1 = require("../controllers/review");
router.route('/').get(product_1.getAllProducts).post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), product_1.createProduct);
router.route('/:id').get(product_1.getSingleProduct).patch(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), product_1.updateSingleProduct).delete(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), product_1.deleteSingleProduct);
router.route('/:id/withAuth').get(authentication_1.authentication, product_1.getSingleProductWithAuth);
router.route('/:id/review').get(review_1.getAllProductReviews).post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('user'), review_1.createReview);
router.route('/:id/review/:reviewID').get(review_1.getSingleReview).patch(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('user'), review_1.updateSingleReview).delete(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('user'), review_1.deleteSingleReview);
exports.default = router;
