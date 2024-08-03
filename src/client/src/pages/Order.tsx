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
import {FaArrowLeft, FaRegTrashCan, FaPenToSquare, FaPlus} from 'react-icons/fa6';

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
                <div className="column">


                    <div className="pageHeader">
                            <div className="row aCenter jSpaceBetween flexFull" style={{width:'100%',}}>
                                <Link className="row aCenter" to={`/order`} style={{cursor: 'pointer'}}><FaArrowLeft/> <span style={{marginLeft:'5px',}}>Back</span></Link>
                                <h1>Order Details</h1>
                                <div className="rightBalanceActions">
                                {user!.role === 'admin' && (
                                    <>
                                        <div className="orderAdminActionItem" onClick={toggleEdit}>{isEditing ? <div className="row"><FaPlus className="rotateX" /></div> : <FaPenToSquare/>}</div>
                                        <div className="" onClick={() => {
                                            dispatch(deleteSingleOrder(id!));
                                        }}><FaRegTrashCan/></div>
                                    </>
                                )}
                                </div>
                            </div>
                            
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
                            
                   
                    </div>


                    {isEditing ? (
                        <EditOrder singleOrder={singleOrder!}/>
                    ) : (
                        <>
                            <div className="order-section">
                                <div className="info">
                                    <div className="column flexFull">
                                        <div className="title">Order Information</div>
                                        <div className="order-info">Time placed: {moment(singleOrder!.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                        <div className="order-info">Order number: {singleOrder!._id} ({singleOrder!.items.length} Item{singleOrder!.items.length > 1 && 's'})</div>
                                        <div className="order-info">Total: ${singleOrder!.total / 100}</div>

                                    </div>
                                    <div>
                                    
                                
                                        <div className="message"><span className="underline">Message {user!?.role === 'admin' ? ('to Customer') : ('from Seller')}</span> {singleOrder!.message}</div>
                                    </div>
                                </div>
                                <div className="shipping">
                                    <div className="title">Shipping Information</div>
                                    <div className="shipping-info"><div>Address:</div> <span>{singleOrder!.address}</span></div>
                                    <div className="shipping-info"><div>City:</div> <span>{singleOrder!.city}</span></div>
                                    <div className="shipping-info"><div>State:</div> <span>{singleOrder!.state}</span></div>
                                    <div className="shipping-info"><div>Country:</div> <span>{singleOrder!.country}</span></div>
                                    <div className="shipping-info lastItem"><div>Postal Code:</div> <span>{singleOrder!.postalCode}</span></div>
                                </div>
                                <div className="item">
                                    <div className="title">Item Information</div>
                                    {/* Product is null */}
                                    {singleOrder!.items.map(order => {
                                        const {amount, color, condition, product} = order;
                                        return (
                                            <div className="product" key={nanoid()}>
                                                
                                                    <img className="product-image" src={product?.image || emptyProductImage} alt={product?.name || 'Product Deleted'}/>
                                                    
                                                
                                                <div className="productInner">
                                                    <div className="center">
                                                        {product && (
                                                            <>
                                                                <div><Link style={{color: 'black',fontWeight:'600',}} to={`/product/${product?._id}`}>{product?.name} <span className="fw400">{'(' + product?._id + ')'}</span></Link></div>

                                                                <div className="">
                                                                    ${product?.price / 100}
                                                                    {product && (
                                                                        <span className="product-amount">{' x '} {amount}</span>
                                                                    )}
                                                                </div>
                                                                
                                                            </>
                                                        )}
                                                        {!product && (
                                                            <div>Product Deleted</div>
                                                        )}
                                                    </div>
                                                    <div className="row specList">
                                                        {product && (
                                                            <>
                                                                <div>Color: {color}</div>
                                                                <div>Condition: {condition}</div>
                                                            </>
                                                        )}
                                                    </div>
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
    .pageHeader {
        display:flex;
        flex-direction:column;
        align-items:center;
        border-top:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
        padding:20px 20px 0px 20px;
    }
    .pageHeader .icons {
        padding-top:10px;
    }
    .pageHeader .icons .icon {
        padding:10px 30px;
    }
    .pageHeader .icons .icon.current-status {
        border-bottom:1px solid #000000;
    }
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
    .underline {
        border-bottom: 1px solid black;
    }
    .bottom-space {
        margin-bottom: 0.25rem;
    }
    .title {
        padding: 20px;
        font-size: 24px;
        font-weight: 600;
        margin-bottom:10px;
        background-color: #eeeeee;
    }
    .order-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
    .order-info {
        margin-top: 0.5rem;
    }
    .info, .shipping, .item, .payment {
        padding:20px;
        display:flex;
        flex-direction:column;
        border-right:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
    }
    .shipping {
        .shipping-info {
            display:flex;
            margin:10px 0px;
            flex-direction:column;
            padding-bottom:20px;
            border-bottom:1px solid #eeeeee;
        }
        .shipping-info div {
            
        }
        .shipping-info span {
            font-weight:600;
            margin-top:10px;
        }
        .shipping-info.lastItem {
            padding-bottom:0px;
            margin-bottom:0px;
            border-bottom-width:0px;
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
        filter:invert(1);
        padding:20px;
        border:0px solid #eeeeee;
        background-color:#FFFFFF;
    }
    .product {
        display: flex;
        flex-direction:row;
        align-items:center;
        padding:15px 0px;
        border-bottom:1px solid #eeeeee;
    }
    .productInner {
        flex:1;
        display:flex;
        flex-direction:column;
    }
    .product-image {
        width:50px;
        height:50px;
        margin-right:20px;
        object-fit:contain;
    }
    .product-amount {
        
    }
    .product .center {
        flex:1;
        display:flex;
        flex-direction:column;
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
        
    }
    .payment-info {
        margin: 1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .order-total {
        font-weight:600;
        padding-top:15px;
        border-top: 1px solid #eeeeee;
    }
    .rightBalanceActions {
        width:60px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .rotateX {
        transform:rotate(45deg);
    }
    .orderAdminActionItem {
        cursor:pointer;
    }
    .specList div {
        font-size:12px;
        padding:5px 10px;
        background-color:#EEEEEE;
        margin-right:10px;
    }
`;

export default Order;