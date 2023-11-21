import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import {getAllOrders} from '../features/orders/ordersThunk';
import moment from 'moment';

const Orders = () => {
    const dispatch = useDispatch();
    const {isLoading, orders} = useSelector(store => store.orders);
    React.useEffect(() => {
        dispatch(getAllOrders());
    }, []);
    return (
        <Wrapper>
            <h1 style={{textAlign: 'center', backgroundColor: 'lightblue', border: '1px solid black'}}>Orders</h1>
            {isLoading ? (
                <h1>Loading Orders...</h1>
            ) : (
                <section>
                    {orders.map(order => {
                        const formattedDate = moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')
                        return (
                            <article key={order._id}>
                                <h1>Name: {order.user.name}</h1>
                                <h1>Status: {order.status}</h1>
                                <h1>Subtotal: {order.subTotal / 100}</h1>
                                <h1>Total: {order.total}</h1>
                                <h1>Created: {formattedDate}</h1>
                            </article>
                        );
                    })}
                </section>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    article {
        border: 1px solid black;
        margin: 1rem 0;
        padding: 1rem;
        background-color: lightgray;
    }
`;

export default Orders;