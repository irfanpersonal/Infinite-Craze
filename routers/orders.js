const express = require('express');
const router = express.Router();

const {getAllOrders, createPaymentIntent, createOrder, getCurrentUserOrders, getSingleOrder, updateSingleOrder} = require('../controllers/orders.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').get(authentication, restrictFunctionalityTo('admin'), getAllOrders).post(authentication, createOrder);
router.route('/create-payment-intent').post(authentication, createPaymentIntent);
router.route('/showAllMyOrders').get(authentication, getCurrentUserOrders);
router.route('/:id').get(authentication, getSingleOrder).patch(authentication, restrictFunctionalityTo('admin'), updateSingleOrder);

module.exports = router;