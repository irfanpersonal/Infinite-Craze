import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {createReview, updateSingleReview} from '../features/reviews/reviewsThunk';
import {clearSingleReviewData, handleSingleReviewData, isEditingFalse} from '../features/reviews/reviewsSlice';

const CreateReview = () => {
    const dispatch = useDispatch();
    const {product} = useSelector(store => store.product);
    const {isCreateReviewLoading, isEditing, singleReviewData} = useSelector(store => store.reviews);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditing) {
            dispatch(updateSingleReview({reviewID: singleReviewData._id, review: {title: singleReviewData.title, comment: singleReviewData.comment, rating: singleReviewData.rating}, productID: product._id}));
            return;
        }
        dispatch(createReview({review: {...singleReviewData, product: product._id}, productID: product._id}));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1 style={{textAlign: 'center', backgroundColor: 'lightblue'}}>{isEditing ? 'Edit' : 'Create'}</h1>
                <div>
                    <label htmlFor="title">Review Title</label>
                    <input id="title" type="text" name="title" value={singleReviewData.title} onChange={(event) => dispatch(handleSingleReviewData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="comment">Review Comment</label>
                    <input id="comment" type="text" name="comment" value={singleReviewData.comment} onChange={(event) => dispatch(handleSingleReviewData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="rating">Rating</label>
                    <select id="rating" name="rating" value={singleReviewData.rating} onChange={(event) => dispatch(handleSingleReviewData({name: event.target.name, value: event.target.value}))}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <button style={{width: '100%'}} type="button" onClick={() => {
                    dispatch(isEditingFalse());
                    dispatch(clearSingleReviewData());
                }}>CLEAR</button>
                <button style={{width: '100%'}} type="submit">{isCreateReviewLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    button {
        display: block;
        width: 90%;
        margin-top: 1rem;
        padding: 0.5rem;
    }
    form {
        width: 50%;
        border: 1px solid black;
        margin: 0 auto;
        padding: 1rem;
    }
    div > label {
        display: block;
        margin-top: 1rem;
    }
    label + input, label + select, div + button {
        width: 100%;
        padding: 0.5rem;
    }
`;

export default CreateReview;