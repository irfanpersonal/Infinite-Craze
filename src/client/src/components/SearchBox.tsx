import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {useDispatchType} from '../store';

interface SearchBoxProps {
    search: string,
    updateSearchBoxValues: Function,
    updateSearch: Function,
    id?: string,
    setPage: Function,
    productsLoading: boolean
}

const SearchBox: React.FunctionComponent<SearchBoxProps> = ({search, updateSearchBoxValues, updateSearch, id, setPage, productsLoading}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleChange = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        dispatch(updateSearchBoxValues({name: target.name, value: target.value}));
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(setPage(1));
        dispatch(updateSearch(id));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <input id="search" type="search" name="search" value={search} onChange={handleChange}/>
            <button id="search-btn" disabled={productsLoading}>{productsLoading ? 'Searching' : 'Search'}</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    padding: 1rem;
    border-bottom: 1px solid black;
    #search, #search-btn {
        padding: 0.25rem;
    }
    #search {
        width: 70%;
    }
    #search-btn {
        width: 30%;
    }
`;

export default SearchBox;