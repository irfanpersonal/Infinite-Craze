import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {createProduct} from '../products/productsThunk';
import {deleteSingleOrder, getSingleOrder} from '../singleOrder/singleOrderThunk';
import {deleteSingleProduct, getSingleProduct, getSingleProductWithAuth} from '../singleProduct/singleProductThunk';
import {createPaymentIntent} from '../user/userThunk';
import {createOrder} from '../orders/ordersThunk';
import {getSingleUser} from '../singleUser/singleUserThunk';

interface INavigate {
    location: string
}

const initialState: INavigate = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.location = state.location === `/product/${action.payload._id}` ? `/product/${action.payload._id}#` : `/product/${action.payload._id}`;
        }).addCase(getSingleOrder.rejected, (state, action) => {
            state.location = state.location === `/order` ? `/order#` : `/order`;
        }).addCase(deleteSingleOrder.fulfilled, (state, action) => {
            state.location = state.location === `/product` ? `/product#` : `/product`;
        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.location = state.location === `/product` ? `/product#` : `/product`;
        }).addCase(getSingleProductWithAuth.rejected, (state, action) => {
            state.location = state.location === `/product` ? `/product#` : `/product`;
        }).addCase(createPaymentIntent.fulfilled, (state) => {
            state.location = state.location === `/checkout` ? `/checkout#` : `/checkout`;
        }).addCase(createOrder.fulfilled, (state, action) => {
            state.location = state.location === `/success` ? `/success#` : `/success`;
        }).addCase(deleteSingleProduct.fulfilled, (state) => {
            state.location = state.location === `/product` ? `/product#` : `/product`;
        }).addCase(getSingleUser.rejected, (state) => {
            state.location = state.location === `/` ? `/#` : `/`;
        });
    }
});

export const {} = navigationSlice.actions;

export default navigationSlice.reducer;