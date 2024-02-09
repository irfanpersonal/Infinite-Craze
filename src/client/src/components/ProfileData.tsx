import {type UserType} from '../features/user/userSlice';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {FaUser} from "react-icons/fa";
import {MdAdminPanelSettings} from "react-icons/md";

interface ProfileDataProps {
    data: UserType
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({data}) => {
    return (
        <div>
            <img style={{display: 'block', margin: '0 auto', width: '5rem', height: '5rem', borderRadius: '50%', outline: '1px solid black'}} src={data.profilePicture || emptyProfilePicture}/>
            <h1 style={{textAlign: 'center'}}>{data.name} {data.role === 'user' ? <FaUser title="User"/> : <MdAdminPanelSettings title="Admin"/>}</h1>
            <h1 style={{textAlign: 'center'}}>Joined: {moment(data.createdAt).format('MMMM Do YYYY')}</h1>
        </div>
    );
}

export default ProfileData;