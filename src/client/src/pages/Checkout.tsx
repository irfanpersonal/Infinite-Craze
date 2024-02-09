import React from 'react';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate} from 'react-router-dom';
import {Loading} from '../components';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {toast} from 'react-toastify';
import {createOrder} from '../features/orders/ordersThunk';
import {clearCart} from '../features/cart/cartSlice';

const Checkout: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {items} = useSelector((store: useSelectorType) => store.cart);
    const {paymentIntentData, user, successfulOrder} = useSelector((store: useSelectorType) => store.user);
    const {createOrderLoading} = useSelector((store: useSelectorType) => store.orders);
    const [isPageLoading, setIsPageLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(currentState => {
            return true;
        });
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(paymentIntentData!.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!
            }
        });
        if (result.error) {
            setIsLoading(currentState => {
                return false;
            });
            toast.error('Please enter all the information in correctly!');
        }
        else {
            setIsLoading(currentState => {
                return false;
            });
            const createOrderData = {...paymentIntentData};
            const target = event.target as HTMLFormElement;
            const postalCode = (target.elements.namedItem('postalCode') as HTMLInputElement).value;
            const country = (target.elements.namedItem('country') as HTMLInputElement).value;
            const city = (target.elements.namedItem('city') as HTMLInputElement).value;
            const address = (target.elements.namedItem('address') as HTMLInputElement).value;
            const state = (target.elements.namedItem('state') as HTMLInputElement).value;
            createOrderData.postalCode = postalCode;
            createOrderData.country = country;
            createOrderData.city = city;
            createOrderData.address = address;
            createOrderData.state = state;
            dispatch(createOrder(createOrderData));
            localStorage.removeItem('cart');
            dispatch(clearCart());
        }
    }
    React.useEffect(() => {
        if (!paymentIntentData) {
            navigate('/cart');
        }
        if (paymentIntentData) {
            setIsPageLoading(currentState => {
                return false;
            });
        }
    }, []); 
    return (
        <Wrapper>
            <h1 className="title">Checkout</h1>
            {isPageLoading ? (
                <Loading title="Loading Checkout Page" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <h1 style={{marginTop: '1rem'}}>Welcome {user!.name} to the checkout page!</h1>
                    <div>
                        {items.map(item => {
                            return (
                                <div className="product" key={nanoid()}>
                                    <div>
                                        <img className="product-image" src={item.product.image} alt={item.product.name}/>
                                        <div>{item.product.name}</div>
                                        <div>${item.product.price / 100}</div>
                                    </div>
                                    <div>{item.amount}</div>
                                    <div>{item.color}</div>
                                    <div>{item.condition}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="price-box">
                        <div>Subtotal: ${paymentIntentData!.subTotal / 100}</div>
                        <div>Shipping Cost: ${paymentIntentData!.shippingFee / 100}</div>
                        <div>Tax: ${paymentIntentData!.tax / 100}</div>
                        <div className="total">Total: ${paymentIntentData!.total / 100}</div>
                    </div>
                    <div className="payment-box">
                        <form onSubmit={handleSubmit}>
                            <p>To complete the purchase enter in your details!</p>
                            <div>
                                <label htmlFor="address">Address</label>
                                <input id="address" type="text" name="address" required/>
                            </div>
                            <div>
                                <label htmlFor="city">City</label>
                                <input id="city" type="text" name="city" required/>
                            </div>
                            <div>
                                <label htmlFor="state">State</label>
                                <input id="state" type="text" name="state" required/>
                            </div>
                            <div>
                                <label htmlFor="postalCode">Postal Code</label>
                                <input id="postalCode" type="text" name="postalCode" required/>
                            </div>
                            <div>
                                <label htmlFor="country">Country</label>
                                <input id="country" type="text" name="country" required/>
                            </div>
                            <CardElement className="card"/>
                            <button type="submit" disabled={!stripe || isLoading || createOrderLoading}>PAY</button>
                        </form>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    .title {
        text-align: center;
        border-bottom: 1px solid black;
    }
    .product {
        outline: 1px solid black;
        margin: 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
    }
    .price-box {
        background-color: lightgray;
        padding: 1rem;
        .total {
            border-top: 1px solid black;
            margin-top: 0.25rem;
        }
    }
    .product-image {
        outline: 1px solid black;
        width: 5rem;
        height: 5rem;
    }
    .payment-box {
        margin: 1rem 0;
    }
    form {
        margin: 0 auto;
        background-color: white;
        border: 1px solid black;
        padding: 1rem;
        label {
            display: block;
            margin-top: 0.5rem;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid rgb(204, 204, 204);
            border-radius: 0.25rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            background-color: white;
        }
    }
    button {
        margin-top: 1rem;
        padding: 0.25rem;
        width: 100%;
    }
    .card {
        display: block;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 1rem;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 0.25rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: white;
    }
`;

export default Checkout;