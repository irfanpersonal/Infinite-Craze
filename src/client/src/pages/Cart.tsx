import React from 'react';
import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {nanoid} from 'nanoid';
import {increaseAmount, decreaseAmount, deleteItem, calculateTotals, clearCart} from '../features/cart/cartSlice';
import {createPaymentIntent} from '../features/user/userThunk';
import { FaRegTrashCan } from "react-icons/fa6";
import {Link} from 'react-router-dom';


const Cart: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user, createPaymentIntentLoading} = useSelector((store: useSelectorType) => store.user);
    const {items, subTotal, shippingCost, tax, total, numberOfItems} = useSelector((store: useSelectorType) => store.cart);
    React.useEffect(() => {
        dispatch(calculateTotals());
    }, [items]);
    return (
        <Wrapper>
            
            <div className="column aCenter pad50 pageHeader">
                {items.length ? (
                    <h1 className="">Cart ({numberOfItems})</h1>
                ) : (
                    <h1 className="">No items currently in cart!</h1>
                )}
                <p className="">View your cart details</p>
            </div>

            <div className="cart">


            <div className="cartMain">

            
            
            {items.map(item => {
                return (
                    <div className="cartItem product" key={nanoid()}>
                        <div className="cartImageWrapper">
                            <img className="product-image" src={item.product.image || emptyProductImage}/>
                        </div>
                        <div className="productMeta">
                            <div className="productMetaMain">
                                <div className="f32 fw600">{item.product.name}</div>
                                <div>Product Color: {item.color}</div>
                                <div>Product Condition: {item.condition}</div>
                                <div className="fw600" style={{padding:'10px 0px'}}>${item.product.price / 100}</div>
                                <div className="enumerate">
                                    <div className="enumerateItem">
                                    
                                    <button onClick={() => {
                                        dispatch(decreaseAmount({product: item.product, color: item.color}));
                                    }}>-</button>
                                    <div>{item.amount}</div>
                                    <button onClick={() => {
                                        dispatch(increaseAmount({product: item.product, color: item.color}));
                                    }}>+</button>
                                    
                                    </div>
                                </div>
                            </div>


                            <button className="deleteCartItem" onClick={() => {
                                dispatch(deleteItem({product: item.product, color: item.color}));
                            }}>
                                <FaRegTrashCan size={16} color={'#686868'}/>
                            </button>
                        </div>
                    </div>
                );
            })}

            </div>

            <div className="cartInformation">
                <div className="subtotal">Subtotal: <span>${subTotal / 100}</span></div>
                <div className="shipping">Shipping Fee: <span>${shippingCost / 100}</span></div>
                <div className="tax">Tax: <span>${(tax / 100).toFixed(2)}</span></div>
                <div className="total">Total: <span>${(total / 100).toFixed(2)}</span></div>

                
                {items.length < 1 ? <div style={{width:'200px',height:'1px',marginBottom:'-10px',}}></div> : null}

                {user!?.role === 'user' ? (
                
                    <>
                        {items.length > 0 && (
                            <div onClick={() => {
                                const formData = new FormData();
                                const formattedData = items.map(item => ({
                                    product: item.product._id,
                                    amount: item.amount,
                                    color: item.color,
                                    condition: item.condition
                                }));
                                formData.append('items', JSON.stringify(formattedData));
                                dispatch(createPaymentIntent(formData));
                            }} className="cartAction">{createPaymentIntentLoading ? 'Checking Out...' : 'Checkout'}</div>
                        )}
                    </>
                ) : (
                    <Link className="cartAction" to='/auth'>Register / Login</Link>
                )}
                {items.length > 0 && (
                    <button className="clearCart" onClick={() => dispatch(clearCart())}>Clear Cart</button>
                )}
            </div>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .pageHeader {
        background-size: cover; 
        background-position: center center; 
        border-top: 1px solid #eeeeee;
        border-bottom: 1px solid #eeeeee;
        background-color: rgb(255, 255, 255);
    }
    .cart {
        width:50%;
        margin:auto;
        display:flex;
        flex-direction:row;
        align-items:flex-start;
    }
    .cartMain {
        flex:1;
        display:flex;
        padding-top:40px;
        flex-direction:column;
    }
    .cartItem {
        flex:1;
        display:flex;
        margin: 10px;
    }
    .cartInformation {
        margin: 10px;
        padding:20px;
        margin-top:65px;
        border:1px solid #eeeeee;
    }
    .productMeta {
        flex:1;
        display:flex;
        flex-direction:row;
        align-items:center;
        padding-left:20px;
    }
    .productMetaMain {
        flex:1;
        display:flex;
        flex-direction:column;
    }
    .title {
        padding:10px;
    }
    .cartImageWrapper {
        padding:10px;
        display:flex;
        flex-direction:row;
        align-items:center;
    }
    .product {
        padding: 20px;
        margin-bottom:20px;
        border-bottom: 1px solid #eeeeee;
        .product-image {
            width: 100px;
            height: 100px;
            object-fit:contain;
        }
        button {
            padding:0px;
            display: block;
        }
    }
    .enumerate {
        display:flex;
    }
    .enumerateItem {
        padding:10px;
        display:flex;
        flex-direction:row;
        align-items:center;
        background-color:#FFFFFF;
        border: 1px solid #eeeeee;
    }
    .enumerateItem div {
        padding:0px 10px;
    }
    .enumerateItem button {
        width:24px;
        height:24px;
        display:flex;
        align-items:center;
        justify-content:center;
        color: #FFFFFF;
        border-width:0px;
        background-color:#000000;
    }
    .checkout-link {
        cursor: pointer;
        display: inline-block;
        padding: 0.5rem 2rem;
        text-decoration: none;
        border-radius: 0.5rem;
        color: black;
        background-color: lightgray;
    }
    .checkout-link:hover, .checkout-link:active {
        outline: 1px solid black;
    }
    .cartInformation div {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom:10px;
        justify-content: space-between;
    }
    .cartInformation span {
    }
    .cartInformation .cartAction {
        display:flex;
        width:200px;
        padding:10px;
        color:#FFFFFF;
        align-items:center;
        justify-content:center;
        text-align:center;
        font-weight: 400;
        font-size:14px;
        margin-bottom:10px;
        background-color:#000000;
    }
    .clearCart {
        display:flex;
        width:200px;
        color:#000000;
        border-width:0px;
        padding:10px 40px;
        text-align:center;
        align-items:center;
        justify-content:center;
        background-color:#eeeeee;
    }
    .deleteCartItem {
        display:flex;
        align-items:center;
        justify-content:center;
        border-width:0px;
        background-color:transparent;
    }
`;

export default Cart;