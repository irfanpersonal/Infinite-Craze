import {createSlice} from '@reduxjs/toolkit';
import {registerUser, loginUser, showCurrentUser, deleteAccount, logoutUser, createPaymentIntent} from './userThunk';
import {toast} from 'react-toastify';

export type UserType = {_id: string, name: string, email: string, role: 'user' | 'admin', profilePicture: string, dateOfBirth: Date, phoneNumber: number, createdAt: string}

export type PaymentIntentDataType = {
    total: number,
    subTotal: number,
    shippingFee: number,
    tax: number,
    items: {product: string, amount: number, color: string, condition: string}[],
    clientSecret: string,
    postalCode?: string,
    country?: string,
    city?: string,
    address?: string,
    state?: string
};

interface IUser {
    globalLoading: boolean,
    authLoading: boolean,
    user: {userID: string, name: string, email: string, role: 'user' | 'admin'} | null,
    wantsToRegister: boolean,
    deleteAccountLoading: boolean,
    logoutLoading: boolean,
    createPaymentIntentLoading: boolean,
    paymentIntentData: PaymentIntentDataType | null,
    successfulOrder: boolean
}

const initialState: IUser = {
    globalLoading: true,
    authLoading: false,
    user: null,
    wantsToRegister: true,
    deleteAccountLoading: false,
    logoutLoading: false,
    createPaymentIntentLoading: false,
    paymentIntentData: null,
    successfulOrder: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        },
        setSuccessfulOrder: (state, action) => {
            state.successfulOrder = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.globalLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state) => {
            state.globalLoading = false;
        }).addCase(deleteAccount.pending, (state) => {
            state.deleteAccountLoading = true;
        }).addCase(deleteAccount.fulfilled, (state, action) => {
            state.deleteAccountLoading = false;
            state.user = null;
            toast.success('Deleted Account!');
        }).addCase(deleteAccount.rejected, (state, action) => {
            state.deleteAccountLoading = false;
            toast.error(action.payload as string);
        }).addCase(logoutUser.pending, (state) => {
            state.logoutLoading = true;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.logoutLoading = false;
            state.user = null;
            toast.success(action.payload as string);
        }).addCase(logoutUser.rejected, (state) => {
            state.logoutLoading = false;
        }).addCase(createPaymentIntent.pending, (state) => {
            state.createPaymentIntentLoading = true;
        }).addCase(createPaymentIntent.fulfilled, (state, action) => {
            state.createPaymentIntentLoading = false;
            state.paymentIntentData = action.payload;
        }).addCase(createPaymentIntent.rejected, (state, action) => {
            state.createPaymentIntentLoading = false;
            toast.error(action.payload as string);
        });
    }  
});

export const {toggleAuthType, setSuccessfulOrder} = userSlice.actions;

export default userSlice.reducer;