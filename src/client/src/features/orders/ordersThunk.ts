import {createAsyncThunk} from '@reduxjs/toolkit';
import moment from 'moment';
import {type useSelectorType} from '../../store';
import axios from 'axios';
import {setSuccessfulOrder} from '../user/userSlice';

export const getAllOrders = createAsyncThunk('order/getAllOrders', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).orders;
        const response = await axios.get(`/api/v1/order?username=${searchBoxValues.username}&startDate=${moment(searchBoxValues.startDate).utc().format('MM-DD-YYYY')}&endDate=${moment(searchBoxValues.endDate).utc().format('MM-DD-YYYY')}&minimumTotal=${searchBoxValues.minimumTotal}&maximumTotal=${searchBoxValues.maximumTotal}&orderStatus=${searchBoxValues.orderStatus}&sortBy=${searchBoxValues.sortBy}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getUserSpecificOrders = createAsyncThunk('order/getUserSpecificOrders', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).orders;
        const response = await axios.get(`/api/v1/order/getUserSpecificOrders?startDate=${moment(searchBoxValues.startDate).utc().format('MM-DD-YYYY')}&endDate=${moment(searchBoxValues.endDate).utc().format('MM-DD-YYYY')}&minimumTotal=${searchBoxValues.minimumTotal}&maximumTotal=${searchBoxValues.maximumTotal}&orderStatus=${searchBoxValues.orderStatus}&sortBy=${searchBoxValues.sortBy}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createOrder = createAsyncThunk('order/createOrder', async(orderData: object, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/order`, orderData);
        const data = response.data;
        thunkAPI.dispatch(setSuccessfulOrder(true));
        return data;
    }   
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});