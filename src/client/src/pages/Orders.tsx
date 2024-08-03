import React from 'react';
import styled from 'styled-components';
import {Loading, SearchOrdersBox, OrdersList, PaginationBox} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getAllOrders, getUserSpecificOrders} from '../features/orders/ordersThunk';
import {updateSearchBoxValues, setPage} from '../features/orders/ordersSlice';

const Orders: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {orders, ordersLoading, searchBoxValues, totalOrders, numberOfPages, page} = useSelector((store: useSelectorType) => store.orders);
    React.useEffect(() => {
        if (user!.role === 'admin') {
            dispatch(getAllOrders());
            return;
        }
        if (user!.role === 'user') {
            dispatch(getUserSpecificOrders());
            return;
        }
    }, []);
    const theCorrectMethodToExecute = user!.role === 'admin' ? getAllOrders : user!.role === 'user' ? getUserSpecificOrders : Function;
    return (
        <Wrapper>
            <div className="pad20 pageHeader">
                <h1 className="tCenter">Orders</h1>
                <p className="tCenter">View a list of your orders.</p>
            </div>
            
            <SearchOrdersBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={theCorrectMethodToExecute} setPage={setPage} ordersLoading={ordersLoading} role={user!.role}/>
            {ordersLoading ? (
                <Loading title="Loading All Orders" position='normal' marginTop="1rem"/>
            ) : (
                <>
                    <OrdersList data={orders} totalOrders={totalOrders!}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={theCorrectMethodToExecute}/>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .pageHeader {
        border-top:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
    }
`;

export default Orders;