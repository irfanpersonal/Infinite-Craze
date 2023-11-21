import React from 'react';
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

const SuccessOrder = () => {
    const navigate = useNavigate();
    const {isSuccessful} = useSelector(store => store.cart);
    React.useEffect(() => {
        if (!isSuccessful) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <h1 style={{textAlign: 'center', marginBottom: '1rem'}}>Thank you</h1>
            <p style={{textAlign: 'center', marginBottom: '1rem'}}>Your purchase was successful, please come again!</p>
            <Link style={{display: 'block', padding: '0.5rem', backgroundColor: 'lightcoral', textAlign: 'center', textDecoration: 'none', color: 'black'}} to='/orders'>Go to Orders</Link>
        </div>
    );
}

export default SuccessOrder;