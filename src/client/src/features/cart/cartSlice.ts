import {createSlice} from '@reduxjs/toolkit';
import {type ProductType} from '../products/productsSlice';
import {toast} from 'react-toastify';

export const getCartFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('cart')!) as ICart;
}

export const addCartToLocalStorage = (cart: ICart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

type CartType = {
    product: ProductType,
    amount: number,
    color: string,
    condition: 'new' | 'used' | 'refurbished' | 'damaged'
};

export interface ICart {
    items: CartType[],
    numberOfItems: number,
    subTotal: number,
    shippingCost: number,
    total: number,
    tax: number
}

const initialState: ICart = {
    items: [],
    numberOfItems: 0,
    subTotal: 0,
    shippingCost: 0,
    total: 0,
    tax: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: getCartFromLocalStorage() || initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const alreadyExists = state.items.find(item => {
                if ((item.product._id === action.payload.product._id) && item.color === action.payload.color) {
                    return true;
                }
            });
            if (alreadyExists) {
                if (alreadyExists.amount === 5) {
                    toast.error('Maximum Amount Acheived for this Product and Color!');
                    return;
                }
                alreadyExists.amount += action.payload.amount;
            }
            else {
                state.items.push(action.payload);
            }
            addCartToLocalStorage(state);
            toast.success('Added to Cart!');
        },
        increaseAmount: (state, action) => {
            const productIndex = state.items.findIndex(item => 
                (item.product._id === action.payload.product._id) && item.color === action.payload.color
            );
            if (productIndex !== -1) {
                const product = state.items[productIndex];
                const newAmount = product.amount + 1;
                if (newAmount === 6) {
                    toast.error('Maximum Amount Acheived for this Product and Color!');
                    return;
                } 
                else {
                    product!.amount = newAmount;
                }
            }
            addCartToLocalStorage(state);
        },
        decreaseAmount: (state, action) => {
            const productIndex = state.items.findIndex(item => 
                (item.product._id === action.payload.product._id) && item.color === action.payload.color
            );
            if (productIndex !== -1) {
                const product = state.items[productIndex];
                const newAmount = product.amount - 1;
                if (newAmount === 0) {
                    state.items = state.items.filter((item, index) => index !== productIndex);
                } 
                else {
                    product.amount = newAmount;
                }
            }
            addCartToLocalStorage(state);
        },
        deleteItem: (state, action) => {
            const productIndex = state.items.findIndex(item => 
                (item.product._id === action.payload.product._id) && item.color === action.payload.color
            );
            if (productIndex !== -1) {
                const product = state.items[productIndex];
                state.items = state.items.filter((item, index) => index !== productIndex);
            }
            addCartToLocalStorage(state);
            toast.success('Removed Product!');
        },
        calculateTotals: (state) => {
            let updatedNumberOfItems = 0;
            let updatedSubtotal = 0;
            let updatedShippingFee = 0;
            let updatedTax = 0;
            let updatedTotal = 0;
            state.items.forEach(item => {
                updatedNumberOfItems += item.amount;
                updatedSubtotal += item.product.price * item.amount;
                updatedShippingFee += item.product.shippingFee;
            });
            state.numberOfItems = updatedNumberOfItems;
            state.subTotal = updatedSubtotal;
            state.shippingCost = updatedShippingFee;
            state.tax = (state.subTotal + state.shippingCost) * 0.05;
            state.total = state.subTotal + state.shippingCost + state.tax;
        },
        clearCart: (state) => {
            state.items = [];
            state.numberOfItems = 0;
            state.shippingCost = 0;
            state.subTotal = 0;
            state.tax = 0;
            state.total = 0;
            addCartToLocalStorage(state);
        }
    },
    extraReducers: (builder) => {

    }
});

export const {addItemToCart, increaseAmount, decreaseAmount, deleteItem, calculateTotals, clearCart} = cartSlice.actions;

export default cartSlice.reducer;