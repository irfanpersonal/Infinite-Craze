import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SearchBox, ProductList, PaginationBox} from '../components';
import {getAllProducts} from '../features/products/productsThunk';

const Products = () => {
    const dispatch = useDispatch();
    const {numberOfPages} = useSelector(store => store.products);
    React.useEffect(() => {
        dispatch(getAllProducts());
    }, []);
    return (
        <>
            <SearchBox/>
            <ProductList/>
            {numberOfPages > 1 && (
                <PaginationBox/>
            )}
        </>
    );
}

export default Products;