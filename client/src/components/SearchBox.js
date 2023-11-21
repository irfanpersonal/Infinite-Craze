import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {getAllProducts} from '../features/products/productsThunk';
import { updateSearchValue } from '../features/products/productsSlice.js';

const SearchBox = () => {
    const dispatch = useDispatch();
    const {search} = useSelector(store => store.products);
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(getAllProducts());
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <input id="search" type="search" name="search" value={search} onChange={(event) => dispatch(updateSearchValue(event.target.value))}/>
            <button type="submit">SEARCH</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    border: 1px solid black;
    width: 50%;
    margin: 0 auto;
    padding: 1rem;
    input {
        width: 75%;
    }
    button {
        width: 25%;
    }
    input, button {
        padding: 0.5rem;
    }
`;

export default SearchBox;