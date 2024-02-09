import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getProfileData = createAsyncThunk('profile/getProfileData', async(profileID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${profileID}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editProfile = createAsyncThunk('profile/editProfile', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUser', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updatePassword = createAsyncThunk('profile/updatePassword', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUserPassword', userData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});