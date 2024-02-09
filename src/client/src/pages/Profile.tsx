import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ProfileData, EditProfile, ChangePassword, DeleteAccount} from '../components';
import {getProfileData} from '../features/profile/profileThunk';
import {logoutUser} from '../features/user/userThunk';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user, logoutLoading} = useSelector((store: useSelectorType) => store.user);
    const {profileDataLoading, profileData} = useSelector((store: useSelectorType) => store.profile);
    const [view, setView] = React.useState(1);
    React.useEffect(() => {
        dispatch(getProfileData(user!.userID));
    }, []);
    return (
        <Wrapper>
            <h1 className="title">Profile</h1>
            <div className="profile-container">
                <div className="option-container">
                    <div style={{backgroundColor: view === 1 ? 'lightgray' : ''}} onClick={() => setView(currentState => 1)}>User Information</div>
                    <div style={{backgroundColor: view === 2 ? 'lightgray' : ''}} onClick={() => setView(currentState => 2)}>Edit Profile</div>
                    <div style={{backgroundColor: view === 3 ? 'lightgray' : ''}} onClick={() => setView(currentState => 3)}>Change Password</div>
                    {user!.role === 'user' && (
                        <div style={{backgroundColor: view === 4 ? 'lightgray' : ''}} onClick={() => setView(currentState => 4)}>Delete Account</div>
                    )}
                    <button style={{backgroundColor: 'white'}} className="logout" onClick={() => dispatch(logoutUser())} disabled={logoutLoading}>{logoutLoading ? 'Logging Out...' : 'Logout'}</button>
                </div>
                <div className="content-container">
                    {profileDataLoading ? (
                        <Loading title="Loading Profile Data" position="normal"/>
                    ) : (
                        <>
                            {view === 1 && (
                                <ProfileData data={profileData!}/>
                            )}
                            {view === 2 && (
                                <EditProfile data={profileData!}/>
                            )}
                            {view === 3 && (
                                <ChangePassword/>
                            )}
                            {view === 4 && (
                                <DeleteAccount/>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    .title {
        text-align: center;
        background-color: black;
        outline: 1px solid black;
        color: white;
        margin-bottom: 1rem;
    }
    .profile-container {
        display: flex;
    }
    .option-container {
        flex-basis: 50%;
        div {
            cursor: pointer;
            outline: 1px solid black;
            padding: 0.25rem;
            border-radius: 0.25rem;
            margin-bottom: 1rem;
            text-align: center;
        }
        div:hover {
            background-color: lightgray;
        }
    }
    .content-container {
        flex-basis: 40%;
        margin: 0 auto;
    }
    form {
        label {
            display: block;
            margin-top: 0.5rem;
        }
        button {
            margin-top: 1rem;
        }
        input, button {
            width: 100%;
            padding: 0.25rem;
        }
    }
    .logout {
        cursor: pointer;
        width: 100%;
        padding: 0.25rem;
        border: none;
        border-radius: 0.25rem;
        outline: 1px solid black;
    }
    .logout:hover {
        background-color: #ec4747a6;
    }
`;

export default Profile;