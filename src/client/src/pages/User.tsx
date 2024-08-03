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
                    <div className="pad20 pageHeader"><h1 className="tCenter">{singleUser!.name}</h1><p className="tCenter">Joined: {moment(singleUser!.createdAt).format('MMMM Do YYYY')}</p></div>
                    <div className="user-container user-orders">
                        

                        <img className="user-image" src={singleUser!.profilePicture || emptyProfilePicture} alt={singleUser!.name}/>
                        
                        
                        <div className="row flexFull">
                            <div className="user-info flexFull">
                                <div className="user-infoInner">
                                    Email: <span>{singleUser!.email}</span>
                                </div>
                            </div>
                            <div className="user-info flexFull">
                                <div className="user-infoInner">
                                    Phone Number: <span>{(String(singleUser!.phoneNumber)).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</span>
                                </div>
                            </div>
                            
                            <div className="user-info flexFull">
                                <div className="user-infoInner">
                                    Number of Orders: <span>{singleUser!.orders.length}</span>
                                </div>
                            </div>
                            
                            <div className="user-info flexFull">
                                <div className="user-infoInner">Total Profit: <span>
                                    {
                                        (singleUser!.orders.reduce((totalProfit, item) => {
                                            return totalProfit + item.total;
                                        }, 0) / 100).toFixed(2)
                                    }
                                    </span>
                                </div>
                            </div >
                            
                        </div>
                        

                    </div>
                
                    
           
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding:20px;
    .user-infoInner {

    }
    .pageHeader {
        border-top:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
        h1 {
            text-transform:capitalize;
        }
    }
    .user-container {
        .user-image {
            width: 200px;
            height: 200px;
            display: block;
            margin: auto;
            margin: 50px auto;
            object-fit: contain;
        }
        .user-info {
            display:flex;
            flex-direction:row;
            font-weight:600;
            padding:0px 10px;
        }
        .user-infoInner {
            padding:20px;
            flex:1;
            display:flex;
            flex-direction:column;
            border:1px solid #eeeeee;
        }
        span {
            font-size:18px;
            font-weight:400;
            margin-top: 5px;
        }
    }
`;

export default User;