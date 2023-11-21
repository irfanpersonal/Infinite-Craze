import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const createPaymentIntent = createAsyncThunk('cart/createPaymentIntent', async(cart, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/orders/create-payment-intent', cart);
        const data = response.data;
        return data.clientSecret;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});