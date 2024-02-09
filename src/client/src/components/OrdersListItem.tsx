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
            <div className="center-view">
                <ProductViewer data={data}/>
                <div className="order-information">
                    <div className="order-title center bottom-space">Order Details</div>
                    <div>Order Number: {data._id}</div>
                    <div>Created At: {moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
                    {user!?.role === 'admin' && (
                        <>
                            <div>Order by: {data.user!?.name}</div>
                            <div>Customer Number: {data.user!?.phoneNumber}</div>
                            <div>Customer Email: {data.user!?.email}</div>
                        </>
                    )}
                    <Link className="link" to={`/order/${data._id}`}>View More Details</Link>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    .center {
        text-align: center;
    }
    .bottom-space {
        margin-bottom: 0.5rem;
    }
    .center-view {
        margin: 0 auto;
    }
    &:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
    }
    .order-information {
        padding: 0.5rem;
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
`;

export default OrdersListItem;