import {createSlice} from '@reduxjs/toolkit';
import {getProfileData, editProfile, updatePassword} from './profileThunk';
import {type UserType} from '../user/userSlice';
import {toast} from 'react-toastify';

interface IProfile {
    profileDataLoading: boolean,
    profileData: UserType | null,
    editProfileLoading: boolean,
    updatePasswordLoading: boolean
}

const initialState: IProfile = {
    profileDataLoading: true,
    profileData: null,
    editProfileLoading: false,
    updatePasswordLoading: false
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getProfileData.pending, (state) => {
            state.profileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.profileDataLoading = false;
            state.profileData = action.payload;
        }).addCase(getProfileData.rejected, (state) => {
            state.profileDataLoading = false;
        }).addCase(editProfile.pending, (state) => {
            state.editProfileLoading = true;
        }).addCase(editProfile.fulfilled, (state, action) => {
            state.editProfileLoading = false;
            state.profileData = action.payload;
            toast.success('Edited Profile!');
        }).addCase(editProfile.rejected, (state, action) => {
            state.editProfileLoading = false;
            toast.success(action.payload as string);
        }).addCase(updatePassword.pending, (state) => {
            state.updatePasswordLoading = true;
        }).addCase(updatePassword.fulfilled, (state) => {
            state.updatePasswordLoading = false;
            toast.success('Changed Password!');
        }).addCase(updatePassword.rejected, (state, action) => {
            state.updatePasswordLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;