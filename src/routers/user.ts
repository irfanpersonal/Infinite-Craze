import express from 'express';
const router: express.Router = express.Router();

import {showCurrentUser, getAllUsers, getSingleUser, updateUser, updateUserPassword, deleteAccount} from '../controllers/user';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(authentication, restrictFunctionalityTo('admin'), getAllUsers);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/updateUser').patch(authentication, updateUser);
router.route('/updateUserPassword').patch(authentication, updateUserPassword);
router.route('/deleteAccount').delete(authentication, restrictFunctionalityTo('user'), deleteAccount);
router.route('/:id').get(authentication, getSingleUser);

export default router;