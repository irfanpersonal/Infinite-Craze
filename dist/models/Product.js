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
const validate_color_1 = __importDefault(require("validate-color"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide Product Name'],
        minLength: 3,
        maxLength: 40
    },
    description: {
        type: String,
        required: [true, 'Must Provide Product Description']
    },
    category: {
        type: String,
        required: [true, 'Must Provide Product Category'],
        enum: {
            values: ['electronics', 'apparel', 'home', 'beauty', 'books', 'sports', 'games', 'health', 'grocery', 'tools'],
            message: '{VALUE} is not supported'
        }
    },
    price: {
        type: Number,
        required: [true, 'Must Provide Product Price'],
        min: 1,
        set: (value) => {
            return value * 100;
        }
    },
    shippingFee: {
        type: Number,
        required: [true, 'Must Provide Product Shipping Fee'],
        min: 1,
        set: (value) => {
            return value * 100;
        }
    },
    condition: {
        type: String,
        required: [true, 'Must Provide Product Condition'],
        enum: {
            values: ['new', 'used', 'refurbished', 'damaged'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        required: [true, 'Must Provide Product Colors'],
        validate: {
            validator: (array) => {
                if (!array.length || array.some(element => !element)) {
                    return false;
                }
                const isValid = array.every(color => (0, validate_color_1.default)(color));
                return isValid;
            },
            message: 'At least one color is required for product creation and it must be valid!'
        }
    },
    image: {
        type: String,
        required: [true, 'Must Provide Product Image']
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Product User']
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});
productSchema.post('deleteOne', { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.model('Review').deleteMany({ product: this._id });
    });
});
exports.default = mongoose_1.default.model('Product', productSchema);
