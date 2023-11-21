const express = require('express');
const router = express.Router();

const {getAllReviews, createReview, getSingleReview, updateSingleReview, deleteSingleReview} = require('../controllers/review.js');
const {authentication} = require('../middleware/authentication.js');

router.route('/').get(getAllReviews).post(authentication, createReview);
router.route('/:id').get(getSingleReview).patch(authentication, updateSingleReview).delete(authentication, deleteSingleReview);

module.exports = router;