import {createSlice} from '@reduxjs/toolkit';
import {getAllProducts, createProduct, getFeaturedProducts} from './productsThunk';
import {toast} from 'react-toastify';

export type ProductType = {
    _id: string, 
    name: string, 
    description: string, 
    category: 'electronics' | 'apparel' | 'home' | 'beauty' | 'books' | 'sports' | 'games' | 'health' | 'grocery' | 'tools', 
    price: number, 
    shippingFee: number, 
    condition: 'new' | 'used' | 'refurbished' | 'damaged', 
    colors: string[], 
    image: string, 
    averageRating: number, 
    numberOfReviews: number, 
    createdAt: string
};

interface IProducts {
    productsLoading: boolean,
    products: ProductType[],
    searchBoxValues: {
        search: string,
        category: '' | 'electronics' | 'apparel' | 'home' | 'beauty' | 'books' | 'sports' | 'games' | 'health' | 'grocery' | 'tools',
        state: '' | 'new' | 'used' | 'refurbished' | 'damaged',
        minimumBudget: string,
        maximumBudget: string,
        sort: '' | 'a-z' | 'z-a' | 'lowest' | 'highest',
    },
    page: number,
    totalProducts: number | null,
    numberOfPages: number | null,
    createProductLoading: boolean,
    getFeaturedProductsLoading: boolean,
    featuredProducts: ProductType[]
}

const initialState: IProducts = {
    productsLoading: true,
    products: [],
    searchBoxValues: {
        search: '',
        category: '',
        state: '',
        minimumBudget: '',
        maximumBudget: '',
        sort: ''
    },
    page: 1,
    totalProducts: null,
    numberOfPages: null,
    createProductLoading: false,
    getFeaturedProductsLoading: true,
    featuredProducts: []
};

const productsSlice = createSlice({
    name: 'products',
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
        builder.addCase(getAllProducts.pending, (state) => {
            state.productsLoading = true;
        }).addCase(getAllProducts.fulfilled, (state, action) => {
            state.productsLoading = false;  
            state.products = action.payload.products;
            state.totalProducts = action.payload.totalProducts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllProducts.rejected, (state) => {
            state.productsLoading = false;
        }).addCase(createProduct.pending, (state) => {
            state.createProductLoading = true;
        }).addCase(createProduct.fulfilled, (state, action) => {
            state.createProductLoading = false; 
            toast.success('Created Product!');
        }).addCase(createProduct.rejected, (state, action) => {
            state.createProductLoading = false;
            toast.error(action.payload as string);
        }).addCase(getFeaturedProducts.pending, (state, action) => {
            state.getFeaturedProductsLoading = true;
        }).addCase(getFeaturedProducts.fulfilled, (state, action) => {
            state.getFeaturedProductsLoading = false;
            state.featuredProducts = action.payload;
        }).addCase(getFeaturedProducts.rejected, (state, action) => {
            state.getFeaturedProductsLoading = false;
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = productsSlice.actions;

export default productsSlice.reducer;