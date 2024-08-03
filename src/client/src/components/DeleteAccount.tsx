import {useDispatch, useSelector} from "react-redux";
import {type useDispatchType, type useSelectorType} from "../store";
import {deleteAccount} from "../features/user/userThunk";
import styled from 'styled-components';

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
        <Wrapper>
        <form onSubmit={handleSubmit}>
            <p>To delete your account, please confirm your decision by entering your password below. This step ensures the security of your account deletion process.</p>
            <div>
                <label htmlFor="passowrd">Password</label>
                <input id="password" type="password" name="password"/>
            </div>
            <button className="darkButton" type="submit" disabled={deleteAccountLoading}>{deleteAccountLoading ? 'Deleting...' : 'Delete'}</button>
        </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding:40px;
    p {
        font-weight:600;
        margin-bottom:40px;
    }
    label {
        margin-top:20px;
        margin-bottom:10px;
    }
    form input {
        padding:10px;
        border-radius:0px;
    }
    .darkButton {
        color:#FFFFFF;
        padding:10px;
        border-width:0px;
        background-color:#000000;
    }
`;

export default DeleteAccount;