import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from "../store";
import {deleteAccount} from "../features/user/userThunk";

const DeleteAccount: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {deleteAccountLoading} = useSelector((store: useSelectorType) => store.user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const password = (target.elements.namedItem('password') as HTMLInputElement).value;
        dispatch(deleteAccount(password));
    }
    return (
        <form onSubmit={handleSubmit}>
            <p>To delete your account, please confirm your decision by entering your password below. This step ensures the security of your account deletion process.</p>
            <div>
                <label htmlFor="passowrd">Password</label>
                <input id="password" type="password" name="password"/>
            </div>
            <button type="submit" disabled={deleteAccountLoading}>{deleteAccountLoading ? 'Deleting...' : 'Delete'}</button>
        </form>
    );
}

export default DeleteAccount;