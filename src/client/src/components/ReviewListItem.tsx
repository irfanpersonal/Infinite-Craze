import React from 'react';
import {nanoid} from 'nanoid';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type ReviewType} from '../features/singleProduct/singleProductSlice';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {deleteReview, updateReview} from '../features/singleProduct/singleProductThunk';
import {useParams} from 'react-router-dom';

interface ReviewListItemProps {
    name: string,
    profilePicture: string,
    singleProductReview: ReviewType
}

const ReviewListItem: React.FunctionComponent<ReviewListItemProps> = ({name, profilePicture, singleProductReview}) => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {updateReviewLoading, deleteReviewLoading} = useSelector((store: useSelectorType) => store.singleProduct);
    const [isEditingReview, setIsEditingReview] = React.useState(false);
    const toggleIsEditingReview = () => {
        setIsEditingReview(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('rating', (target.elements.namedItem('rating') as HTMLSelectElement).value);
        formData.append('title', (target.elements.namedItem('title') as HTMLInputElement).value);
        formData.append('comment', (target.elements.namedItem('comment') as HTMLTextAreaElement).value);
        dispatch(updateReview({productID: id!, reviewID: singleProductReview!._id, data: formData}));
    }
    return (
        <div className="single-review" key={nanoid()}>
            <div className="review-user">
                <img className="pfp" src={profilePicture || emptyProfilePicture}/>
                <div>{name}</div>
            </div>
            <div className="review-info">
                {isEditingReview ? (
                    <form className="edit-review-form" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="rating">Rating</label>
                            <select id="rating" name="rating" defaultValue={singleProductReview!.rating} required>
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="title">Title</label>
                            <input id="title" name="title" defaultValue={singleProductReview!.title} required/>
                        </div>
                        <div>
                            <label htmlFor="comment">Comment</label>
                            <textarea id="comment" name="comment" defaultValue={singleProductReview!.comment} required></textarea>
                        </div>
                        <button type="submit" disabled={updateReviewLoading}>{updateReviewLoading ? 'Editing' : 'Edit'}</button>
                    </form>
                ) : (
                    <>
                        <div>Rating Given: {singleProductReview.rating}</div>
                        <div>Rating Title: {singleProductReview.title}</div>
                        <div>Rating Comment: {singleProductReview.comment}</div>
                    </>
                )}
                {user!?.name === singleProductReview.user.name && (
                    <>
                        <span onClick={toggleIsEditingReview} className="edit-review">{isEditingReview ? 'Cancel' : 'Edit'}</span>
                        <span onClick={() => {
                            if (deleteReviewLoading) {
                                return;
                            }
                            dispatch(deleteReview({productID: id!, reviewID: singleProductReview!._id}));
                        }} className="delete-review">{deleteReviewLoading ? 'Deleting' : 'Delete'}</span>
                    </>
                )}
            </div>
        </div>
    );
}

export default ReviewListItem;