import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {createReview} from "../features/singleProduct/singleProductThunk";
import {useParams} from "react-router-dom";

const AddReview: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {createReviewLoading} = useSelector((store: useSelectorType) => store.singleProduct);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('rating', (target.elements.namedItem('rating') as HTMLSelectElement).value);
        formData.append('title', (target.elements.namedItem('title') as HTMLInputElement).value);
        formData.append('comment', (target.elements.namedItem('comment') as HTMLTextAreaElement).value);
        dispatch(createReview({productID: id!, data: formData}));
    }
    return (
        <div>
            <form className="review-form" onSubmit={handleSubmit}>
                <div className="review-container">
                    <div className="flexFull" style={{marginRight:'20px',}}>
                        <label htmlFor="title">Title</label>
                        <input id="title" type="text" name="title"/>
                    </div>
                    <div>
                        <label htmlFor="rating">Rating</label>
                        <select id="rating" name="rating">
                            <option value=""></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="comment">Comment</label>
                    <textarea id="comment" name="comment"></textarea>
                </div>
                <button style={{backgroundColor:'#000000',color:'#FFFFFF',width:'200px',marginTop:'20px',borderWidth:'0px',}} type="submit" disabled={createReviewLoading}>{createReviewLoading ? 'Creating Review...' : 'Create Review'}</button>
            </form>
        </div>
    );
}

export default AddReview;