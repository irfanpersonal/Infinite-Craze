import {useDispatch, useSelector} from "react-redux";
import {ProductListItem} from '../components';
import {FaPlusSquare} from "react-icons/fa";
import {Link} from "react-router-dom";
import {isEditingProductFalse, resetSingleProductData} from "../features/addProduct/addProductSlice";

const ProductList = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {isLoading, products, totalProducts} = useSelector(store => store.products);
    if (isLoading) {
        return (
            <h1>Loading...</h1>
        );
    }
    return (
        <section>
            <div style={{display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '1rem'}}>
                <div>{totalProducts === 0 ? (
                    'No Products...'
                ) : (
                    <>
                        {totalProducts} Product{totalProducts > 1 && 's'} Found...
                    </>
                )}</div>
                {user?.role === 'admin' && (
                    <Link onClick={() => {
                        dispatch(resetSingleProductData());
                        dispatch(isEditingProductFalse());
                    }} to='/add-product' style={{backgroundColor: 'gray', padding: '0.25rem 2rem', color: 'white', textDecoration: 'none', border: '1px solid black'}}><FaPlusSquare/> Create</Link>
                )}
            </div>
            {products.map(product => {
                return <ProductListItem key={product._id} data={product}/>
            })}
        </section>
    );
}

export default ProductList;