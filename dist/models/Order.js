"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleOrderItemSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.singleOrderItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Single Order Item Product'],
        ref: 'Product'
    },
    amount: {
        type: Number,
        required: [true, 'Must Provide Single Order Item Amount']
    },
    color: {
        type: String,
        required: [true, 'Must Provide Single Order Item Color']
    },
    condition: {
        type: String,
        required: [true, 'Must Provide Single Order Item Condition'],
        enum: {
            values: ['new', 'used', 'refurbished', 'damaged'],
            message: '{VALUE} is not supported'
        }
    }
});
const orderSchema = new mongoose_1.default.Schema({
    shippingFee: {
        type: Number,
        required: [true, 'Must Provide Order Shipping Fee']
    },
    subTotal: {
        type: Number,
        required: [true, 'Must Provide Order Subtotal']
    },
    total: {
        type: Number,
        required: [true, 'Must Provide Order Total']
    },
    tax: {
        type: Number,
        required: [true, 'Must Provide Order Tax']
    },
    address: {
        type: String,
        required: [true, 'Must Provide Order Address']
    },
    city: {
        type: String,
        required: [true, 'Must Provide Order City']
    },
    country: {
        type: String,
        required: [true, 'Must Provide Order Country']
    },
    postalCode: {
        type: String,
        required: [true, 'Must Provide Order PostalCode']
    },
    state: {
        type: String,
        required: [true, 'Must Provide Order State']
    },
    items: {
        type: [exports.singleOrderItemSchema],
        required: [true, 'Must Provide Order Items'],
        validate: {
            validator: (array) => {
                if (!array.length || array.some(element => !element)) {
                    return false;
                }
                return true;
            },
            message: 'Items must be set to an array and all elements must be truthy'
        }
    },
    status: {
        type: String,
        required: [true, 'Must Provide Order Status'],
        enum: {
            values: ['paid', 'preparing', 'shipped', 'delivered'],
            message: '{VALUE} is not supported'
        },
        default: 'paid'
    },
    clientSecret: {
        type: String,
        required: [true, 'Must Provide Order ClientSecret']
    },
    message: {
        type: String,
        default: 'Thank you for your purchase!'
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'Must Provide Order User'],
        ref: 'User'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Order', orderSchema);
