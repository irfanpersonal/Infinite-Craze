import React from 'react';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {calculateTotals, clearCart, decreaseItemAmount, increaseItemAmount, removeItem, updateCreatePaymentIntentData} from '../features/cart/cartSlice';
import {Link, useNavigate} from 'react-router-dom';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {cart, total} = useSelector(store => store.cart);
    const {user} = useSelector(store => store.user);
    React.useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/');
        }
        dispatch(calculateTotals());
    }, [cart]);
    return (
        <Wrapper>
            <h1 style={{borderBottom: '1px solid black'}}>Cart</h1>
            {!cart.length && (
                <h2 style={{margin: '1rem 0'}}>No Items in Cart...</h2>
            )}
            {cart.map(cartItem => {
                return (
                    <article key={nanoid()}>
                        <img src={cartItem.image} alt={cartItem.name}/>
                        <h1>Product Name: {cartItem.name}</h1>
                        <h1>Product Price: {cartItem.price / 100}</h1>
                        <h1>Product Color: {cartItem.color}</h1>
                        <h1>Amount: {cartItem.amount}</h1>
                        <button style={{width: '50%'}} onClick={() => dispatch(increaseItemAmount(cartItem.uniqueID))}>+</button>
                        <button style={{width: '50%'}} onClick={() => {
                            if (cartItem.amount === 1) {
                                dispatch(removeItem(cartItem.uniqueID));
                                return;
                            }
                            dispatch(decreaseItemAmount(cartItem.uniqueID));
                        }}>-</button>
                        <button onClick={() => dispatch(removeItem(cartItem.uniqueID))} style={{display: 'block', width: '100%', marginTop: '1rem'}}>REMOVE</button>
                    </article>
                );
            })}
            {cart.length >= 1 && (
                <button onClick={() => dispatch(clearCart())} style={{width: '100%', backgroundColor: 'lightcoral', border: 'none'}}>CLEAR CART</button>
            )}
            {cart.length >= 1 && (
                <>
                    <h1 style={{marginTop: '1rem'}}>Subtotal: {(total - 2.99 - 4.99).toFixed(2)}</h1>
                    <h1 style={{marginTop: '1rem'}}>Tax: $2.99</h1>
                    <h1 style={{marginTop: '1rem'}}>Shipping: $4.99</h1>
                    <h1 style={{borderTop: '1px solid black', marginTop: '1rem'}}>Total: {total}</h1>
                </>
            )}
            {user?.role === 'user' ? (
                <>
                    {cart.length >= 1 && (
                        <Link to='/checkout'><button onClick={() => dispatch(updateCreatePaymentIntentData())}>Checkout</button></Link>
                    )}
                </>
            ) : (
                <Link to='/auth'>Login/Register to Checkout!</Link>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    article {
        border: 1px solid black;
        margin: 1rem 0;
    }
    img {
        width: 100px;
        height: 100px;
    }
    button {
        padding: 0.5rem;
    }
`;

export default Cart;