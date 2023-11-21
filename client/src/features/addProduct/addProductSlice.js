import {createSlice} from "@reduxjs/toolkit";
import {createProduct, updateSingleProduct} from "./addProductThunk.js";
import {toast} from 'react-toastify';
import {getSingleProduct} from "../product/productThunk.js";

const initialState = {
    isLoading: false,
    isEditingProduct: false,
    isLoadingGetSingleProduct: false,
    singleProductData: {
        name: '',
        inventory: '',
        price: '',
        category: 'motors',
        colors: '',
        image: ''
    }
};

const addProductSlice = createSlice({
    name: 'addProduct',
    initialState,
    reducers: {
        isEditingProductTrue: (state, action) => {
            state.isEditingProduct = true;
        },
        isEditingProductFalse: (state, action) => {
            state.isEditingProduct = false;
        },
        updateSingleProductData: (state, action) => {
            state.singleProductData[action.payload.name] = action.payload.value;
        },
        resetSingleProductData: (state, action) => {
            state.singleProductData = {
                name: '',
                inventory: '',
                price: '',
                category: 'motors',
                colors: '',
                image: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createProduct.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Created Product!');
        }).addCase(createProduct.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(getSingleProduct.pending, (state, action) => {
            state.isLoadingGetSingleProduct = true;
        }).addCase(getSingleProduct.fulfilled, (state, action) => {
            state.isLoadingGetSingleProduct = false;
            state.singleProductData.name = action.payload.name;
            state.singleProductData.inventory = action.payload.inventory;
            state.singleProductData.price = action.payload.price / 100;
            state.singleProductData.category = action.payload.category;
            state.singleProductData.colors = action.payload.colors.join(' ');
            state.singleProductData.image = action.payload.image;
            state.singleProductData.id = action.payload._id;
        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.isLoadingGetSingleProduct = false;
            toast.error(action.payload);
        }).addCase(updateSingleProduct.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(updateSingleProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Edited Product!');
        }).addCase(updateSingleProduct.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        });
    }
});

export const {isEditingProductTrue, isEditingProductFalse, updateSingleProductData, resetSingleProductData} = addProductSlice.actions;

export default addProductSlice.reducer;