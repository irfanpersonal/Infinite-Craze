import React from 'react';
import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {updateSearchBoxValues, setPage, toggleIsAddingReview} from '../features/singleProduct/singleProductSlice';
import {getSingleProduct, getSingleProductWithAuth, getSingleProductReviews, deleteSingleProduct} from '../features/singleProduct/singleProductThunk';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useParams, Link} from 'react-router-dom';
import {FaEdit, FaTrash, FaCheckCircle} from 'react-icons/fa';
import {FaArrowLeft} from 'react-icons/fa6';
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
                    <Link to={`/product`} style={{cursor: 'pointer',display:'flex',flexDirection:'row',alignItems:'center',}}><FaArrowLeft/> <span style={{marginLeft:'10px'}}>Back</span></Link>
                </div>
                <div className="hideMobile">
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
                                    <p className="product-title"><span></span>{singleProduct!.name}</p>
                                    <p className="product-price"><span></span>${singleProduct!.price / 100}</p>
                                    <p className="product-description"><span></span>{singleProduct!.description}</p>
                                    <p><span>Category: </span>{singleProduct!.category.charAt(0).toUpperCase() + singleProduct!.category.slice(1)}</p>
                                    <p><span>Condition: </span>{singleProduct!.condition.charAt(0).toUpperCase() + singleProduct!.condition.slice(1)}</p>
                                    
                                    <p><span>Shipping Fee: </span>${singleProduct!.shippingFee / 100}</p>
                                    <p><span>Average Rating: </span>{singleProduct!.averageRating ? singleProduct!.averageRating : 'No Reviews'}</p>
                                    <form onSubmit={handleSubmit}>
                                        <p>
                                            <span>Colors: </span>
                                            <div className="row">
                                                {singleProduct!.colors.map(item => {
                                                    return (
                                                        <span className="pointer" key={nanoid()} onClick={() => {
                                                            setSelectedColor(currentState => {
                                                                return item;
                                                            });
                                                        }} style={{border: '1px solid black', backgroundColor: item, color: 'white',minWidth:'40px',minHeight:'40px', outline: selectedColor === item ? '2px solid #4cb051' : '',marginRight:'10px',marginTop:'10px',}}></span>
                                                    );
                                                })}
                                            </div>
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
                        <h1 className="f16">Reviews ({totalReviews})</h1>
                        <div className="rating-filters">
                            
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
                        {didOrder && !alreadyWroteReview && !isAddingReview && (
                            <div className="row aCenter jCenter pad20">
                                <div onClick={() => {
                                    dispatch(toggleIsAddingReview());
                                }} className="add-review">+ Add Review</div>
                            </div> 
                        )}

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
        padding:20px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
        background-color:#eeeeee;
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
        padding: 100px 20px;
    }
    .product-information {
        display:flex;
        flex-direction:row;
        img {
            width: 20rem;   
            height: 20rem;
            object-fit:contain;
        }
        display: flex;
    }
    .product-image {
        flex:1;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;

    }
    .product-details {
        flex:1;
        display:flex;
        flex-direction:column;
        p {
            font-weight:400;
            margin-bottom:10px;
        }
        span {
            font-weight:600;
        }
    }
    .product-details .product-title {
        font-size:48px;
        font-weight:600;
    }
    .product-details .product-price {
        font-weight:600;
        margin-bottom:20px;
    }
    .product-details .product-description {
        padding:20px;
        margin-bottom:20px;
        background-color:#eeeeee;
    }
    .btn {
        cursor: pointer;
        color: white;
        background-color: black;
        user-select: none;
        border-width:0px;
        padding:20px 60px;
        margin-top:20px;
    }
    .btn:hover, .btn:active {
        background-color: black;
        color: white;
    }
    .single-review {
        margin:20px;
        display:flex;
        flex-direction:row;
        padding-bottom:20px;
        border-bottom:1px solid #eeeeee;
    }
    .review-user {
        display:flex;
    }
    .rating-search {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eeeeee;
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
        width:50px;
        height:50px;
        object-fit:cover;
    }
    .review-info {
        flex:1;
        margin-left:20px;
    }
    .pointer {
        cursor: pointer;
    }
    .add-review {
        width:200px;
        padding:10px;
        color:#FFFFFF;
        text-align:center;
        background-color:#000000;
    }
    .review-form {
        margin:20px;
        padding:0px;
        margin-top:0px;
        border:0px solid #eeeeee;
        select, input, textarea, button {
            width: 100%;
            padding:10px;
            border-radius:0px;
        }
        textarea {
            resize: none;
            height: 100px;
            border:1px solid #eeeeee;
            background-color:#F9F9F9;
        }
    }
    .review-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        label{
            display:flex;
            margin-top:10px;
            margin-bottom:20px;
        }
    }
    label[for="comment"] {
        margin-top:10px;
        margin-bottom:20px;
    }
    .review-container div {
        margin-top:10px;
        margin-bottom:20px;
    }
    .edit-review {
        cursor:pointer;
        display:inline-block;
        color:#FFFFFF;
        padding:5px 20px;
        margin-top:10px;
        margin-right:10px;
        border:0px solid #000000;
        background-color:#4CAF50;
    }
    .delete-review {
        cursor:pointer;
        display:inline-block;
        color:#000000;
        padding:5px 20px;
        margin-top:10px;
        margin-right:10px;
        border:0px solid #000000;
        background-color:#EEEEEE;
    }
    .edit-review:hover, .edit-review:active {
        color:#4CAF50;
        outline: 1px solid #4CAF50; 
        background-color:#FFFFFF;
    }
    .delete-review:hover, .delete-review:active {
        color:#FF0000;
        outline: 1px solid #FF0000; 
        background-color:#FFFFFF; 
    }
    .edit-review-form {
        label {
            display: block;
            margin-top:20px;
            margin-bottom:10px;
        }
        select, input, textarea, button {
            width: 100%;
            padding:10px;
            border-radius:0px;
        }
        textarea {
            resize: none;
            height: 100px;
        }
    }
    .already-ordered {
        padding:1rem;
        display:flex;
        flex-direction:row;
        justify-content: center;
        align-items:center;
        div {
            display:flex;
            flex-direction:row;
            align-items:center;
        }
        svg {
            color: green;
        }
        a {
            margin-left:15px;
            color:#ffffff;
            padding:0px 15px;
            background-color:#000000;
        }
        a:hover {
            color: gray;
        }
        .already-ordered-text {
            margin-left: 1rem;
        }
    }
    .rating-container {
        width:50%;
        margin: auto;
    }
    .editReviewButton {
        width:200px;
        max-width:200px;
        padding:7px !important;
        color:#ffffff;
        margin:10px 0px 0px 0px;
        border:1px solid #000000;
        background-color:#000000;
        cursor:pointer;
    }
    .editReviewButton:hover {
        color:#000000;
        background-color:#ffffff;
    }
`;

export default Product;