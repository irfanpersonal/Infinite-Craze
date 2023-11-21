import {createSlice} from "@reduxjs/toolkit";
import {getAllOrders} from "./ordersThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoading: true,
    orders: []
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(getAllOrders.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        }).addCase(getAllOrders.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        })
    }
});

export const {} = ordersSlice.actions;

export default ordersSlice.reducer;