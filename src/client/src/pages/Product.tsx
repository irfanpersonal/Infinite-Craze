import React from 'react';
import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {updateSearchBoxValues, setPage, toggleIsAddingReview} from '../features/singleProduct/singleProductSlice';
import {getSingleProduct, getSingleProductWithAuth, getSingleProductReviews, deleteSingleProduct} from '../features/singleProduct/singleProductThunk';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useParams, Link} from 'react-router-dom';
import {FaArrowAltCircleLeft, FaEdit, FaTrash, FaCheckCircle} from 'react-icons/fa';
import {IoMdCloseCircle} from 'react-icons/io';
import {FiCopy} from 'react-icons/fi';
import {toast} from 'react-toastify';
import {Loading, EditProduct, AddReview, ReviewList, PaginationBox} from '../components';
import {nanoid} from 'nanoid';
import {addItemToCart} from '../features/cart/cartSlice';
import {type ProductType} from '../features/products/productsSlice';

const Product: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {id} = useParams();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {singleProduct, singleProductLoading, singleProductReviews, singleProductReviewsLoading, searchBoxValues, numberOfPages, totalReviews, page, alreadyWroteReview, didOrder, isAddingReview, latestOrderForThisProduct} = useSelector((store: useSelectorType) => store.singleProduct);
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState<string>('');
    const toggleEdit = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const color = selectedColor;
        if (!color) {
            toast.error('Please select a color to add product to cart!');
            return;
        }
        const amount = ((event.target as HTMLFormElement).elements.namedItem('amount') as HTMLSelectElement).value;
        const addThisToCart: {product: ProductType, amount: number, color: string, condition: 'new' | 'used' | 'refurbished' | 'damaged'} = {
            product: singleProduct!,
            amount: Number(amount),
            color: color,
            condition: singleProduct!.condition
        };
        dispatch(addItemToCart(addThisToCart));
    }
    React.useEffect(() => {
        dispatch(getSingleProductReviews(id!));
        if (user!?.role === 'user') {
            dispatch(getSingleProductWithAuth(id!));
            return;
        }
        dispatch(getSingleProduct(id!));
    }, []);
    return (
        <Wrapper>
            <div className="product-navigation">
                <div>
                    <Link to={`/product`} style={{cursor: 'pointer', color: 'white'}}><FaArrowAltCircleLeft/></Link>
                </div>
                <div>
                    <div>{isEditing ? 'Editing Single Product' : 'Viewing Single Product'}</div>
                </div>
                <div className="product-actions">
                    {user!?.role === 'admin' && (
                        <>
                            <div className="edit" onClick={toggleEdit}>{isEditing ? <IoMdCloseCircle className="trash"/> : <FaEdit/>}</div>
                            <div className="trash" onClick={() => {
                                dispatch(deleteSingleProduct(id!));
                            }}><FaTrash/></div>
                        </>
                    )}
                    <div onClick={async() => {
                        if (navigator.clipboard) {
                            await navigator.clipboard.writeText(window.location.href);
                        }
                        toast.success('Copied Link!');
                    }} className="copy"><FiCopy/></div>
                </div>
            </div>
            {singleProductLoading ? (
                <Loading title="Loading Single Product" position="normal" marginTop="1rem"/>
            ) : (
                <div>
                    {latestOrderForThisProduct && (
                        <div className="already-ordered">
                            <div><FaCheckCircle/></div>
                            <div className="already-ordered-text">
                                You already ordered this product. <Link to={`/order/${latestOrderForThisProduct!._id}`}>View</Link>
                            </div>
                        </div>
                    )}
                    {isEditing ? (
                        <EditProduct data={singleProduct!}/>
                    ) : (   
                        <div className="product-container">
                            <div className="product-information">
                                <div className="product-image">
                                    <img src={singleProduct!.image || emptyProductImage} alt={singleProduct!.name}/>
                                </div>
                                <div className="product-details">
                                    <p><span>Name: </span>{singleProduct!.name}</p>
                                    <p><span>Description: </span>{singleProduct!.description}</p>
                                    <p><span>Category: </span>{singleProduct!.category.charAt(0).toUpperCase() + singleProduct!.category.slice(1)}</p>
                                    <p><span>Condition: </span>{singleProduct!.condition.charAt(0).toUpperCase() + singleProduct!.condition.slice(1)}</p>
                                    <p><span>Price: </span>${singleProduct!.price / 100}</p>
                                    <p><span>Shipping Fee: </span>${singleProduct!.shippingFee / 100}</p>
                                    <p><span>Average Rating: </span>{singleProduct!.averageRating ? singleProduct!.averageRating : 'No Reviews'}</p>
                                    <form onSubmit={handleSubmit}>
                                        <p>
                                            <span>Colors: </span>{singleProduct!.colors.map(item => {
                                                return (
                                                    <span className="pointer" key={nanoid()} onClick={() => {
                                                        setSelectedColor(currentState => {
                                                            return item;
                                                        });
                                                    }} style={{border: '1px solid black', backgroundColor: item, color: 'white', outline: selectedColor === item ? '2px solid black' : ''}}></span>
                                                );
                                            })}
                                        </p>
                                        <p>
                                            <span>Amount: </span>
                                            <select id="amount" name="amount">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </p>
                                        {user!?.role !== 'admin' && (
                                            <button type="submit" className="btn">Add to Cart</button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {singleProductReviewsLoading ? (
                <Loading title="Loading Product Reviews" position='normal'/>
            ) : (
                <div className="rating-container">
                    <div className="rating-search">
                        <h1>Reviews ({totalReviews})</h1>
                        <div className="rating-filters">
                            {didOrder && !alreadyWroteReview && (
                                <div>
                                    <div onClick={() => {
                                        dispatch(toggleIsAddingReview());
                                    }} className="add-review">{isAddingReview ? 'X' : '+'}</div>
                                </div> 
                            )}
                            <div>
                                <label htmlFor="ratingValue">Rating</label>
                                <select id="ratingValue" name="ratingValue" value={searchBoxValues.ratingValue} onChange={(event) => {
                                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                                    dispatch(setPage(1));
                                    dispatch(getSingleProductReviews(id!));
                                }}>
                                    <option value=""></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div>
                                <label className="sort-value" htmlFor="sortValue">Sort</label>
                                <select id="sortValue" name="sortValue" value={searchBoxValues.sortValue} onChange={(event) => {
                                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                                    dispatch(setPage(1));
                                    dispatch(getSingleProductReviews(id!));
                                }}>
                                    <option value=""></option>
                                    <option value="latest">Latest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {isAddingReview && (
                        <AddReview/>
                    )}
                    <div className="rating-results">
                        <ReviewList data={singleProductReviews}/>
                    </div>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getSingleProductReviews} _id={id}/>
                    )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .product-navigation {
        padding: 0.5rem;
        margin: 0 1rem;
        margin-top: 1rem;
        background-color: black;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .product-actions {
        display: flex;
        div {
            margin-left: 1rem;
        }
    }
    .edit, .trash, .copy {
        cursor: pointer;
    }
    .edit:hover, .edit:active {
        color: gray;
    }
    .trash:hover, .trash:active {
        color: lightcoral;
    }
    .copy:hover, .copy:active {
        color: lightblue;
    }
    .product-container {
        padding: 1rem;
    }
    .product-information {
        img {
            outline: 1px solid black;
            width: 20rem;   
            height: 20rem;
        }
        display: flex;
    }
    .product-image {
        margin-right: 1rem;
    }
    .product-details {
        p {
            margin-bottom: 1rem;
            border-bottom: 1px solid black;
        }
        span {
            background-color: lightgreen;
            border-radius: 0.5rem;
            padding: 0rem 0.5rem;
            margin-right: 0.5rem;
        }
    }
    .btn {
        cursor: pointer;
        color: black;
        outline: 1px solid black;
        border: none;
        border-radius: 0.5rem;
        display: inline-block;
        padding: 0.5rem;
        background-color: white;
        user-select: none;
    }
    .btn:hover, .btn:active {
        background-color: black;
        color: white;
    }
    .single-review {
        outline: 1px solid black;
        margin: 0.5rem 0;
        padding: 1rem;
        display: flex;
    }
    .review-user {
        text-align: center;
        outline: 1px solid black;
        display: flex;
        flex-direction: column;
    }
    .rating-search {
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }
    .rating-filters {
        display: flex;
        .sort-value {
            margin-left: 1rem;
        }
        select {
            margin-left: 0.5rem;
        }
    }
    .pfp {
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
    }
    .review-info {
        margin-left: 1rem;
    }
    .pointer {
        cursor: pointer;
    }
    .add-review {
        background-color: gray;
        padding: 0 0.5rem;
        margin-right: 0.5rem;
        outline: 1px solid black;
        cursor: pointer;
    }
    .review-form {
        width: 50%;
        outline: 1px solid black;
        margin: 1rem auto;
        text-align: center;
        padding: 1rem;
        select, input, textarea, button {
            width: 100%;
            padding: 0.25rem;
        }
        textarea {
            resize: none;
            height: 100px;
        }
    }
    .review-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .edit-review, .delete-review {
        display: inline-block;
        margin-top: 0.5rem;
        background-color: gray;
        padding: 0 1rem;
        margin-right: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .edit-review:hover, .edit-review:active, .delete-review:hover, .delete-review:active {
        outline: 1px solid black;
        background-color: white;   
    }
    .edit-review-form {
        label {
            display: block;
        }
        select, input, textarea, button {
            width: 100%;
            padding: 0.25rem;
        }
        textarea {
            resize: none;
            height: 100px;
        }
    }
    .already-ordered {
        margin: 1rem;
        outline: 1px solid black;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        svg {
            color: green;
        }
        a {
            color: black;
        }
        a:hover {
            color: gray;
        }
        .already-ordered-text {
            margin-left: 1rem;
        }
    }
`;

export default Product;