import {createSlice} from '@reduxjs/toolkit';
import {getStats} from './statsThunk';

type StatsType = {
    totalEarnings: number,
    totalOrders: number,
    totalUsers: number,
    totalProducts: number,
    totalReviews: number,
    ordersPerMonth: {count: number, month: number}[]
};

interface IStats {
    getStatsLoading: boolean,
    statsData: StatsType | null
}

const initialState: IStats = {
    getStatsLoading: true,
    statsData: null
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        
    },
    extraReducers(builder) {
        builder.addCase(getStats.pending, (state) => {
            state.getStatsLoading = true;
        }).addCase(getStats.fulfilled, (state, action) => {
            state.getStatsLoading = false;
            state.statsData = action.payload;
        }).addCase(getStats.rejected, (state) => {
            state.getStatsLoading = false;
        });
    }
});

export const {} = statsSlice.actions;

export default statsSlice.reducer;