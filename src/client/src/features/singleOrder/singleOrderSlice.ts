import {createSlice} from '@reduxjs/toolkit';
import {type OrderType} from '../orders/ordersSlice';
import {getSingleOrder, updateSingleOrder, deleteSingleOrder} from './singleOrderThunk';
import {toast} from 'react-toastify';

interface ISingleOrder {
    singleOrderLoading: boolean,
    editOrderLoading: boolean,
    deleteOrderLoading: boolean,
    singleOrder: OrderType | null
}

const initialState: ISingleOrder = {
    singleOrderLoading: true,
    editOrderLoading: false,
    deleteOrderLoading: false,
    singleOrder: null
};

const singleOrderSlice = createSlice({
    name: 'singleOrder',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getSingleOrder.pending, (state) => {
            state.singleOrderLoading = true;
        }).addCase(getSingleOrder.fulfilled, (state, action) => {
            state.singleOrderLoading = false;
            state.singleOrder = action.payload;
        }).addCase(getSingleOrder.rejected, (state, action) => {
            state.singleOrderLoading = true;
        }).addCase(updateSingleOrder.pending, (state) => {
            state.editOrderLoading = true;
        }).addCase(updateSingleOrder.fulfilled, (state, action) => {
            state.editOrderLoading = false;
            state.singleOrder = action.payload;
            toast.success('Edited Order!');
        }).addCase(updateSingleOrder.rejected, (state, action) => {
            state.editOrderLoading = false;
            toast.error(action.payload as string);
        }).addCase(deleteSingleOrder.pending, (state) => {
            state.deleteOrderLoading = true;
        }).addCase(deleteSingleOrder.fulfilled, (state, action) => {
            state.deleteOrderLoading = false;
            toast.success('Deleted Order!');
        }).addCase(deleteSingleOrder.rejected, (state, action) => {
            state.deleteOrderLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {} = singleOrderSlice.actions;

export default singleOrderSlice.reducer;