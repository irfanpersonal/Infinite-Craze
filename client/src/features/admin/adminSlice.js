import {createSlice} from "@reduxjs/toolkit";
import {deleteSingleUser, getAllUsers, getStats} from "./adminThunk.js";
import {toast} from 'react-toastify';

const initialState = {
    isLoading: true,
    isLoadingStats: true,
    users: [],
    stats: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllUsers.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        }).addCase(getAllUsers.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(deleteSingleUser.fulfilled, (state, action) => {
            toast.success('Deleted User!');
        }).addCase(deleteSingleUser.rejected, (state, action) => {
            toast.error(action.payload);
        }).addCase(getStats.pending, (state, action) => {
            state.isLoadingStats = true;
        }).addCase(getStats.fulfilled, (state, action) => {
            state.isLoadingStats = false;
            state.stats = action.payload;
        }).addCase(getStats.rejected, (state, action) => {
            state.isLoadingStats = false;
            toast.error(action.payload);
        })
    }
});

export const {} = adminSlice.actions;

export default adminSlice.reducer;