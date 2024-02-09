import React from 'react';
import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {type ProductType} from '../features/products/productsSlice';
import ProductListItem from './ProductListItem';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

type ViewType = 'grid' | 'list';

interface ProductListProps {
    data: ProductType[],
    totalProducts: number
}

const ProductList: React.FunctionComponent<ProductListProps> = ({data, totalProducts}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <section style={{padding: '1rem'}}>
            {totalProducts === 0 ? (
                <h1>No Products Found!</h1>
            ) : (
                <Wrapper>
                    <h1>{totalProducts} Product{totalProducts! > 1 && 's'} Found...</h1>
                    <div>
                        <MdGridView onClick={() => setViewType(currentState => 'grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`}/>
                        <GiHamburgerMenu onClick={() => setViewType(currentState => 'list')} className={`view-type ${viewType === 'list' && 'active-type'}`}/>
                    </div>
                </Wrapper>
            )}
            <ProductStyling>
                <div className={`${viewType === 'grid' && 'grid-styling'}`}>
                    {data.map(item => {
                        return (
                            <ProductListItem key={nanoid()} data={item}/>
                        );
                    })}
                </div>
            </ProductStyling>
        </section>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid black;
    .view-type {
        cursor: pointer;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
        outline: 1px solid black;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
`;

const ProductStyling = styled.div`
    margin-top: 1rem;
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
`;

export default ProductList;