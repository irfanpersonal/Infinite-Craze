import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {toggleAuthType} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {RegisterBox, LoginBox} from '../components';
import {useNavigate} from 'react-router-dom';
import banner from '../images/banner.jpg';

const Auth: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {wantsToRegister, user, authLoading} = useSelector((store: useSelectorType) => store.user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            formData.append('dateOfBirth', (target.elements.namedItem('dateOfBirth') as HTMLInputElement).value);
            formData.append('phoneNumber', (target.elements.namedItem('phoneNumber') as HTMLInputElement).value);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    return (
        <Wrapper className="accountScreen">
            <div className="half column aCenter jCenter">
                <form onSubmit={handleSubmit}>
                    
                    <h1>{wantsToRegister ? 'Register' : 'Login'}</h1>
                    {wantsToRegister ? (
                        <RegisterBox/>
                    ) : (
                        <LoginBox/>
                    )}
                    <p onClick={() => dispatch(toggleAuthType())}>{wantsToRegister ? 'Already have an account?' : `Don't have an account?`}</p>
                    <button className="mainButton" type="submit" disabled={authLoading}>{authLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
                </form>
            </div>
            <div className="half bgElement" style={{backgroundImage: `url(${banner})`,backgroundSize:'cover',}}>

            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    h1 {
        text-align: center;
    }
    form {
        width: 50%;
        padding: 1rem;
        label {
            display: block;
            margin-top: 20px;
            margin-bottom:10px;
        }
        input, button {
            width: 100%;
        }
        p {
            margin: 1rem 0;
            text-align: center;
        }
    }
    p {
        cursor: pointer;
    }
    p:hover, p:active {
        color: gray;
    }
`;

export default Auth;