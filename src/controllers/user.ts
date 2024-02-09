import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {ITokenPayload, deleteImage} from '../utils';
import {User, Review, Order} from '../models';
import {IUser} from '../models/User';
import CustomError from '../errors';
import {v2 as cloudinary} from 'cloudinary';
import {UploadedFile} from 'express-fileupload';

interface UserRequest extends Request {
    params: {
        id: string
    },
    body: IUser & {
        oldPassword: string,
        newPassword: string
    },
    query: {
        search: string,
        sort: 'a-z' | 'z-a',
        limit: string,
        page: string
    },
    user?: ITokenPayload
}

const showCurrentUser = async(req: UserRequest, res: Response) => {
    return res.status(StatusCodes.OK).json({user: req.user});
}

interface IQueryObject {
    name?: {$regex: string, $options: string},
    role?: 'user' | 'admin'
};

const getAllUsers = async(req: UserRequest, res: Response) => {
    const {search, sort} = req.query;
    const queryObject: IQueryObject = {
        role: 'user'
    };
    if (search) {
        queryObject.name = {$regex: search, $options: 'i'};
    }
    let result = User.find(queryObject);
    if (sort === 'a-z') {
        result = result.sort('name');
    }
    if (sort === 'z-a') {
        result = result.sort('-name');
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const users = await result.select('-password');
    const totalUsers = await User.countDocuments(queryObject);
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(StatusCodes.OK).json({users, totalUsers, numberOfPages});
}

const getSingleUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const user = await User.findOne({_id: id}).select('-password').populate('orders');
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    if (req.user!.role === 'admin' || req.user!.userID === id) {
        return res.status(StatusCodes.OK).json({user});
    }
    throw new CustomError.ForbiddenError('You are not allowed to access single user data unless you are an admin or the user account belongs to you!');
}

const updateUser = async(req: UserRequest, res: Response) => {
    req.body.role = "user";
    const updatedUser = (await User.findOneAndUpdate({_id: req.user!.userID}, req.body, {
        new: true,
        runValidators: true,
    }).select('-password'))!;
    if (req.files?.profilePicture) {
        if (updatedUser.profilePicture) {
            const oldImage = updatedUser.profilePicture.substring(updatedUser.profilePicture.indexOf('INFINITE'));
            await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const profilePicture = req.files.profilePicture as UploadedFile;
        if (!profilePicture.mimetype.startsWith('image')) {
            await deleteImage(profilePicture.tempFilePath);
            throw new CustomError.BadRequestError('File must be an image!');
        }
        if (profilePicture.size > 1000000 * 2) {
            await deleteImage(profilePicture.tempFilePath);
            throw new CustomError.BadRequestError('Image Size cannot be over 2MB!');
        }
        const uniqueIdentifier = new Date().getTime() + '_' + req.user!.name + '_' + 'profile' + '_' + profilePicture.name;
        const result = await cloudinary.uploader.upload(profilePicture.tempFilePath, {
            public_id: uniqueIdentifier, 
            folder: 'INFINITE-CRAZE/PROFILE_IMAGES'
        });
        await deleteImage(profilePicture.tempFilePath);
        updatedUser.profilePicture = result.secure_url;
        await updatedUser.save();
    }
    return res.status(StatusCodes.OK).json({user: updatedUser});
}

const updateUserPassword = async(req: UserRequest, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (await User.findOne({_id: req.user!.userID}))!;
    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    return res.status(StatusCodes.OK).json({user: {
        userID: user._id,
        name: user.name,
        email: user.email
    }});
}

const deleteAccount = async(req: UserRequest, res: Response) => {
    const {password} = req.body;
    const user = (await User.findOne({_id: req.user!.userID}))!;
    if (!password) {
        throw new CustomError.BadRequestError('Please provide password!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Password');
    }
    await user.deleteOne();
    res.clearCookie('token');
    await Review.deleteMany({user: user._id});
    return res.status(StatusCodes.OK).send();
}

export {
    showCurrentUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
    deleteAccount
};