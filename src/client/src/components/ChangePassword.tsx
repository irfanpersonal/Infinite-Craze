import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from '../store';
import {updatePassword} from "../features/profile/profileThunk";

const ChangePassword: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {updatePasswordLoading} = useSelector((store: useSelectorType) => store.profile);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('oldPassword', (target.elements.namedItem('oldPassword') as HTMLInputElement).value);
        formData.append('newPassword', (target.elements.namedItem('newPassword') as HTMLInputElement).value);
        dispatch(updatePassword(formData));
    }
    return (
        <form onSubmit={handleSubmit}>
            <p>Securely update your password by entering your current password along with the desired new password below.</p>
            <div>
                <label htmlFor="oldPassword">Old Password</label>
                <input id="oldPassword" type="password" name="oldPassword"/>
            </div>
            <div>
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" type="password" name="newPassword"/>
            </div>
            <button type="submit" disabled={updatePasswordLoading}>{updatePasswordLoading ? 'Updating' : 'Update'}</button>
        </form>
    );
}

export default ChangePassword;