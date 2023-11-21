import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getAllUsers = createAsyncThunk('admin/getAllUsers', async(_, thunkAPI) => {
    try {   
        const response = await axios.get('/api/v1/users');
        const data = response.data;
        return data.users;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleUser = createAsyncThunk('admin/deleteSingleUser', async(userID, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/users/${userID}`);
        const data = response.data;
        thunkAPI.dispatch(getAllUsers());
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getStats = createAsyncThunk('admin/getStats', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/admin/stats');
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});