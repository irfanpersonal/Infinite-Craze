import {createSlice} from '@reduxjs/toolkit';
import {getAllProducts} from './productsThunk.js';

const initialState = {
    isLoading: false,
    products: [],
    totalProducts: null,
    numberOfPages: null,
    search: '',
    page: 1
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchValue: (state, action) => {
            state.page = 1;
            state.search = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.products = action.payload.products;
            state.totalProducts = action.payload.totalProducts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllProducts.rejected, (state, action) => {
            state.isLoading = false;
        })
    }
});

export const {setPage, updateSearchValue} = productsSlice.actions;

export default productsSlice.reducer;