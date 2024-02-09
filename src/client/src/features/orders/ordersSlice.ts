import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {type ProductType} from '../products/productsSlice';
import {createOrder, getAllOrders, getUserSpecificOrders} from './ordersThunk';
import {toast} from 'react-toastify';

export type SingleOrderType = {
    _id: string,
    product: ProductType,
    amount: number,
    color: string,
    condition: string
}

export type OrderType = {
    _id: string, 
    shippingFee: number, 
    subTotal: number, 
    total: number, 
    tax: number, 
    items: SingleOrderType[], 
    status: 'paid' | 'preparing' | 'shipped' | 'delivered',
    clientSecret: string,
    message: string,
    user: UserType,
    createdAt: Date,
    address: string,
    city: string,
    country: string,
    postalCode: string,
    state: string
};

interface IOrders {
    ordersLoading: boolean,
    orders: OrderType[],
    searchBoxValues: {
        username: string,
        startDate: Date | '',
        endDate: Date | '',
        minimumTotal: number | '',
        maximumTotal: number | '',
        orderStatus: 'paid' | 'preparing' | 'shipped' | 'delivered' | '',
        sortBy: 'newest' | 'oldest' | ''
    },
    page: number,
    totalOrders: number | null,
    numberOfPages: number | null,
    createOrderLoading: boolean
}

const initialState: IOrders = {
    ordersLoading: true,
    orders: [],
    searchBoxValues: {
        username: '',
        startDate: '',
        endDate: '',
        minimumTotal: '',
        maximumTotal: '',
        orderStatus: '',
        sortBy: ''
    },
    page: 1,
    totalOrders: null,
    numberOfPages: null,
    createOrderLoading: false
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetPage: (state) => {
            state.page = 1;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllOrders.pending, (state) => {
            state.ordersLoading = true;
        }).addCase(getAllOrders.fulfilled, (state, action) => {
            state.ordersLoading = false;
            state.orders = action.payload.orders;
            state.totalOrders = action.payload.totalOrders;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllOrders.rejected, (state) => {
            state.ordersLoading = false;
        }).addCase(getUserSpecificOrders.pending, (state) => {
            state.ordersLoading = true;
        }).addCase(getUserSpecificOrders.fulfilled, (state, action) => {
            state.ordersLoading = false;
            state.orders = action.payload.orders;
            state.totalOrders = action.payload.totalOrders;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getUserSpecificOrders.rejected, (state) => {
            state.ordersLoading = false;
        }).addCase(createOrder.pending, (state) => {
            state.createOrderLoading = true;
        }).addCase(createOrder.fulfilled, (state, action) => {
            state.createOrderLoading = false;
            toast.success('Created Order!');
        }).addCase(createOrder.rejected, (state, action) => {
            state.createOrderLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = ordersSlice.actions;

export default ordersSlice.reducer;