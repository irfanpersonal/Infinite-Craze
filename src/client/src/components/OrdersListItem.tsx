import styled from 'styled-components';
import moment from 'moment';
import {type OrderType} from '../features/orders/ordersSlice';
import ProductViewer from './ProductViewer';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

interface OrderListItemProps {
    data: OrderType
}

const OrdersListItem: React.FunctionComponent<OrderListItemProps> = ({data}) => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            <Link className="center-view" to={`/order/${data._id}`}>
                <ProductViewer data={data}/>
                <div className="order-information">

                    <div></div>
                    

                    <div>
                                    <div className="productMeta">Order #: <span>{data._id}</span></div>
                                    <div className="productMeta">Placed: <span>{moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</span></div>
                                    
                        {user!?.role === 'admin' && (
                            <>
                                
                                
                                    <div className="productMeta" style={{marginTop:'0px',}}>Name: <span> {data.user!?.name}</span></div>
                                    <div className="productMeta">Number: <span> {data.user!?.phoneNumber}</span></div>
 
                                    <div className="productMeta">Email: <span> {data.user!?.email}</span></div>
                                    
                                    

                                
                            </>
                        )}
                    </div>

                    <div className="lightButton">View Details</div>


                    
                    
                </div>
            </Link>

        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding:20px;
    border-right:1px solid #eeeeee;
    border-bottom:1px solid #eeeeee;
    .center {
        text-align: center;
    }
    .bottom-space {
        margin-bottom: 0.5rem;
    }
    .center-view {
        display:flex;
        flex-direction:row;
    }
    &:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
    .order-information {
        flex:1;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
    }
    .order-title {
        background-color: black;
        color: white;
        padding: 0.5rem;
    }
    .link {
        width: 100%;
        text-align: center;
        display: inline-block;
        background-color: gray;
        padding: 0.25rem;
        text-decoration: none;
        color: black;
        margin-top: 0.25rem;
    }
    .link:hover {
        outline: 1px solid black;
    }
    .productMeta {
        display:flex;
        flex-direction:column;
        font-weight:600;
        margin:10px 0px;
    }
    .productMeta span {
        font-weight:400;
    }
    .lightButton {
        color:#000000;
        padding:10px;
        border-width:0px;
        text-align:center;
        background-color:#eeeeee;
    }
`;

export default OrdersListItem;