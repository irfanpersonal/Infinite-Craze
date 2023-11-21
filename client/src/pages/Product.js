import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteSingleProduct, getSingleProduct} from "../features/product/productThunk.js";
import {Link, useNavigate, useParams} from 'react-router-dom';
import {deleteSingleReview, getSingleProductReviews, getSingleReview} from '../features/reviews/reviewsThunk.js';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {ReviewBox} from '../components';
import {isEditingTrue} from '../features/reviews/reviewsSlice.js';
import {isEditingProductTrue} from '../features/addProduct/addProductSlice.js';
import {updateProductSelectionColor, updateProductSelectionAmount} from '../features/product/productSlice.js';
import {addProductToCart} from '../features/cart/cartSlice.js';

const Product = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    const {isLoading: isLoadingProduct, product, productSelection} = useSelector(store => store.product);
    const {isLoading: isLoadingReviews, reviews} = useSelector(store => store.reviews);
    React.useEffect(() => {
        dispatch(getSingleProduct(id));
        dispatch(getSingleProductReviews(id));
    }, []);
    return (
        <div>
            {isLoadingProduct ? (
                <h1>Loading Product Data...</h1>
            ) : (
                <>
                    <ProductBoxWrapper>
                        <Link to='/products'>Back to Products</Link>
                        <div className="container">
                            <img src={product.image} alt={product.name}/>
                            <div>
                                <p><span>Name: </span>{product.name}</p>
                                <p><span>Category: </span>{product.category}</p>
                                <p><span>Price: </span>${product.price / 100}</p>
                                <p><span>Colors: </span>{product.colors.map(color => {
                                    return <span onClick={() => dispatch(updateProductSelectionColor(color))} style={{backgroundColor: color, border: '1px solid black', border: productSelection.color === color && '3px solid black'}} key={nanoid()}></span>
                                })}</p>
                                <p><span>Amount: </span> <select value={productSelection.amount} onChange={(event) => dispatch(updateProductSelectionAmount(event.target.value))}>{Array.from({length: product.inventory}, (value, index) => {
                                    return <option key={nanoid()}>{index + 1}</option>
                                })}</select></p>
                                {user?.role !== 'admin' && (
                                    <button onClick={() => {
                                        // product, amount, color
                                        dispatch(addProductToCart(productSelection));
                                    }}>Add to Cart</button>
                                )}
                                <p><span>Average Rating: {Number.isInteger(product.averageRating) ? product.averageRating : product.averageRating.toFixed(2)} ⭐️</span><span>Number Of Reviews: {product.numberOfReviews}</span></p>
                                {user?.role === 'admin' && (
                                    <div>
                                        <span onClick={() => {
                                            navigate('/add-product');
                                            dispatch(isEditingProductTrue());
                                            dispatch(getSingleProduct(product._id));
                                        }}>EDIT</span>
                                        <span onClick={() => dispatch(deleteSingleProduct(product._id))}>DELETE</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ProductBoxWrapper>
                </>
            )}
            {user?.role !== 'admin' && (
                <ReviewsBoxWrapper>
                    <h1 style={{backgroundColor: 'lightblue', textAlign: 'center', marginBottom: '1rem'}}>Reviews</h1>
                    <ReviewBox/>
                    {isLoadingReviews ? (
                        <h1>Loading Reviews Data...</h1>
                    ) : (
                        <>
                            {reviews.map(review => {
                                const {title, comment, rating, user: {name}, _id: reviewID} = review;
                                return (
                                    <article key={nanoid()} style={{backgroundColor: name === user.name && 'lightgreen'}}>
                                        <h1>{title}</h1>
                                        <h1>{comment}</h1>
                                        <h1>{rating}</h1>
                                        <h1>by: {name} {name === user.name && '(you!)'}</h1>
                                        {name === user.name && (
                                            <>
                                                <button onClick={() => {
                                                    dispatch(isEditingTrue());
                                                    dispatch(getSingleReview(reviewID));
                                                }}>EDIT</button>
                                                <button onClick={() => dispatch(deleteSingleReview({reviewID, productID: product._id}))}>DELETE</button>
                                            </>
                                        )}
                                    </article>
                                );
                            })}
                        </>
                    )}
                </ReviewsBoxWrapper>
            )}
        </div>
    );
}

const ProductBoxWrapper = styled.div`
    a {
        display: block;
        background-color: lightblue;
        padding: 0.5rem;
        text-decoration: none;
        color: black;
        text-align: center;
    }
    a:hover {
        outline: 1px solid black;
    }
    .container {
        margin-top: 1rem;
        display: flex;
    }
    img {
        width: 300px;
        height: 300px;
        margin-right: 1rem;
        border: 1px solid black;
    }
    p {
        margin-bottom: 1rem;
    }
    p > span {
        color: white;
        background-color: gray;
        padding: 0 0.5rem;
        border-radius: 0.5rem;
        margin-right: 0.5rem;
    }
    p + button {
        padding: 0.5rem;
        margin-bottom: 1rem;
    }
    div > span {
        display: inline-block;
        background-color: lightgray;
        margin-right: 1rem;
        padding: 0.5rem;
        border: 1px solid black;
        width: 25%;
        text-align: center;
        cursor: pointer;
    }
`;

const ReviewsBoxWrapper = styled.div`
    margin-top: 1rem;
    border: 1px solid black;
    padding: 1rem;
    article {
        border: 1px solid black;
        margin-top: 1rem;
    }
    article > h1 {
        text-align: center;
    }
    button {
        display: block;
        width: 90%;
        margin: 1rem auto;
        padding: 0.5rem;
    }
`;

export default Product;