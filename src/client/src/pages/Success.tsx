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
        <div className="column flexFull">
            <div className="column aCenter pad50 pageHeader" style={{borderTop:'1px solid #eeeeee',borderBottom:'1px solid #eeeeee',}}>
                <h1 className="">Success</h1>
                <p>Your purchase was successful!</p>
                <div style={{marginTop: '1rem', fontSize: '2rem'}}>🎉</div>
                <Link to='/' style={{backgroundColor:'#000000',color:'#FFFFFF',padding:'10px 30px',marginTop:'20px', fontSize:'14px',}}>Go Home</Link>
            </div>
        </div>
    );
}

export default Success;