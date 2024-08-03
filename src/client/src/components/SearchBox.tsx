import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {useDispatchType} from '../store';
import {FaMagnifyingGlass, FaSpinner} from "react-icons/fa6";

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
            <input className="bRadius0" id="search" type="search" name="search" placeholder={"Type here"} value={search} onChange={handleChange}/>
            <button id="search-btn" disabled={productsLoading}>{productsLoading ? <FaMagnifyingGlass/> : <FaMagnifyingGlass/>}</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    display:flex;
    flex-direction:row;
    #search, #search-btn {
    }
    #search {
    }
    #search-btn {
        color:#FFFFFF;
        padding:0px 10px;
        margin-left:10px;
        border-radius:0px;
        background-color:#000000;
        border:1px solid #eeeeee;
    }
`;

export default SearchBox;