import {type UserType} from '../features/user/userSlice';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {useSelectorType, type useDispatchType} from '../store';
import {editProfile} from '../features/profile/profileThunk';

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
        <form onSubmit={handleSubmit}>
            <div>
                <div style={{textAlign: 'center', marginBottom: '0.25rem'}}>Current Image</div>
                <img style={{display: 'block', margin: '0 auto', width: '5rem', height: '5rem', borderRadius: '50%', outline: '1px solid black', marginBottom: '0.5rem'}} src={data.profilePicture || emptyProfilePicture} alt={data.name}/>
            </div>
            <div>
                <label htmlFor="profilePicture">Profile Picture</label>
                <input style={{padding: '0'}} id="profilePicture" type="file" name="profilePicture"/>
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
            <button type="submit" disabled={editProfileLoading}>{editProfileLoading ? 'Editing' : 'Edit'}</button>
        </form>
    );
}

export default EditProfile;