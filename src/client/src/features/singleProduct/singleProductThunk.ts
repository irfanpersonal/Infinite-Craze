import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getSingleProduct = createAsyncThunk('singleProduct/getSingleProduct', async(productID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/product/${productID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleProductWithAuth = createAsyncThunk('singleProduct/getSingleProductWithAuth', async(productID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/product/${productID}/withAuth`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleProductReviews = createAsyncThunk('singleProduct/getSingleProductReviews', async(productID: string, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).singleProduct;
        const response = await axios.get(`/api/v1/product/${productID}/review?ratingValue=${searchBoxValues.ratingValue}&sortValue=${searchBoxValues.sortValue}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReview = createAsyncThunk('singleProduct/createReview', async(reviewData: {productID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/product/${reviewData.productID}/review`, reviewData.data);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(reviewData.productID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateReview = createAsyncThunk('singleProduct/updateReview', async(reviewData: {productID: string, reviewID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/product/${reviewData.productID}/review/${reviewData.reviewID}`, reviewData.data);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(reviewData.productID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteReview = createAsyncThunk('singleProduct/deleteReview', async(reviewData: {productID: string, reviewID: string}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/product/${reviewData.productID}/review/${reviewData.reviewID}`);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(reviewData.productID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleProduct = createAsyncThunk('singleProduct/updateSingleProduct', async(productData: {productID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/product/${productData.productID}`, productData.data);
        const data = response.data;
        return data.product;
    }  
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleProduct = createAsyncThunk('singleProduct/deleteSingleProduct', async(productID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/product/${productID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});