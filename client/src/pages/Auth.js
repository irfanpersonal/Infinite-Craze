import styled from 'styled-components';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';
import {toggleWantsToRegister} from '../features/user/userSlice';

const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoading, user, wantsToRegister} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        name: '',
        email: '',
        password: ''
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (wantsToRegister) {
            dispatch(registerUser(input))
            return;
        }
        dispatch(loginUser({email: input.email, password: input.password}));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>{wantsToRegister ? 'Register' : 'Login'}</h1>
                {wantsToRegister && (
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name" value={input.name} onChange={handleChange}/>
                    </div>
                )}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" name="email" value={input.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" value={input.password} onChange={handleChange}/>
                </div>
                <p>{wantsToRegister ? `Already have an account?` : `Don't have an account?`} <span onClick={() => dispatch(toggleWantsToRegister())}>{wantsToRegister ? 'LOGIN' : 'REGISTER'}</span></p>
                <button type="submit" disabled={isLoading}>{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: lightgray;
    form {
        width: 50%;
        margin: 0 auto;
        border: 1px solid black;
        background-color: white;
        padding: 1rem;
    }
    input, button {
        display: block;
        width: 100%;
        padding: 0.5rem;
    }
    h1 {
        background-color: lightblue;
        text-align: center;
    }
    label { 
        display: block;
        margin-top: 1rem;
    }   
    button {
        margin-top: 1rem;
    }
    p {
        margin: 1rem 0;
        text-align: center;
    }
    span {
        background-color: lightblue;
        padding: 0.5rem;
        border-radius: 1rem;
    }
`;

export default Auth;