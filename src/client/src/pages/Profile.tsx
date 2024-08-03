import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ProfileData, EditProfile, ChangePassword, DeleteAccount} from '../components';
import {getProfileData} from '../features/profile/profileThunk';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {profileDataLoading, profileData} = useSelector((store: useSelectorType) => store.profile);
    const [view, setView] = React.useState<number>(1);
    React.useEffect(() => {
        dispatch(getProfileData(user!.userID));
    }, []);
    return (
        <Wrapper>
            <div className="profile-container">
                <div className="option-container">
                    <div className="optionItem" style={{borderBottomColor: view === 1 ? '#000000' : '',fontWeight: view === 1 ? '600' : '',}} onClick={() => setView(currentState => 1)}>User Information</div>
                    <div className="optionItem" style={{borderBottomColor: view === 2 ? '#000000' : '',fontWeight: view === 2 ? '600' : '',}} onClick={() => setView(currentState => 2)}>Edit Profile</div>
                    <div className="optionItem" style={{borderBottomColor: view === 3 ? '#000000' : '',fontWeight: view === 3 ? '600' : '',}} onClick={() => setView(currentState => 3)}>Change Password</div>
                    {user!.role === 'user' && (
                        <div className="optionItem" style={{borderBottomColor: view === 4 ? '#000000' : ''}} onClick={() => setView(currentState => 4)}>Delete Account</div>
                    )}
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
    flex:1;
    display:flex;
    flex-direction:column;
    .pageHeader {
        padding-bottom:40px;
        border-top:1px solid #eeeeee;
    }
    .profile-container {
        flex:1;
        display: flex;
        flex-direction:column;
    }
    .option-container {
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:center;
        border-bottom:1px solid #eeeeee;
        .optionItem {
            padding:10px 30px;
            cursor: pointer;
            border-bottom:1px solid #FFFFFF;
        }
    }
    .content-container {
        width:500px;
        max-width:100%;
        margin: 0px auto;
    }
    form {
        label {
            display: block;
        }
        button {
            margin-top: 1rem;
        }
        input, button {
            width: 100%;
        }
    }
`;

export default Profile;