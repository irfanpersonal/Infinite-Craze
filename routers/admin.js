const express = require('express');
const router = express.Router();

const {getStats} = require('../controllers/admin.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/stats').get(authentication, restrictFunctionalityTo('admin'), getStats);

module.exports = router;