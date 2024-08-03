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
            <div className="column aCenter pad50" style={{backgroundSize:'cover',backgroundPosition:'center',borderTop:'1px solid #eeeeee',backgroundColor:'#ffffff'}}>
                <h1 className="">Shop our Variety.</h1>
                <p className="">Products that you will find no-where else.</p>
            </div>
            <div className="product-container">
                <div className="input-container">
                    <FilterBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllProducts} setPage={setPage} productsLoading={productsLoading}/>
                </div>
                <div className="content-container">
                    <div className="row aCenter jSpaceBetween pad20">
                        <div>{'Home < Products'}</div>
                        <SearchBox search={searchBoxValues.search} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllProducts} setPage={setPage} productsLoading={productsLoading}/>
                    </div>
                    
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
                        <Link to='/add-product' className="add-product">List</Link>
                    )}
                </div>
            </div>
        </Wrapper>
    );  
}

const Wrapper = styled.div`
    flex:1;
    display:flex;
    flex-direction:column;
    .product-container {
        flex:1;
        display: flex;
        border-top:1px solid #eeeeee;
    }
    .input-container {
        width:300px;
        border-right:1px solid #eeeeee;
    }
    .content-container {
        flex:1;
        display:flex;
        flex-direction:column;
    }
    .add-product {
        right:20px;
        bottom:20px;
        width:60px;
        height:60px;
        position: fixed;
        color:#FFFFFF;
        display:flex;
        align-items:center;
        justify-content:center;
        background-color:#4CAF50;
    }
    a.add-product:hover {
        color: #4CAF50;
        background-color: white;
        border:1px solid #4CAF50;
    }
`;

export default Products;