import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {getSingleProduct} from '../product/productThunk';

export const getSingleProductReviews = createAsyncThunk('reviews/getSingleProductReviews', async(productID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/products/${productID}/reviews`);
        const data = response.data;
        return data.reviews;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleReview = createAsyncThunk('reviews/deleteSingleReview', async({reviewID, productID}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/reviews/${reviewID}`);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(productID));
        thunkAPI.dispatch(getSingleProduct(productID));
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReview = createAsyncThunk('reviews/createReview', async({review, productID}, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/reviews', review);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(productID));
        thunkAPI.dispatch(getSingleProduct(productID));
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleReview = createAsyncThunk('reviews/getSingleReview', async(reviewID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/reviews/${reviewID}`);
        const data = response.data;
        return data.review;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleReview = createAsyncThunk('reviews/updateSingleReview', async({reviewID, review, productID}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/reviews/${reviewID}`, review);
        const data = response.data;
        thunkAPI.dispatch(getSingleProductReviews(productID));
        return data.review;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});