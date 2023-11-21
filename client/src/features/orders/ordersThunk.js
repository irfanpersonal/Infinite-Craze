import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getAllOrders = createAsyncThunk('orders/getAllOrders', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/orders/showAllMyOrders');
        const data = response.data;
        return data.orders;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});