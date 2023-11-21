import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProducts = createAsyncThunk('products/getAllProducts', async(_, thunkAPI) => {
    try {
        const {search, page} = thunkAPI.getState().products;
        const response = await axios.get(`/api/v1/products?search=${search}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});