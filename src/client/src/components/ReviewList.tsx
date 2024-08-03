import React from 'react';
import {nanoid} from 'nanoid';
import {type ReviewType} from '../features/singleProduct/singleProductSlice';
import ReviewListItem from './ReviewListItem';

interface ReviewListProps {
    data: ReviewType[]
}

const ReviewList: React.FunctionComponent<ReviewListProps> = ({data}) => {
    return (
        <>
            {!data.length && (
                <></>
            )}
            {data.map(singleProductReview => {
                const {user: {name, profilePicture}} = singleProductReview;
                return (
                    <ReviewListItem key={nanoid()} name={name} profilePicture={profilePicture} singleProductReview={singleProductReview}/>
                );
            })}
        </>
    );
}

export default ReviewList;