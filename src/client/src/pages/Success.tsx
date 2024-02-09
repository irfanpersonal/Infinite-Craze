import React from 'react';
import {useSelector} from 'react-redux';
import {type useSelectorType} from '../store';
import {Link, useNavigate} from 'react-router-dom';

const Success: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const {successfulOrder} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        if (!successfulOrder) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <h1>Thank you for your purchase!</h1>
            <Link to='/'>Go Home</Link>
        </div>
    );
}

export default Success;