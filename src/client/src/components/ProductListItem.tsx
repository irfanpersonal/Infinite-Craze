import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {type ProductType} from '../features/products/productsSlice';

interface ProductListItemProps {
    data: ProductType
}

const ProductListItem: React.FunctionComponent<ProductListItemProps> = ({data}) => {
    return (
        <Wrapper to={`/product/${data._id}`}>
            <img className="product-image" src={data.image} alt={data.name}/>
            <div>{data.name}</div>
            <div>${data.price / 100}</div>
        </Wrapper>
    );
}

const Wrapper = styled(Link)`
    display: block;
    margin-bottom: 0.5rem;
    outline: 1px solid black;
    padding: 1rem;
    text-align: center;
    text-decoration: none;
    color: black;
    border-radius: 0.25rem;
    &:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
    .product-image {
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
    }
`;

export default ProductListItem;