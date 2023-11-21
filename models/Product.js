const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must Provide Product Name'],
        minLength: 3,
        maxLength: 40
    },
    category: {
        type: String,
        required: [true, 'Must Provide Product Category'],
        enum: {
            values: ['motors', 'electronics', 'fashion', 'toys', 'essentials'],
            message: '{VALUE} is not supported'
        }
    },
    price: {
        type: Number,
        required: [true, 'Must Provide Product Price'],
        min: 1
    },
    colors: {
        type: [String],
        required: [true, 'Must Provide Product Colors']
    },
    image: {
        type: String,
        required: [true, 'Must Provide Product Image']
    },
    inventory: {
        type: Number,
        required: [true, 'Must Provide Product Inventory']
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId, 
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
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}});

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

productSchema.post('deleteOne', {document: true, query: false}, async function() {
    await this.model('Review').deleteMany({product: this._id});
});

module.exports = mongoose.model('Product', productSchema);