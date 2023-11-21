const express = require('express');
const router = express.Router();

const {getAllProducts, createProduct, getSingleProduct, updateSingleProduct, deleteSingleProduct} = require('../controllers/product.js');
const {getSingleProductReviews} = require('../controllers/review.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').get(getAllProducts).post(authentication, restrictFunctionalityTo('admin'), createProduct);
router.route('/:id').get(getSingleProduct).patch(authentication, restrictFunctionalityTo('admin'), updateSingleProduct).delete(authentication, restrictFunctionalityTo('admin'), deleteSingleProduct);
router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;