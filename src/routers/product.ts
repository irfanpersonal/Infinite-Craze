import express from 'express';
const router: express.Router = express.Router();

import {authentication, restrictFunctionalityTo} from '../middleware/authentication';
import {getAllProducts, createProduct, getSingleProduct, getSingleProductWithAuth, updateSingleProduct, deleteSingleProduct} from '../controllers/product';
import {getAllProductReviews, createReview, getSingleReview, updateSingleReview, deleteSingleReview} from '../controllers/review';

router.route('/').get(getAllProducts).post(authentication, restrictFunctionalityTo('admin'), createProduct);
router.route('/:id').get(getSingleProduct).patch(authentication, restrictFunctionalityTo('admin'), updateSingleProduct).delete(authentication, restrictFunctionalityTo('admin'), deleteSingleProduct);
router.route('/:id/withAuth').get(authentication, getSingleProductWithAuth);
router.route('/:id/review').get(getAllProductReviews).post(authentication, restrictFunctionalityTo('user'), createReview);
router.route('/:id/review/:reviewID').get(getSingleReview).patch(authentication, restrictFunctionalityTo('user'), updateSingleReview).delete(authentication, restrictFunctionalityTo('user'), deleteSingleReview);

export default router;