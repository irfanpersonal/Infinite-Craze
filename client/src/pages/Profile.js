import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from 'styled-components';
import {toggleIsUpdatingPassword} from "../features/user/userSlice";
import {updateUser, updateUserPassword} from '../features/user/userThunk';

const Profile = () => {
    const dispatch = useDispatch();
    const {isUpdatingPassword, user, profileLoading} = useSelector(store => store.user);
    const [input, setInput] = React.useState({
        name: user.name,
        email: user.email,
        oldPassword: '',
        newPassword: ''
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isUpdatingPassword) {   
            dispatch(updateUserPassword({oldPassword: input.oldPassword, newPassword: input.newPassword}));
            return;
        }
        dispatch(updateUser({name: input.name, email: input.email}));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>Profile</h1>
                {isUpdatingPassword ? (
                    <>
                        <div>
                            <label htmlFor="oldPassword">Old Password</label>
                            <input id="oldPassword" type="text" name="oldPassword" value={input.oldPassword} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="newPassword">New Password</label>
                            <input id="newPassword" type="password" name="newPassword" value={input.newPassword} onChange={handleChange}/>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" value={input.name} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" name="email" value={input.email} onChange={handleChange}/>
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="role">Role</label>
                    <input id="role" type="text" name="role" defaultValue={user.role} readOnly style={{backgroundColor: 'lightgray'}}/>
                </div>
                <p onClick={() => dispatch(toggleIsUpdatingPassword())}>{isUpdatingPassword ? 'Content with password?' : 'Update Password'}</p>
                <button>{profileLoading ? 'UPDATING' : 'UPDATE'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        width: 50%;
        border: 1px solid black;
        margin: 0 auto;
        padding: 1rem;
    }
    form > h1 {
        background-color: lightblue;
        text-align: center;
    }
    label {
        margin-top: 1rem;
    }
    input {
        width: 100%;
    }
    label, input {
        display: block;
    }
    input, button {
        padding: 0.5rem;
    }
    form > button {
        display: block;
        width: 100%;
        padding: 0.5rem;
    }
    p {
        width: 50%;
        background-color: lightcoral;
        margin: 1rem auto;
        text-align: center;
        cursor: pointer;
    }
`;

export default Profile;