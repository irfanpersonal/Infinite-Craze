import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {getAllUsers} from './usersThunk';

interface IUsers {
    usersLoading: boolean,
    users: UserType[],
    searchBoxValues: {
        search: string,
        sort: '' | 'a-z' | 'z-a'
    },
    page: number,
    totalUsers: number | null,
    numberOfPages: number | null,
}

const initialState: IUsers = {
    usersLoading: true,
    users: [],
    searchBoxValues: {
        search: '',
        sort: ''
    },
    page: 1,
    totalUsers: null,
    numberOfPages: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetPage: (state) => {
            state.page = 1;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllUsers.pending, (state) => {
            state.usersLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.usersLoading = false;
            state.users = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllUsers.rejected, (state, action) => {
            state.usersLoading = false;
        });
    }
});

export const {resetPage, updateSearchBoxValues, setPage} = usersSlice.actions;

export default usersSlice.reducer;