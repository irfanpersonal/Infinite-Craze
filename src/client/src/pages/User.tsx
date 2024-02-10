import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useParams, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading} from '../components';
import {getSingleUser} from '../features/singleUser/singleUserThunk';
import moment from 'moment';

const User: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {singleUser, singleUserLoading} = useSelector((store: useSelectorType) => store.singleUser);
    React.useEffect(() => {
        dispatch(getSingleUser(id!));
    }, []);
    console.log(singleUser);
    return (
        <Wrapper>
            {singleUserLoading ? (
                <Loading title="Loading Single User" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div className="user-container">
                        <Link className="user-link" to='/user'>Back to Users</Link>
                        <img className="user-image" src={singleUser!.profilePicture || emptyProfilePicture} alt={singleUser!.name}/>
                        <div className="user-info">Name: {singleUser!.name}</div>
                        <div className="user-info">Joined: {moment(singleUser!.createdAt).format('MMMM Do YYYY')}</div>
                        <div className="user-info">Email: {singleUser!.email}</div>
                        <div className="user-info">Phone Number: {(String(singleUser!.phoneNumber)).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</div>
                    </div>
                    <div className="user-orders">
                        <div className="user-info">Number of Orders: {singleUser!.orders.length}</div>
                        <div className="user-info">Total Profit: <span>
                            {
                                (singleUser!.orders.reduce((totalProfit, item) => {
                                    return totalProfit + item.total;
                                }, 0) / 100).toFixed(2)
                            }
                            </span>
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    text-align: center;
    .user-info {
        margin: 1rem 0;
    }
    .user-container {
        .user-image {
            width: 5rem;
            height: 5rem;
            outline: 1px solid black;
        }
        .user-link {
            display: block;
            background-color: lightgray;
            padding: 0.5rem;
            margin-bottom: 1rem;
            text-decoration: none;
            color: black;
        }
        .user-link:active, .user-link:hover {
            outline: 1px solid black;
        }
        .user-orders {
            width: 50%;
            outline: 1px solid black;
            padding: 1rem;
        }
    }
`;

export default User;