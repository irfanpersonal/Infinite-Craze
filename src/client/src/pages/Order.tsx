import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {deleteSingleOrder, getSingleOrder} from '../features/singleOrder/singleOrderThunk';
import {useParams, Link} from 'react-router-dom';
import {Loading, EditOrder} from '../components';
import {MdPaid, MdLockClock, MdFireTruck, MdCheckBox} from "react-icons/md";
import {FaArrowAltCircleLeft, FaEdit, FaTrash} from "react-icons/fa";
import {IoMdCloseCircle} from "react-icons/io";

const Order: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {singleOrder, singleOrderLoading} = useSelector((store: useSelectorType) => store.singleOrder);
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleEdit = () => {
        setIsEditing(currentState => {
            return !currentState;
        });
    }
    React.useEffect(() => {
        dispatch(getSingleOrder(id!));
    }, []);
    console.log(singleOrder);
    return (
        <Wrapper>
            {singleOrderLoading ? (
                <Loading title="Loading Single Order" position='normal' marginTop='1rem'/>
            ) : (
                <div>
                    <div className="order-navigation">
                        <div>
                            <Link to={`/order`} style={{cursor: 'pointer', color: 'white'}}><FaArrowAltCircleLeft/></Link>
                        </div>
                        <div>
                            <div>Viewing Single Order</div>
                        </div>
                        <div className="order-actions">
                            {user!.role === 'admin' && (
                                <>
                                    <div className="edit" onClick={toggleEdit}>{isEditing ? <IoMdCloseCircle className="trash"/> : <FaEdit/>}</div>
                                    <div className="trash" onClick={() => {
                                        dispatch(deleteSingleOrder(id!));
                                    }}><FaTrash/></div>
                                </>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <EditOrder singleOrder={singleOrder!}/>
                    ) : (
                        <>
                            <div className="order-section">
                                <div className="info">
                                    <div className="title">Order Information</div>
                                    <div className="order-info">Time placed: {moment(singleOrder!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                    <div className="order-info">Order number: {singleOrder!._id} ({singleOrder!.items.length} Item{singleOrder!.items.length > 1 && 's'})</div>
                                    <div className="order-info">Total: ${singleOrder!.total / 100}</div>
                                    <div>
                                        <div className="center underline bottom-space">Status</div>
                                        <div className="icons">
                                            <div className={`icon ${singleOrder!.status === 'paid' && 'current-status'}`}>
                                                <div><MdPaid/></div>
                                                <div>Paid</div>
                                            </div>
                                            <div className={`icon ${singleOrder!.status === 'preparing' && 'current-status'}`}>
                                                <div><MdLockClock/></div>
                                                <div>Preparing</div>
                                            </div>
                                            <div className={`icon ${singleOrder!.status === 'shipped' && 'current-status'}`}>
                                                <div><MdFireTruck/></div>
                                                <div>Shipped</div>
                                            </div>
                                            <div className={`icon ${singleOrder!.status === 'delivered' && 'current-status'}`}>
                                                <div><MdCheckBox/></div>
                                                <div>Delivered</div>
                                            </div>
                                        </div>
                                        <div className="message"><span className="underline">Message {user!?.role === 'admin' ? ('to Customer') : ('from Seller')}</span> {singleOrder!.message}</div>
                                    </div>
                                </div>
                                <div className="shipping">
                                    <div className="title">Shipping Information</div>
                                    <div className="shipping-info">Address: {singleOrder!.address}</div>
                                    <div className="shipping-info">City: {singleOrder!.city}</div>
                                    <div className="shipping-info">State: {singleOrder!.state}</div>
                                    <div className="shipping-info">Country: {singleOrder!.country}</div>
                                    <div className="shipping-info">Postal Code: {singleOrder!.postalCode}</div>
                                </div>
                                <div className="item">
                                    <div className="title">Item Information</div>
                                    {/* Product is null */}
                                    {singleOrder!.items.map(order => {
                                        const {amount, color, condition, product} = order;
                                        return (
                                            <div className="product" key={nanoid()}>
                                                <div style={{position: 'relative'}}>
                                                    <img className="product-image" src={product?.image || emptyProductImage} alt={product?.name || 'Product Deleted'}/>
                                                    {product && (
                                                        <div className="product-amount">{amount}</div>
                                                    )}
                                                </div>
                                                <div className="center">
                                                    {product && (
                                                        <>
                                                            <div><Link style={{color: 'black'}} to={`/product/${product?._id}`}>{product?.name}</Link></div>
                                                            <div className="underline">${product?.price / 100}</div>
                                                            <div>{product?._id}</div>
                                                        </>
                                                    )}
                                                    {!product && (
                                                        <div>Product Deleted</div>
                                                    )}
                                                </div>
                                                <div>
                                                    {product && (
                                                        <>
                                                            <div>Color: {color}</div>
                                                            <div>Condition: {condition}</div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="payment">
                                    <div className="title">Payment Information</div>
                                    <div className="payment-box">
                                        <div className="payment-info">
                                            <div>{singleOrder!.items.length} item{singleOrder!.items.length > 1 && 's'}</div>
                                            <div>${singleOrder!.subTotal / 100}</div>
                                        </div>
                                        <div className="payment-info">
                                            <div>Shipping</div>
                                            <div>${singleOrder!.shippingFee / 100}</div>
                                        </div>
                                        <div className="payment-info">
                                            <div>Tax</div>
                                            <div>${singleOrder!.tax / 100}</div>
                                        </div>
                                        <div className="payment-info order-total">
                                            <div>Order total</div>
                                            <div>${singleOrder!.total / 100}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .order-navigation {
        padding: 0.5rem;
        margin: 0 1rem;
        margin-top: 1rem;
        background-color: black;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .order-actions {
        display: flex;
        div {
            margin-left: 1rem;
        }
    }
    .center {
        text-align: center;
    }
    .underline {
        border-bottom: 1px solid black;
    }
    .bottom-space {
        margin-bottom: 0.25rem;
    }
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    .order-section {
        margin: 1rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 1rem;
    }
    .order-info {
        margin-top: 0.5rem;
    }
    .info, .shipping, .item, .payment {
        outline: 1px solid black;
        padding: 1rem;
    }
    .shipping {
        .shipping-info {
            margin: 1rem 0;
        }
    }
    .icons {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon {
            text-align: center;
        }
    }
    .message {
        margin-top: 1rem;
        background-color: aliceblue;
        outline: 1px solid black;
        padding: 0.5rem;
    }
    .product {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin: 0.25rem 0;
    }
    .product-image {
        outline: 1px solid black;
        width: 5rem;
        height: 5rem;
    }
    .product-amount {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: white;
        padding: 0.25rem;
        outline: 1px solid black;
    }
    .current-status {
        color: green;
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
    .payment-box {
        background-color: lightgray;
        padding: 0.5rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
    }
    .payment-info {
        margin: 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .order-total {
        border-top: 1px solid black;
        padding-top: 0.25rem;
    }
`;

export default Order;