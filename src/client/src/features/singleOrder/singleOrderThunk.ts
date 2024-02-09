import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleOrder = createAsyncThunk('singleOrder/getSingleOrder', async(orderID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/order/${orderID}`);
        const data = response.data;
        return data.order;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleOrder = createAsyncThunk('singleOrder/updateSingleOrder', async(orderInput: {orderID: string, orderData: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/order/${orderInput.orderID}`, orderInput.orderData);
        const data = response.data;
        return data.order;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleOrder = createAsyncThunk('singleOrder/deleteSingleOrder', async(orderID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/order/${orderID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});