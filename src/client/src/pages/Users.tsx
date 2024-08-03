import React from 'react';
import styled from 'styled-components';
import {FaMagnifyingGlass} from "react-icons/fa6";
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
            <div className="pad20 pageHeader">
                <h1 className="tCenter">Users</h1>
                <p className="tCenter">View list of your users.</p>

                <form onSubmit={handleSubmit}>
                    <input id="search" type="text" name="search" placeholder="Search here" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                        <option value=""></option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                    <div className="inputSearch" onClick={handleSubmit}>Search</div>
                </form>
            </div>

            
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
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top:20px;
        input {
            padding:10px;
            border-radius:0px;
        }
        svg {
            cursor: pointer;
            margin-left: 1rem;
            font-size: 1.5rem;
        }
        svg:hover, svg:active {
            color: gray;
        }
        select {margin:0px 10px;border-radius:0px;}
    }
    .pageHeader {
        border-top:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
    }
    .inputSearch {
        font-size:14px;
        padding:9.5px 12px;
        border-radius:8px;
        background-color:#f9f9f9;
        border:1px solid #eeeeee;
        border-radius:0px;
    }
`;

export default Users;