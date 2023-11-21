import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const createProduct = createAsyncThunk('addProduct/createProduct', async(product, thunkAPI) => {
    try {   
        const response = await axios.post('/api/v1/products', product);
        const data = response.data;
        return data.product;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleProduct = createAsyncThunk('addProduct/updateSingleProduct', async({productID, product}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/products/${productID}`, product);
        const data = response.data;
        return data.product;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});