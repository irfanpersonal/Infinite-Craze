import express from 'express';
const router: express.Router = express.Router();

import {getAllOrders, getUserSpecificOrders, createPaymentIntent, createOrder, getSingleOrder, updateSingleOrder, deleteSingleOrder} from '../controllers/order';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(authentication, restrictFunctionalityTo('admin'), getAllOrders).post(authentication, restrictFunctionalityTo('user'), createOrder);
router.route('/getUserSpecificOrders').get(authentication, getUserSpecificOrders);
router.route('/createPaymentIntent').post(authentication, restrictFunctionalityTo('user'), createPaymentIntent);
router.route('/:id').get(authentication, getSingleOrder).patch(authentication, restrictFunctionalityTo('admin'), updateSingleOrder).delete(authentication, restrictFunctionalityTo('admin'), deleteSingleOrder);

export default router;