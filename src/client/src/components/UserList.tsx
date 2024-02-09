import React from 'react';
import styled from 'styled-components';
import {type UserType} from '../features/user/userSlice';
import {nanoid} from 'nanoid';
import UserListItem from './UserListItem';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

type ViewType = 'grid' | 'list';

interface UserListProps {
    data: UserType[],
    totalUsers: number
}

const UserList: React.FunctionComponent<UserListProps> = ({data, totalUsers}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <Wrapper>
            {totalUsers === 0 ? (
                <h1>No Users Found!</h1>
            ) : (
                <div className="result-details">
                    <h1>{totalUsers} User{totalUsers > 1 && 's'} Found...</h1>
                    <div>
                        <MdGridView onClick={() => setViewType(currentState => 'grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`}/>
                        <GiHamburgerMenu onClick={() => setViewType(currentState => 'list')} className={`view-type ${viewType === 'list' && 'active-type'}`}/>
                    </div>
                </div>
            )}
            <div className="results">
                <section className={`${viewType === 'grid' && 'grid-styling'}`}>
                    {data.map(item => {
                        return (
                            <UserListItem key={nanoid()} data={item}/>
                        );
                    })}
                </section>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .result-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }
    .view-type {
        cursor: pointer;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
        outline: 1px solid black;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
    .results {
        margin-top: 1rem;
        .grid-styling {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }
    }
`;

export default UserList;