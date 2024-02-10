import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {getSingleUser} from './singleUserThunk';
import {type OrderType} from '../orders/ordersSlice';

interface ISingleUser {
    singleUserLoading: boolean,
    singleUser: UserType & {orders: OrderType[]} | null
}

const initialState: ISingleUser = {
    singleUserLoading: true,
    singleUser: null
};

const singleUserSlice = createSlice({
    name: 'singleUser',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getSingleUser.pending, (state) => {
            state.singleUserLoading = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.singleUserLoading = false;
            state.singleUser = action.payload;
        }).addCase(getSingleUser.rejected, (state) => {
            state.singleUserLoading = true;
        });
    }
});

export const {} = singleUserSlice.actions;

export default singleUserSlice.reducer;