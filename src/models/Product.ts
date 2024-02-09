import mongoose from 'mongoose';
import validateColor from 'validate-color';

export interface IProduct extends mongoose.Document {
    name: string,
    description: string,
    category: 'electronics' | 'apparel' | 'home' | 'beauty' | 'books' | 'sports' | 'games' | 'health' | 'grocery' | 'tools',
    price: number, 
    shippingFee: number,
    condition: 'new' | 'used' | 'refurbished' | 'damaged',
    colors: string[],
    image: string,
    inventory: number,
    user: mongoose.Schema.Types.ObjectId,
    averageRating: number,
    numberOfReviews: number
}

const productSchema = new mongoose.Schema<IProduct>({
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
        set: (value: number) => {
            return value * 100;
        }
    },
    shippingFee: {
        type: Number,
        required: [true, 'Must Provide Product Shipping Fee'],
        min: 1,
        set: (value: number) => {
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
            validator: (array: string[]) => {
                if (!array.length || array.some(element => !element)) {
                    return false;
                }
                const isValid = array.every(color => validateColor(color));
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

export default mongoose.model<IProduct>('Product', productSchema);