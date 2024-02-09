import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';

export interface IUser extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    profilePicture: string,
    dateOfBirth: Date,
    phoneNumber: string,
    role: 'user' | 'admin',
    comparePassword: (guess: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Must Provide User Name'],
        minLength: 5,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Must Provide User Email'],
        validate: {
            validator: (value: string) => {
                return validator.isEmail(value);
            },
            message: 'Invalid Email Address'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must Provide User Password']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Must Provide User Date of Birth']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        required: [true, 'Must Provide User Phone Number'],
        validate: {
            validator: (value: string) => {
                return validator.isMobilePhone(value);
            },
            message: 'Invalid Phone Number'
        }
    },
    role: {
        type: String,
        required: [true, 'Must Provide User Role'],
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not supported'
        },
        default: 'user'
    }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

userSchema.pre('save', async function(this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const randomBytes = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, randomBytes);
});

userSchema.methods.comparePassword = async function(this: IUser, guess: string) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

userSchema.post('deleteOne', {document: true, query: false}, async function() {
    await this.model('Review').deleteMany({product: this._id});
    // Delete Profile Picture
    if (this.profilePicture) {
        const oldImage = this.profilePicture.substring(this.profilePicture.indexOf('INFINITE'));
        await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
    }
    // We want to keep the order data from a deleted user for record purposes.
    // await this.model('Order').deleteMany({user: this._id}); 
});

// Populating Virtual 
userSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

export default mongoose.model<IUser>('User', userSchema);