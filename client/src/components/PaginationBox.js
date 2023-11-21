import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {setPage} from '../features/products/productsSlice.js';
import {getAllProducts} from '../features/products/productsThunk.js';

const PaginationBox = () => {
    const dispatch = useDispatch();
    const {numberOfPages, page} = useSelector(store => store.products);
    return (
        <Wrapper>
            {Array.from({length: numberOfPages}, (value, index) => {
                return (
                    <span style={{border: page === index + 1 && '1px solid black'}} key={index} onClick={() => {
                        dispatch(setPage(index + 1));
                        dispatch(getAllProducts());
                    }}>{index + 1}</span>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    text-align: center;
    span {
        display: inline-block;
        background-color: lightgray;
        padding: 1rem;
        margin-left: 0.25rem;
    }
`;

export default PaginationBox;