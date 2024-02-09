import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const createPaymentIntent = createAsyncThunk('cart/createPaymentIntent', async(items: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/order/createPaymentIntent`, items);
        const data = response.data;
        return 
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});