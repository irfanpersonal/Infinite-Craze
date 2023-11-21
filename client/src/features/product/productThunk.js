import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleProduct = createAsyncThunk('product/getSingleProduct', async(productID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/products/${productID}`);
        const data = response.data;
        return data.product;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleProduct = createAsyncThunk('product/deleteSingleProduct', async(productID, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/products/${productID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});