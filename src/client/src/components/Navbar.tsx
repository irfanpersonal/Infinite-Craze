import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

const Navbar: React.FunctionComponent = () => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            <div>Infinite Craze</div>
            <div>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/product'>Products</NavLink>
                {(user!?.role === 'admin' || user!?.role === 'user') && (
                    <>
                        <NavLink to='/order'>Orders</NavLink>
                    </>
                )}
                {(user!?.role === 'user' || user!?.role === undefined) && (
                    <NavLink to='/cart'>Cart</NavLink>
                )}
                {(user!?.role === 'admin') && (
                    <>
                        <NavLink to='/user'>Users</NavLink>
                        <NavLink to='/stats'>Stats</NavLink>
                    </>
                )}
            </div>
            <div>
                {(user!?.role === 'user' || user!?.role === 'admin') && (
                    <NavLink to='/profile'>Profile</NavLink>
                )}
                {(user!?.role === undefined) && (
                    <NavLink to='/auth'>Register/Login</NavLink>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    padding: 1rem;
    background-color: rgb(255, 246, 246);
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
    a {
        text-decoration: none;
        color: black;
        margin-right: 0.5rem;
    }
    .active {
        border-bottom: 1px solid black;
    }
`;

export default Navbar;