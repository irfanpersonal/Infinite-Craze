import React from 'react';
import styled from 'styled-components';
import {FaSearch} from "react-icons/fa";
import {Loading, UserList, PaginationBox} from '../components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getAllUsers} from '../features/users/usersThunk';
import {setPage, updateSearchBoxValues} from '../features/users/usersSlice';

const Users: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {usersLoading, users, numberOfPages, totalUsers, page, searchBoxValues} = useSelector((store: useSelectorType) => store.users);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(getAllUsers());
    }
    React.useEffect(() => {
        dispatch(getAllUsers());
    }, []);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <input id="search" type="text" name="search" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                </select>
                <FaSearch onClick={handleSubmit}/>
            </form>
            {usersLoading ? (
                <Loading title="Loading Users" position='normal' marginTop='1rem'/>
            ) : (
                <div className="result-box">
                    <UserList data={users} totalUsers={totalUsers!}/>
                    {numberOfPages! > 1 && (
                        <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getAllUsers}/>
                    )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .title {
        text-align: center;
        border-bottom: 1px solid black;
    }
    form {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        margin: 0 auto;
        margin-top: 1rem;
        outline: 1px solid black;
        border-radius: 1rem;
        padding: 0.5rem;
        input {
            border: none;
            width: 100%;
            padding: 0.5rem;
            outline: none;
        }
        svg {
            cursor: pointer;
            margin-left: 1rem;
            font-size: 1.5rem;
        }
        svg:hover, svg:active {
            color: gray;
        }
    }
    .result-box {
        padding: 1rem;
    }
`;

export default Users;