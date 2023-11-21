import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {deleteSingleUser, getAllUsers, getStats} from '../features/admin/adminThunk';

const Admin = () => {
    const dispatch = useDispatch();
    const {isLoading, users, isLoadingStats, stats} = useSelector(store => store.admin);
    React.useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getStats());
    }, []);
    return (
        <Wrapper>
            <h1 style={{textAlign: 'center', backgroundColor: 'lightblue'}}>Admin Dashboard</h1>
            <section>
                {isLoadingStats ? (
                    <h2>Loading All Stats...</h2>
                ) : (
                    <>
                        <h2>Stats</h2>
                        <article style={{backgroundColor: 'lightgray'}}>Total Users: {stats.totalUsers}</article>
                        <article style={{backgroundColor: 'lightyellow'}}>Number of Orders: {stats.numberOfOrders}</article>
                        <article style={{backgroundColor: 'lightgreen'}}>Earnings: ${stats.earnings / 100}</article>
                    </>
                )}
                {isLoading ? (
                    <h2>Loading All Users...</h2>
                ) : (
                    <>
                        <h2>All Users</h2>
                        {users.map(user => {
                            return (
                                <article key={user._id}>
                                    <h3>User Name: {user.name}</h3>
                                    <h3>User Email: {user.email}</h3>
                                    <h3>User Role: {user.role}</h3>
                                    {user.role !== 'admin' && (
                                        <button onClick={() => dispatch(deleteSingleUser(user._id))}>DELETE</button>
                                    )}
                                </article>
                            );
                        })}
                    </>
                )}
            </section>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    article {
        border: 1px solid black;
        margin-bottom: 1rem;
        padding: 1rem;
    }
    article > h3 {
        margin: 1rem 0;
    }
    article > button {
        width: 100%;
        padding: 0.5rem;
    }
`;

export default Admin;