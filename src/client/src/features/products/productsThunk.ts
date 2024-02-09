import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllProducts = createAsyncThunk('products/getAllProducts', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).products;
        const response = await axios.get(`/api/v1/product?search=${searchBoxValues.search}&category=${searchBoxValues.category}&state=${searchBoxValues.state}&minimumBudget=${searchBoxValues.minimumBudget}&maximumBudget=${searchBoxValues.maximumBudget}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async(productData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/product', productData);
        const data = response.data;
        return data.product;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});