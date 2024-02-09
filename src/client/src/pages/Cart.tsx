import React from 'react';
import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {nanoid} from 'nanoid';
import {increaseAmount, decreaseAmount, deleteItem, calculateTotals, clearCart} from '../features/cart/cartSlice';
import {createPaymentIntent} from '../features/user/userThunk';

const Cart: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user, createPaymentIntentLoading} = useSelector((store: useSelectorType) => store.user);
    const {items, subTotal, shippingCost, tax, total, numberOfItems} = useSelector((store: useSelectorType) => store.cart);
    React.useEffect(() => {
        dispatch(calculateTotals());
    }, [items]);
    return (
        <Wrapper>
            {items.length ? (
                <h1 className="title">Cart({numberOfItems})</h1>
            ) : (
                <h1 className="title">No items currently in cart!</h1>
            )}
            {items.map(item => {
                return (
                    <div className="product" key={nanoid()}>
                        <div>
                            <img className="product-image" src={item.product.image || emptyProductImage}/>
                        </div>
                        <div>
                            <div>Product Name: {item.product.name}</div>
                            <div>Product Color: {item.color}</div>
                            <div>Product Condition: {item.condition}</div>
                            <div>Product Price: ${item.product.price / 100}</div>
                            <button onClick={() => {
                                dispatch(increaseAmount({product: item.product, color: item.color}));
                            }}>INCREASE</button>
                            <div>Product Amount: {item.amount}</div>
                            <button onClick={() => {
                                dispatch(decreaseAmount({product: item.product, color: item.color}));
                            }}>DECREASE</button>
                            <button onClick={() => {
                                dispatch(deleteItem({product: item.product, color: item.color}));
                            }}>DELETE</button>
                        </div>
                    </div>
                );
            })}
            <h1>Subtotal: ${subTotal / 100}</h1>
            <h1>Shipping Fee: ${shippingCost / 100}</h1>
            <h1>Tax: ${(tax / 100).toFixed(2)}</h1>
            <h1>Total: ${(total / 100).toFixed(2)}</h1>
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
                        }} className="checkout-link">{createPaymentIntentLoading ? 'Checking Out...' : 'Checkout'}</div>
                    )}
                </>
            ) : (
                <h1>Please register/login to purchase items in cart!</h1>
            )}
            <br></br>
            {items.length > 0 && (
                <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    .title {
        border-bottom: 1px solid black;
    }
    .product {
        outline: 1px solid black;
        padding: 1rem;
        margin: 0.5rem 0;
        .product-image {
            width: 10rem;
            height: 10rem;
        }
        button {
            display: block;
            padding: 0.5rem;
        }
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
`;

export default Cart;