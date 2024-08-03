import {type UserType} from '../features/user/userSlice';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {useSelectorType, type useDispatchType} from '../store';
import {editProfile} from '../features/profile/profileThunk';
import styled from 'styled-components';

interface EditProfileProps {
    data: UserType
}

const EditProfile: React.FunctionComponent<EditProfileProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {editProfileLoading} = useSelector((store: useSelectorType) => store.profile);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.profilePicture.files[0]) {
            formData.append('profilePicture', target.profilePicture.files[0]);
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('dateOfBirth', (target.elements.namedItem('dateOfBirth') as HTMLInputElement).value);
        formData.append('phoneNumber', (target.elements.namedItem('phoneNumber') as HTMLInputElement).value);
        dispatch(editProfile(formData));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="column aCenter">
                    <img className="profilePhoto" src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
                </div>
                <div>
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input style={{}} id="profilePicture" type="file" name="profilePicture"/>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name" defaultValue={data.name} required/>
                </div>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" name="email" defaultValue={data.email} required/>
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input id="dateOfBirth" type="date" name="dateOfBirth" defaultValue={moment(data.dateOfBirth).utc().format('YYYY-MM-DD')} required/>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input id="phoneNumber" type="tel" name="phoneNumber" defaultValue={data.phoneNumber} required/>
                </div>
                <button className="darkButton" type="submit" disabled={editProfileLoading}>{editProfileLoading ? 'Editing' : 'Edit'}</button>
            </form>
        </Wrapper>
    );
}


const Wrapper = styled.div`
    padding:40px;
    form {
        margin:auto;
    }
    label {
        margin-top:20px;
        margin-bottom:10px;
    }
    .profilePhoto {
        width:100px;
        height:100px;
        object-fit:cover;
    }
    form input {
        padding:10px;
        border-radius:0px;
    }
    #profilePicture {
        border-width:0px;
        padding: 10px;
        border: 1px solid #eeeeee;
    }
    .darkButton {
        color:#FFFFFF;
        padding:10px;
        border-width:0px;
        background-color:#000000;
    }
`;

export default EditProfile;