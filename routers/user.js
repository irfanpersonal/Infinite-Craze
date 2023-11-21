const express = require('express');
const router = express.Router();

const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword, deleteSingleUser} = require('../controllers/user.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').get(authentication, restrictFunctionalityTo('admin'), getAllUsers);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/updateUser').patch(authentication, updateUser);
router.route('/updateUserPassword').patch(authentication, updateUserPassword);
router.route('/:id').get(authentication, getSingleUser).delete(authentication, restrictFunctionalityTo('admin'), deleteSingleUser);

module.exports = router;