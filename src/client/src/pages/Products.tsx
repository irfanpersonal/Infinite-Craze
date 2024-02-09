import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getAllProducts} from '../features/products/productsThunk';
import {FilterBox, Loading, SearchBox, ProductList, PaginationBox} from '../components';
import {updateSearchBoxValues, setPage} from '../features/products/productsSlice';

const Products: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {productsLoading, products, searchBoxValues, totalProducts, numberOfPages, page} = useSelector((store: useSelectorType) => store.products);
    React.useEffect(() => {
        dispatch(getAllProducts());
    }, []);
    return (
        <Wrapper>
            <div className="product-container">
                <div className="input-container">
                    <FilterBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllProducts} setPage={setPage} productsLoading={productsLoading}/>
                </div>
                <div className="content-container">
                    <SearchBox search={searchBoxValues.search} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllProducts} setPage={setPage} productsLoading={productsLoading}/>
                    {productsLoading ? (
                        <Loading title="Loading Products" position='normal' marginTop='1rem'/>
                    ) : (
                        <>
                            <ProductList data={products} totalProducts={totalProducts!}/>
                            {numberOfPages! > 1 && (
                                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={setPage} updateSearch={getAllProducts}/>
                            )}
                        </>
                    )}
                    {user!?.role === 'admin' && (
                        <Link to='/add-product' className="add-product">+</Link>
                    )}
                </div>
            </div>
        </Wrapper>
    );  
}

const Wrapper = styled.div`
    .product-container {
        display: flex;
    }
    .input-container {
        flex-basis: 30%;
        outline: 1px solid black;
    }
    .content-container {
        flex-basis: 70%;
        outline: 1px solid black;
    }
    .add-product {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background-color: black; 
        text-decoration: none;  
        padding: 1rem;
        border-radius: 50%;
        outline: 1px solid black;
        color: white;
    }
    a:hover {
        background-color: white;
        color: black;
    }
`;

export default Products;