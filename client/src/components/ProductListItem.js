import styled from 'styled-components';
import {Link} from 'react-router-dom';

const ProductListItem = ({data}) => {
    const {image, name, price, _id} = data;
    return (
        <Wrapper>
            <img src={image} alt={name}/>
            <Link to={`/products/${_id}`}>{name}</Link>
            <h1>${price / 100}</h1>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    text-align: center;
    margin-bottom: 1rem;
    border: 1px solid black;
    background-color: lightgray;
    img {
        display: block;
        margin: 0 auto;
        width: 150px;
        height: 150px;
        border: 1px solid black;
    }
`;

export default ProductListItem;