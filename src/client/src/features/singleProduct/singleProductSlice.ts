import {createSlice} from '@reduxjs/toolkit';
import {getSingleProduct, getSingleProductWithAuth, getSingleProductReviews, createReview, deleteReview, updateReview, updateSingleProduct, deleteSingleProduct} from './singleProductThunk';
import {type UserType} from '../user/userSlice';
import {type ProductType} from '../products/productsSlice';
import {type OrderType} from '../orders/ordersSlice';
import {toast} from 'react-toastify';

export type ReviewType = {
    _id: string,
    title: string,
    comment: string,
    rating: number,
    user: UserType,
    product: ProductType
}

interface ISingleProduct {
    singleProductLoading: boolean,
    singleProduct: ProductType | null,
    singleProductReviewsLoading: boolean,
    singleProductReviews: ReviewType[],
    isAddingReview: boolean,
    createReviewLoading: boolean,
    updateReviewLoading: boolean,
    deleteReviewLoading: boolean,
    searchBoxValues: {
        ratingValue: number | '',
        sortValue: 'latest' | 'oldest' | ''
    },
    page: number,
    totalReviews: number | null,
    numberOfPages: number | null,
    alreadyWroteReview?: boolean | null,
    didOrder?: boolean | null,
    latestOrderForThisProduct?: OrderType | null,
    updateSingleProductLoading: boolean,
    deleteSingleProductLoading: boolean
}

const initialState: ISingleProduct = {
    singleProductLoading: true,
    singleProduct: null,
    singleProductReviewsLoading: true,
    singleProductReviews: [],
    isAddingReview: false,
    createReviewLoading: false,
    updateReviewLoading: false,
    deleteReviewLoading: false,
    searchBoxValues: {
        ratingValue: '',
        sortValue: ''
    },
    page: 1,
    totalReviews: null,
    numberOfPages: null,
    alreadyWroteReview: null,
    didOrder: null,
    latestOrderForThisProduct: null,
    updateSingleProductLoading: false,
    deleteSingleProductLoading: false
};

const singleProductSlice = createSlice({
    name: 'singleProduct',
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
        },
        toggleIsAddingReview: (state) => {
            state.isAddingReview = !state.isAddingReview;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSingleProduct.pending, (state) => {
            state.singleProductLoading = true;
        }).addCase(getSingleProduct.fulfilled, (state, action) => {
            state.singleProductLoading = false;
            state.singleProduct = action.payload.product;
            state.alreadyWroteReview = false;
            state.didOrder = false;
        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.singleProductLoading = true;
        }).addCase(getSingleProductWithAuth.pending, (state) => {
            state.singleProductLoading = true;
        }).addCase(getSingleProductWithAuth.fulfilled, (state, action) => {
            state.singleProductLoading = false;
            state.singleProduct = action.payload.product;
            state.alreadyWroteReview = action.payload.alreadyWroteReview;
            state.didOrder = action.payload.didOrder;
            state.latestOrderForThisProduct = action.payload.latestOrderForThisProduct;
        }).addCase(getSingleProductWithAuth.rejected, (state) => {
            state.singleProductLoading = true;
        }).addCase(getSingleProductReviews.pending, (state) => {
            state.singleProductReviewsLoading = true;
        }).addCase(getSingleProductReviews.fulfilled, (state, action) => {
            state.singleProductReviewsLoading = false;
            state.singleProductReviews = action.payload.reviews;
            state.totalReviews = action.payload.totalReviews;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getSingleProductReviews.rejected, (state) => {
            state.singleProductReviewsLoading = false;
        }).addCase(createReview.pending, (state) => {
            state.createReviewLoading = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.createReviewLoading = false;
            state.alreadyWroteReview = true;
            state.isAddingReview = false;
            state.singleProduct!.averageRating = action.payload.newAverageRating;
            toast.success('Created Review!');
        }).addCase(createReview.rejected, (state, action) => {
            state.createReviewLoading = false;
            toast.error(action.payload as string);
        }).addCase(deleteReview.pending, (state) => {
            state.deleteReviewLoading = true;
        }).addCase(deleteReview.fulfilled, (state, action) => {
            state.deleteReviewLoading = false;
            state.alreadyWroteReview = false;
            state.singleProduct!.averageRating = action.payload.newAverageRating;
            toast.success('Deleted Review!');
        }).addCase(deleteReview.rejected, (state, action) => {
            state.deleteReviewLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateReview.pending, (state) => {
            state.updateReviewLoading = true;
        }).addCase(updateReview.fulfilled, (state, action) => {
            state.updateReviewLoading = false;
            state.singleProduct!.averageRating = action.payload.newAverageRating;
            toast.success('Updated Review!');
        }).addCase(updateReview.rejected, (state, action) => {
            state.updateReviewLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateSingleProduct.pending, (state) => {
            state.updateSingleProductLoading = true;
        }).addCase(updateSingleProduct.fulfilled, (state, action) => {
            state.updateSingleProductLoading = false;
            state.singleProduct = action.payload;
            toast.success('Edited Product!');
        }).addCase(updateSingleProduct.rejected, (state, action) => {
            state.updateSingleProductLoading = false;
            toast.error(action.payload as string);
        }).addCase(deleteSingleProduct.pending, (state) => {
            state.deleteSingleProductLoading = true;
        }).addCase(deleteSingleProduct.fulfilled, (state, action) => {
            state.deleteSingleProductLoading = false;
            toast.success('Deleted Product!');
        }).addCase(deleteSingleProduct.rejected, (state, action) => {
            state.deleteSingleProductLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage, toggleIsAddingReview} = singleProductSlice.actions;

export default singleProductSlice.reducer;