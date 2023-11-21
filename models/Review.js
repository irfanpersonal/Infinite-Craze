const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Must Provide Review Title'],
        minLength: 3,
        maxLength: 40
    },
    comment: {
        type: String,
        required: [true, 'Must Provide Review Comment']
    },
    rating: {
        type: Number,
        required: [true, 'Must Provide Review Rating'],
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Review User'],
        ref: 'User'
    },
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Review Product'],
        ref: 'Product'
    }
}, {timestamps: true});

reviewSchema.index({product: 1, user: 1}, {unique: true});

reviewSchema.statics.calculateNumberOfRatingsAndAverageRating = async function(productID) {
    const result = await this.aggregate([
        {
            '$match': {
                'product': productID
            }
        },
        {
            '$group': {
                '_id': null, 
                'averageRating': {
                    '$avg': '$rating'
                }, 
                'numberOfReviews': {
                    '$sum': 1
                }
            }
        }
    ]);
    await this.model('Product').findOneAndUpdate({_id: productID}, {averageRating: result?.[0]?.averageRating || 0, numberOfReviews: result?.[0]?.numberOfReviews || 0});
}

reviewSchema.post('save', {document: true, query: false}, async function() {
    await this.constructor.calculateNumberOfRatingsAndAverageRating(this.product);
});

reviewSchema.post('deleteOne', {document: true, query: false}, async function() {
    await this.constructor.calculateNumberOfRatingsAndAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);