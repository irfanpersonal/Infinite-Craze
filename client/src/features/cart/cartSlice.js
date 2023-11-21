import {createSlice} from "@reduxjs/toolkit";
import {getCartFromLocalStorage, addCartToLocalStorage} from '../../utils';
import {toast} from 'react-toastify';
import {nanoid} from "nanoid";
import {createPaymentIntent} from "./cartThunk";

const initialState = {
    isLoading: true,
    cart: getCartFromLocalStorage() || [],
    total: 0,
    createPaymentIntentData: {
        tax: 299,
        shippingFee: 499,
        items: []
    },
    clientSecret: null,
    isSuccessful: false
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state, action) => {
            state.cart.push({...action.payload, uniqueID: nanoid()});
            addCartToLocalStorage(state.cart);
            toast.success('Added Product to Cart!');
        },
        removeItem: (state, action) => {
            state.cart = state.cart.filter((item) => item.uniqueID !== action.payload);
            addCartToLocalStorage(state.cart);
        },
        increaseItemAmount: (state, action) => {
            const cartItem = state.cart.find((item) => item.uniqueID === action.payload);
            cartItem.amount = cartItem.amount + 1;
        },
        decreaseItemAmount: (state, action) => {
            const cartItem = state.cart.find((item) => item.uniqueID === action.payload);
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals: (state) => {
            let total = 0;
            state.cart.forEach((item) => {
                total += item.amount * item.price;
            });
            total += 4.99 + 2.99;
            state.total = total;
        },
        clearCart: (state, action) => {
            state.cart = [];
            addCartToLocalStorage(state.cart);
        },
        updateCreatePaymentIntentData: (state, action) => {
            state.createPaymentIntentData.items = state.cart.map(({product, amount, color}) => ({product, amount, color}));
        },
        isSuccessfulTrue: (state, action) => {
            state.isSuccessful = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createPaymentIntent.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createPaymentIntent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.clientSecret = action.payload;
        }).addCase(createPaymentIntent.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
    }
});

export const {addProductToCart, clearCart, removeItem, increaseItemAmount, decreaseItemAmount, calculateTotals, updateCreatePaymentIntentData, isSuccessfulTrue} = cartSlice.actions;

export default cartSlice.reducer;