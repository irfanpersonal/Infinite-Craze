import {createSlice} from "@reduxjs/toolkit";
import {getSingleProductReviews, deleteSingleReview, createReview, getSingleReview, updateSingleReview} from "./reviewsThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoading: true,
    reviewBoxButton: false,
    isEditing: false,
    reviews: [],
    singleReviewData: {
        title: '',
        comment: '',
        rating: 5,
        id: null
    }
};

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        handleSingleReviewData: (state, action) => {
            state.singleReviewData[action.payload.name] = action.payload.value;
        },
        isEditingTrue: (state, action) => {
            state.isEditing = true;
        },
        isEditingFalse: (state, action) => {
            state.isEditing = false;
        },
        clearSingleReviewData: (state, action) => {
            state.singleReviewData = {
                title: '',
                comment: '',
                rating: 5,
                id: null
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSingleProductReviews.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getSingleProductReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload;
        }).addCase(getSingleProductReviews.rejected, (state, action) => {
            state.isLoading = false;   
            toast.error(action.payload); 
        }).addCase(deleteSingleReview.fulfilled, (state, action) => {
            toast.success('Deleted Review!');
        }).addCase(deleteSingleReview.rejected, (state, action) => {
            toast.error(action.payload);
        }).addCase(createReview.pending, (state, action) => {
            state.reviewBoxButton = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.reviewBoxButton = false;
            reviewsSlice.caseReducers.clearSingleReviewData(state, action);
            toast.success('Successfully Created Review!');
        }).addCase(createReview.rejected, (state, action) => {
            state.reviewBoxButton = false;
            toast.error(action.payload);
        }).addCase(getSingleReview.fulfilled, (state, action) => {
            state.singleReviewData = action.payload;
        }).addCase(getSingleReview.rejected, (state, action) => {
            toast.error(action.payload);
        }).addCase(updateSingleReview.pending, (state, action) => {
            state.reviewBoxButton = true;
        }).addCase(updateSingleReview.fulfilled, (state, action) => {
            state.reviewBoxButton = false;
            reviewsSlice.caseReducers.clearSingleReviewData(state, action);
            toast.success('Edited Review!');
        }).addCase(updateSingleReview.rejected, (state, action) => {
            state.reviewBoxButton = false;
            toast.error(action.payload);
        })
    }
});

export const {handleSingleReviewData, isEditingTrue, isEditingFalse, clearSingleReviewData} = reviewsSlice.actions;

export default reviewsSlice.reducer;