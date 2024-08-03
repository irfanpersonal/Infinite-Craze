import {type UserType} from '../features/user/userSlice';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {FaUser} from "react-icons/fa";
import {MdAdminPanelSettings} from "react-icons/md";
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {logoutUser} from '../features/user/userThunk';

interface ProfileDataProps {
    data: UserType
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {user, logoutLoading} = useSelector((store: useSelectorType) => store.user);
    return (
        <Wrapper>
            <img className="profilePhoto" src={data.profilePicture || emptyProfilePicture}/>
            <div className="pad20">
                <div style={{textAlign: 'center'}}>{data.role === 'user' ? <FaUser title="User"/> : <MdAdminPanelSettings title="Admin"/>} {data.name}</div>
                <div style={{textAlign: 'center'}}>Joined: {moment(data.createdAt).format('MMMM Do YYYY')}</div>
            </div>
            <button className="logout" onClick={() => dispatch(logoutUser())} disabled={logoutLoading}>{logoutLoading ? 'Logging Out...' : 'Logout'}</button>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    flex:1;
    display:flex;
    padding:40px;
    display:flex;
    flex-direction:column;
    align-items:center;
    .profilePhoto {
        width:100px;
        height:100px;
        object-fit:cover;
    }
    .logout {
        color:#FFFFFF;
        border-width:0px;
        padding:5px 30px;
        background-color:#000000;
    }
    .logout:hover {
        background-color: #ec4747a6;
    }
`;

export default ProfileData;