import {createSlice} from '@reduxjs/toolkit';
import {getSingleProduct, deleteSingleProduct} from './productThunk.js';
import {toast} from 'react-toastify';
import { useHistory } from "react-router-dom";

const initialState = {
    isLoading: true,
    product: null,
    productSelection: {
        product: null,
        amount: 1,
        color: null,
        image: null,
        inventory: null,
        price: null,
        colors: null,
        name: null
    }
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProductSelectionColor: (state, action) => {
            state.productSelection.color = action.payload;
        },
        updateProductSelectionAmount: (state, action) => {
            state.productSelection.amount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSingleProduct.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getSingleProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            console.log(action.payload);
            state.product = action.payload;
            state.productSelection.product = action.payload._id;
            state.productSelection.color = action.payload.colors[0];
            state.productSelection.image = action.payload.image;
            state.productSelection.inventory = action.payload.inventory;
            state.productSelection.price = action.payload.price / 100;
            state.productSelection.colors = action.payload.colors;
            state.productSelection.name = action.payload.name;
        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(deleteSingleProduct.fulfilled, (state, action) => {
            toast.success('Deleted Product!');
        }).addCase(deleteSingleProduct.rejected, (state, action) => {
            toast.error(action.payload);
        })
    }
});

export const {updateProductSelectionColor, updateProductSelectionAmount} = productSlice.actions;

export default productSlice.reducer;