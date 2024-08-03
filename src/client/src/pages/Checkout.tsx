import React, { useRef } from 'react';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from "react-redux";
import { type useDispatchType, type useSelectorType } from '../store';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { createOrder } from '../features/orders/ordersThunk';
import { clearCart } from '../features/cart/cartSlice';

const Checkout: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const { items } = useSelector((store: useSelectorType) => store.cart);
    const { paymentIntentData, user, successfulOrder } = useSelector((store: useSelectorType) => store.user);
    const { createOrderLoading } = useSelector((store: useSelectorType) => store.orders);
    const [isPageLoading, setIsPageLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(paymentIntentData!.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!
            }
        });
        if (result.error) {
            setIsLoading(false);
            toast.error('Please enter all the information in correctly!');
        } else {
            setIsLoading(false);
            const createOrderData = { ...paymentIntentData };
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
    };

    React.useEffect(() => {
        if (!paymentIntentData) {
            navigate('/cart');
        }
        if (paymentIntentData) {
            setIsPageLoading(false);
        }
    }, [navigate, paymentIntentData]);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    };

    return (
        <Wrapper>
            {isPageLoading ? (
                <Loading title="Loading Checkout Page" position='normal' marginTop='1rem' />
            ) : (
                <>
                    <div className="column aCenter pad50 pageHeader">
                        <h1 className="">Checkout</h1>
                        <p className="">Welcome {user!.name} to the checkout page!</p>
                    </div>

                    <div className="checkout">
                        <div className="checkoutMain">
                            <form ref={formRef} className="checkoutMainItem" onSubmit={handleSubmit}>
                                <p>Shipping Information</p>
                                <div>
                                    <label htmlFor="address">Address</label>
                                    <input placeholder="Street Address" id="address" type="text" name="address" required />
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <input placeholder="City" id="city" type="text" name="city" required />
                                </div>
                                <div>
                                    <label htmlFor="state">State</label>
                                    <input placeholder="State" id="state" type="text" name="state" required />
                                </div>
                                <div>
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input placeholder="Postal Code" id="postalCode" type="text" name="postalCode" required />
                                </div>
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <input placeholder="Country" id="country" type="text" name="country" required />
                                </div>
                            </form>

                            <div className="checkoutMainItem">
                                <p>Billing Information</p>
                                <CardElement className="" />
                            </div>
                        </div>
                        <div className="cartFooter">
                            <div className="cartItems">
                                {items.map(item => {
                                    return (
                                        <div className="product" key={nanoid()}>
                                            <img className="product-image" src={item.product.image} alt={item.product.name} />

                                            <div className="column">
                                                <div className="f14 fw600">{item.product.name}</div>
                                                <div className="f12">${item.product.price / 100} {'x'} {item.amount}</div>
                                                <div style={{ display: 'none', }}>{item.condition}</div>
                                                <div style={{ display: 'none', }}>{item.color}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="cartInformation">
                                <div className="subtotal">Subtotal: <span>${paymentIntentData!.subTotal / 100}</span></div>
                                <div className="subtotal">Shipping Cost: <span>${paymentIntentData!.shippingFee / 100}</span></div>
                                <div className="subtotal">Tax: <span>${paymentIntentData!.tax / 100}</span></div>
                                <div className="subtotal">Total: <span>${paymentIntentData!.total / 100}</span></div>

                                <button className="cartAction" onClick={handleExternalSubmit} disabled={!stripe || isLoading || createOrderLoading}>PAY</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .title {
        text-align: center;
        border-bottom: 1px solid black;
    }
    .pageHeader {
        border-top:1px solid #eeeeee;
    }
    .checkout {
        width:50%;
        margin:auto;
        display:flex;
        flex-direction:row;
        align-items:flex-start;
    }
    .checkoutMain {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .checkoutMain .checkoutMainItem {
        margin:10px;
        padding:20px;
        border:1px solid #eeeeee;
    }
    .checkoutMain .checkoutMainItem p {
        font-weight:600;
        margin-bottom:20px;
    }
    .checkoutMain .checkoutMainItem div {
        display:flex;
        flex-direction:column;
    }
    .checkoutMain .checkoutMainItem label {
        margin-top:10px;
        margin-bottom:10px;
    }
    .cartItems {
        margin: 10px;
        padding:10px;
        border:1px solid #eeeeee;
    }
    .cartInformation {
        margin: 10px;
        padding:20px;
        border:1px solid #eeeeee;
    }
    .cartInformation div {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom:10px;
        justify-content: space-between;
    }
    .cartInformation .cartAction {
        display:flex;
        width:100%;
        padding:10px;
        color:#FFFFFF;
        align-items:center;
        justify-content:center;
        text-align:center;
        font-weight: 400;
        font-size:14px;
        border-width:0px;
        background-color:#000000;
    }
    .card.StripeElement {
        margin-bottom:0px;
    }
    .product {
        padding:10px;
        display:flex;
        flex-direction:row;
        align-items:center;
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
        width:30px;
        height:30px;
        object-fit:contain;
        margin-right:10px;
    }
    .payment-box {
        margin: 1rem 0;
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
