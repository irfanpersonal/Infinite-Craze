import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';

const Navbar: React.FunctionComponent = () => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    const toggleClass = () => {
        document.body.classList.toggle('menuOpen');
    };
    return (
        <Wrapper>
            <div className="row aCenter jSpaceBetween flexFull pad20">
                <div className="logo">Infinite<span>Craze</span></div>
                <div className="menuCenter">
                    <NavLink className="menuItem" to='/'>Home</NavLink>
                    <NavLink className="menuItem" to='/product'>Products</NavLink>
                    {(user!?.role === 'admin' || user!?.role === 'user') && (
                        <>
                            <NavLink className="menuItem" to='/order'>Orders</NavLink>
                        </>
                    )}
                    {(user!?.role === 'user' || user!?.role === undefined) && (
                        <NavLink className="menuItem" to='/cart'>Cart</NavLink>
                    )}
                    {(user!?.role === 'admin') && (
                        <>
                            <NavLink className="menuItem" to='/user'>Users</NavLink>
                            <NavLink className="menuItem" to='/stats'>Stats</NavLink>
                        </>
                    )}
                </div>
                <div className="menuAccount">
                    {(user!?.role === 'user' || user!?.role === 'admin') && (
                        <NavLink className="headerButton" to='/profile'>Profile</NavLink>
                    )}
                    {(user!?.role === undefined) && (
                        <NavLink className="headerButton" to='/auth'>Register/Login</NavLink>
                    )}
                </div>
                <div className="mobileMenuButton" style={{display:'none',}} onClick={toggleClass}>
                    <div className="mobileMenuButtonLine one"></div>
                    <div className="mobileMenuButtonLine two"></div>
                    <div className="mobileMenuButtonLine three"></div>
                </div>
                <div className="mobileMenu" style={{display:'none',}}>
                    <div className="row aCenter jCenter pad20">
                        <div className="mobileMenuButton" onClick={toggleClass}>
                            <div className="mobileMenuButtonLine one"></div>
                            <div className="mobileMenuButtonLine two"></div>
                            <div className="mobileMenuButtonLine three"></div>
                        </div>
                    </div>
                    <NavLink className="menuItem" to='/' onClick={toggleClass}>Home</NavLink>
                    <NavLink className="menuItem" to='/product' onClick={toggleClass}>Products</NavLink>
                    {(user!?.role === 'admin' || user!?.role === 'user') && (
                        <>
                            <NavLink className="menuItem" to='/order' onClick={toggleClass}>Orders</NavLink>
                        </>
                    )}
                    {(user!?.role === 'user' || user!?.role === undefined) && (
                        <NavLink className="menuItem" to='/cart' onClick={toggleClass}>Cart</NavLink>
                    )}
                    {(user!?.role === 'admin') && (
                        <>
                            <NavLink className="menuItem" to='/user' onClick={toggleClass}>Users</NavLink>
                            <NavLink className="menuItem" to='/stats' onClick={toggleClass}>Stats</NavLink>
                        </>
                    )}
                    {(user!?.role === 'user' || user!?.role === 'admin') && (
                        <NavLink className="headerButton" to='/profile' onClick={toggleClass}>Profile</NavLink>
                    )}
                    {(user!?.role === undefined) && (
                        <NavLink className="headerButton" to='/auth' onClick={toggleClass}>Register/Login</NavLink>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    .logo {
        font-weight: bold;
        font-size: 2rem;
    }
    .logo span {
        color: rgb(119, 67, 219);
    }
    .menuItem {
        margin: 0 1rem;
    }
    .menuItem.active {
        text-decoration: underline;
    }
    .headerButton {
        color: rgb(119, 67, 219);
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border: 1px solid rgb(119, 67, 219);
    }
`;

export default Navbar;