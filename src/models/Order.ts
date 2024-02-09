import mongoose from 'mongoose';

export interface ISingleOrderItem {
    product: mongoose.Schema.Types.ObjectId,
    amount: number,
    color: string,
    condition: 'new' | 'used' | 'refurbished' | 'damaged'
}

export const singleOrderItemSchema = new mongoose.Schema<ISingleOrderItem>({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
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

export interface IOrder {
    shippingFee: number,
    subTotal: number,
    total: number,
    tax: number,
    items: ISingleOrderItem[],
    status: 'paid' | 'preparing' | 'shipped' | 'delivered',
    message: string,
    user: mongoose.Schema.Types.ObjectId,
    clientSecret: string,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    state: string
}

const orderSchema = new mongoose.Schema<IOrder>({
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
        type: [singleOrderItemSchema],
        required: [true, 'Must Provide Order Items'],
        validate: {
            validator: (array: ISingleOrderItem[]) => {
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
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must Provide Order User'],
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model<IOrder>('Order', orderSchema);