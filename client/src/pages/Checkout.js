import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {createPaymentIntent} from '../features/cart/cartThunk';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {toast} from 'react-toastify';
import axios from 'axios';
import {clearCart, isSuccessfulTrue} from '../features/cart/cartSlice';
import styled from 'styled-components';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const {user} = useSelector(store => store.user);
    const {createPaymentIntentData, clientSecret} = useSelector(store => store.cart);
    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });
        if (result.error) {
            toast.error(result.error.message);
        }
        else {
            const successfulPayment = result.paymentIntent;
            const sendForCreateOrder = {
                paymentIntentID: successfulPayment.id,
                clientSecret: successfulPayment.client_secret,
                total: successfulPayment.amount,
                tax: "299",
                shippingFee: "499",
                items: createPaymentIntentData?.items
            }
            const response = await axios.post('/api/v1/orders', sendForCreateOrder);
            if (response.status === 201) {
                dispatch(isSuccessfulTrue());
                dispatch(clearCart());
                toast.success('Successfully Created Order!');
                navigate('/success-order');
            }   
        } 
    }
    React.useEffect(() => {
        if (!createPaymentIntentData?.items?.length) {
            navigate('/');
            return;
        }
        dispatch(createPaymentIntent(createPaymentIntentData));
    }, []); 
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>Checkout</h1>
                <h2>Hello, {user.name}</h2>
                <p>Please enter your card information to complete transaction.</p>
                <div>
                    <CardElement/>
                </div>
                <p>Note: Spam the number 42 for testing purposes!</p>
                <button type="submit" disabled={!stripe}>Pay Now!</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        width: 50%;
        border: 1px solid black;
        margin: 0 auto;
        padding: 1rem;
    }
    form > h1 {
        text-align: center;
        background-color: lightblue;
    }
    form > h2 {
        margin-top: 1rem;
    }
    form > p {
        margin: 1rem 0;
        background-color: lightgray;
        padding: 1rem;
    }
    button {
        padding: 0.5rem;
        width: 100%;
        margin-top: 1rem;
    }
`;

export default Checkout;