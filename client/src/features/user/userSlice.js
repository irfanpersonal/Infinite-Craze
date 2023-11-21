import {createSlice} from '@reduxjs/toolkit';
import {registerUser, loginUser, showCurrentUser, logoutUser, updateUser, updateUserPassword} from './userThunk.js';
import {toast} from 'react-toastify';

const initialState = {
    isLoading: true,
    user: null,
    isUpdatingPassword: false,
    profileLoading: false,
    wantsToRegister: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleIsUpdatingPassword: (state, action) => {
            state.isUpdatingPassword = !state.isUpdatingPassword;
        },
        toggleWantsToRegister: (state, action) => {
            state.wantsToRegister = !state.wantsToRegister;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            toast.success('Successfully Created User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(loginUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(showCurrentUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.user = null;
            toast.success('Logged Out!');
        }).addCase(updateUser.pending, (state, action) => {
            state.profileLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.profileLoading = false;
            state.user = action.payload;
            toast.success('Updated User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.profileLoading = false;
            toast.error(action.payload);
        }).addCase(updateUserPassword.pending, (state, action) => {
            state.profileLoading = true;
        }).addCase(updateUserPassword.fulfilled, (state, action) => {
            state.profileLoading = false;
            state.user = action.payload;
            toast.success('Updated User Password!');
        }).addCase(updateUserPassword.rejected, (state, action) => {
            state.profileLoading = false;
            toast.error(action.payload);
        })
    }
});

export const {toggleIsUpdatingPassword, toggleWantsToRegister} = userSlice.actions;

export default userSlice.reducer;