import styled from 'styled-components';
import moment from 'moment';
import {type UserType} from '../features/user/userSlice';
import emptryProfilePicture from '../images/empty-profile-picture.jpeg';
import {useNavigate} from 'react-router-dom';

interface UserListItemProps {
    data: UserType
}

const UserListItem: React.FunctionComponent<UserListItemProps> = ({data}) => {
    const navigate = useNavigate();
    console.log(data);
    return (
        <Wrapper onClick={() => {
            navigate(`/user/${data._id}`);
        }}>
            <img className="user-image" src={data.profilePicture || emptryProfilePicture} alt={data.name}/>
            <div className="user-name">{data.name}</div>
            <div className="user-created">Created: {moment(data.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
        </Wrapper>
    );
}

const Wrapper = styled.article` 
    cursor: pointer;
    padding: 20px;
    border-right:1px solid #eeeeee;
    border-bottom:1px solid #eeeeee;
    &:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
    .user-image {
        width: 200px;
        height: 200px;
        display: block;
        margin: auto;
        margin: 50px auto;
        object-fit: contain;
    }
    .user-name {
        font-size: 18px;
        font-weight: 600;
        text-transform:capitalize;
    }
    &:hover {
        
    }
`;

export default UserListItem;