import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getSingleUser = createAsyncThunk('singleUser/getSingleUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});