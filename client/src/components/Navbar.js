import React from 'react';
import styled from 'styled-components';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../features/user/userThunk';
import {FaRegUserCircle} from "react-icons/fa";

const Navbar = () => {  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    return (
        <Wrapper>
            <h1>Infinite Craze</h1>
            <div>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/about'>About</NavLink>
                <NavLink to='/products'>Products</NavLink>
                {user?.role === 'user' && (
                    <NavLink to='/orders'>Orders</NavLink>
                )}
                {user?.role !== 'admin' && (
                    <NavLink to='/cart'>Cart</NavLink>
                )}
                {user?.role === 'admin' && (
                    <NavLink to='/admin'>Admin</NavLink>
                )}
            </div>
            <div className="container">
                <Link to='/auth' style={{display: user ? 'none' : 'block'}}>Register/Login</Link>
                {user && (
                    <>
                        <Link to='/profile' className="user-name"><FaRegUserCircle/> {user?.name}</Link>
                        <button onClick={() => {
                            dispatch(logoutUser());
                            navigate('/');
                        }}>Logout</button>
                    </>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    background-color: lightgray;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
        margin-left: 1rem;
        text-decoration: none;
        color: black;
    }
    .active {
        border-bottom: 1px solid black;
    }
    .container {
        display: flex;
        align-items: center;
    }
    button {
        margin-left: 1rem;
        padding: 0 2rem;
        border-radius: 5px;
        background-color: transparent;
        color: black;
        font-size: 1rem;
        cursor: pointer;
    }
    .user-name {
        border: 1px solid rgb(52, 152, 219);
        border-radius: 3rem;
        padding: 0 2rem;
        margin-left: 1rem;
    }
`;

export default Navbar;