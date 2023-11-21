const mongoose = require('mongoose');

const singleOrderItemSchema = mongoose.Schema({
    amount: { 
        type: Number, 
        required: true
    },
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Product'
    },
    color: {
        type: String,
        required: true
    }
});

const orderSchema = mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    shippingFee: {
		type: Number,
		required: true
    },
    subTotal: {
		type: Number,
		required: true
    },
    total: {
		type: Number,
		required: true
    },
    items: [singleOrderItemSchema],
    status: {
        type: String,
        enum: ['paid', 'preparing', 'shipped', 'delivered'],
        default: 'paid'
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    clientSecret: {
        type: String,
        required: true
    },
    paymentIntentID: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);