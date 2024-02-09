"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const userSchema = new mongoose_1.default.Schema({
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
            validator: (value) => {
                return validator_1.default.isEmail(value);
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
            validator: (value) => {
                return validator_1.default.isMobilePhone(value);
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return;
        }
        const randomBytes = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, randomBytes);
    });
});
userSchema.methods.comparePassword = function (guess) {
    return __awaiter(this, void 0, void 0, function* () {
        const isCorrect = yield bcryptjs_1.default.compare(guess, this.password);
        return isCorrect;
    });
};
userSchema.post('deleteOne', { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.model('Review').deleteMany({ product: this._id });
        // Delete Profile Picture
        if (this.profilePicture) {
            const oldImage = this.profilePicture.substring(this.profilePicture.indexOf('INFINITE'));
            yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        // We want to keep the order data from a deleted user for record purposes.
        // await this.model('Order').deleteMany({user: this._id}); 
    });
});
exports.default = mongoose_1.default.model('User', userSchema);
