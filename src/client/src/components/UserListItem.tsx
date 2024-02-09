import styled from 'styled-components';
import {type UserType} from '../features/user/userSlice';
import emptryProfilePicture from '../images/empty-profile-picture.jpeg';
import {useNavigate} from 'react-router-dom';

interface UserListItemProps {
    data: UserType
}

const UserListItem: React.FunctionComponent<UserListItemProps> = ({data}) => {
    const navigate = useNavigate();
    return (
        <Wrapper onClick={() => {
            navigate(`/user/${data._id}`);
        }}>
            <img className="user-image" src={data.profilePicture || emptryProfilePicture} alt={data.name}/>
            <div className="user-name">{data.name}</div>
        </Wrapper>
    );
}

const Wrapper = styled.article` 
    cursor: pointer;
    outline: 1px solid black;
    padding: 1rem;
    text-align: center;
    margin-bottom: 0.5rem;
    .user-image {
        display: block;
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
        margin: 0 auto;
    }
    .user-name {
        margin-top: 1rem;
    }
    &:hover {
        background-color: lightgray;
    }
`;

export default UserListItem;