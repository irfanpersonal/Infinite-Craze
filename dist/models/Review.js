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
const reviewSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Review User'],
        ref: 'User'
    },
    product: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: [true, 'Must Provide Review Product'],
        ref: 'Product'
    }
}, { timestamps: true });
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.statics.calculateNumberOfRatingsAndAverageRating = function (productID) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield this.aggregate([
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
        yield this.model('Product').findOneAndUpdate({ _id: productID }, { averageRating: ((_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0, numberOfReviews: ((_b = result === null || result === void 0 ? void 0 : result[0]) === null || _b === void 0 ? void 0 : _b.numberOfReviews) || 0 });
    });
};
reviewSchema.post('save', { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.calculateNumberOfRatingsAndAverageRating(this.product);
    });
});
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.calculateNumberOfRatingsAndAverageRating(this.product);
    });
});
exports.default = mongoose_1.default.model('Review', reviewSchema);
