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
        <section>
            {totalProducts === 0 ? (
                <div className="countWrapper" style={{padding:'0px 20px 20px 20px',}}>
                    <h1 className="f32">No Products Found!</h1>
                </div>
            ) : (
                <Wrapper>
                    <h1 className="f32">{totalProducts} Product{totalProducts! > 1 && 's'} Found.</h1>
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
    padding:0px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .view-type {
        margin-left:10px;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0.25rem;
        border: 1px solid black;
    }
    .active-type {
        filter:invert(1);
        background-color: #FFFFFF;
    }
`;

const ProductStyling = styled.div`
    margin-top: 1rem;
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0rem;
    }
`;

export default ProductList;