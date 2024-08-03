import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {Link} from 'react-router-dom';
import {type ProductType} from '../features/products/productsSlice';

interface ProductListItemProps {
    data: ProductType
}

const ProductListItem: React.FunctionComponent<ProductListItemProps> = ({data}) => {
    return (
        <Wrapper to={`/product/${data._id}`}>
            <div className="productItemInner">
                <img className="productImage" src={data.image || emptyProductImage} alt={data.name}/>
                <div>
                    <div className="column flexFull">
                        <div className="product-name">{data.name}</div>
                        <div>${data.price / 100}</div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled(Link)`
    border-right: 1px solid rgb(238, 238, 238);
    border-bottom: 1px solid rgb(238, 238, 238);
    &:hover {
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
    img {
        width: 12rem;
        height: 12rem;
        display: block;
        margin: auto;
        margin: 3rem auto;
        object-fit: contain;
    }
    .product-name {
        font-weight: bold;
        font-size: 1rem;
    }
`;

export default ProductListItem;