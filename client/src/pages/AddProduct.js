import {Link} from 'react-router-dom';
import styled from 'styled-components';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createProduct, updateSingleProduct} from '../features/addProduct/addProductThunk';
import {isEditingProductFalse, resetSingleProductData, updateSingleProductData} from '../features/addProduct/addProductSlice';

const AddProduct = () => {
    const dispatch = useDispatch();
    const {isLoading, singleProductData, isLoadingGetSingleProduct} = useSelector(store => store.addProduct);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.elements.name.value);
        formData.append('inventory', event.target.elements.inventory.value);
        formData.append('price', event.target.elements.price.value);
        formData.append('category', event.target.elements.category.value);
        formData.append('colors', event.target.elements.colors.value);
        formData.append('image', event.target.image.files[0]);
        if (isEditingProduct) {
            dispatch(updateSingleProduct({productID: singleProductData.id, product: formData}));
            return;
        }
        dispatch(createProduct(formData));
    }
    const {isEditingProduct} = useSelector(store => store.addProduct);
    if (isLoadingGetSingleProduct) {
        return (
            <h1>Loading...</h1>
        );
    }
    return (
        <Wrapper>
            <Link to='/products'>Back to Products</Link>
            <form onSubmit={handleSubmit}>
                <h1 style={{backgroundColor: 'lightblue', padding: '0.5rem', textAlign: 'center', fontSize: '1rem'}}>{isEditingProduct ? 'Edit Product' : 'Add Product'}</h1>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name" value={singleProductData.name} onChange={(event) => dispatch(updateSingleProductData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="inventory">Inventory</label>
                    <input id="inventory" type="number" name="inventory" min="1" value={singleProductData.inventory} onChange={(event) => dispatch(updateSingleProductData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" name="price" min="1" value={singleProductData.price} onChange={(event) => dispatch(updateSingleProductData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={singleProductData.category} onChange={(event) => dispatch(updateSingleProductData({name: event.target.name, value: event.target.value}))}>
                        <option value="motors">Motors</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="toys">Toys</option>
                        <option value="essentials">Essentials</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="colors">Colors</label>
                    <input id="colors" type="text" name="colors" value={singleProductData.colors} onChange={(event) => dispatch(updateSingleProductData({name: event.target.name, value: event.target.value}))}/>
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input style={{padding: '0', marginBottom: '1rem'}} id="image" type="file" name="image"/>
                </div>
                {isEditingProduct && (
                    <p>Current Image<img style={{width: '25%', height: '25%', display: 'block', margin: '1rem 0'}} src={singleProductData.image} alt={singleProductData.name}/></p>
                )}
                <button style={{marginBottom: '1rem'}} type="button" onClick={() => {
                    dispatch(resetSingleProductData());
                    dispatch(isEditingProductFalse());
                }}>CLEAR</button>
                <button type="submit">{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    a {
        display: block;
        background-color: lightblue;
        padding: 0.5rem;
        text-align: center;
        text-decoration: none;
        color: black;
    }
    a:hover {
        outline: 1px solid black;
    }
    form {
        width: 50%;
        border: 1px solid black;
        margin: 1rem auto;
        padding: 1rem;
    }
    label, input, button {
        display: block;
    }
    input, button {
        width: 100%;
        padding: 0.5rem;
    }
    label {
        margin-top: 1rem;
    }
    .color-input {
        display: block;
        margin-top: 0.5rem;
    }
`;

export default AddProduct;