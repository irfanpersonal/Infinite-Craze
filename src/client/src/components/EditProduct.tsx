import React from 'react';
import styled from 'styled-components';
import {type ProductType} from '../features/products/productsSlice';
import {conditions, categories} from '../utils/index';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateSingleProduct} from '../features/singleProduct/singleProductThunk';
import {useParams} from 'react-router-dom';

interface EditProductProps {
    data: ProductType
}

const EditProduct: React.FunctionComponent<EditProductProps> = ({data}) => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {updateSingleProductLoading} = useSelector((store: useSelectorType) => store.singleProduct);
    const [colors, setColors] = React.useState<string[]>(data!.colors);
    const addInput = () => {
        setColors([...colors, '']);
    };
    const removeInput = (index: number) => {
        const updatedColors = [...colors];
        updatedColors.splice(index, 1);
        setColors(updatedColors);
    };
    const handleInputChange = (event: React.ChangeEvent, index: number) => {
        const value = (event.target as HTMLInputElement).value;
        const updatedColors = [...colors];
        updatedColors[index] = value;
        setColors(updatedColors);
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLTextAreaElement).value);
        formData.append('price', (target.elements.namedItem('price') as HTMLInputElement).value);
        formData.append('shippingFee', (target.elements.namedItem('shippingFee') as HTMLInputElement).value);
        formData.append('condition', (target.elements.namedItem('condition') as HTMLSelectElement).value);
        formData.append('category', (target.elements.namedItem('category') as HTMLSelectElement).value);
        const colorValues = colors.filter(value => value);
        if (!colorValues.length) {
            return;
        }
        else {
            colorValues.map((color) => {
                formData.append('colors', color);
            });
        }
        if (target.image.files[0]) {
            formData.append('image', target.image.files[0]);
        }
        dispatch(updateSingleProduct({productID: id!, data: formData}));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit} className="edit-product-form">
                <p style={{textAlign: 'center', marginBottom: '0.25rem'}}>Current Image</p>
                <img style={{width: '100px', height: '100px', display: 'block', margin: '0 auto', marginBottom: '20px',objectFit:'contain'}} src={data.image}/>
                <div>
                    <label htmlFor="image">Image</label>
                    <input style={{}} id="image" type="file" name="file"/>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name" defaultValue={data.name}/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" name="description" defaultValue={data.description}/>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" defaultValue={data.category}>
                        {categories.map(category => {
                            return (
                                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="condition">Condition</label>
                    <select id="condition" name="condition" defaultValue={data.condition}>
                        <option value=""></option>
                        {conditions.map(condition => {
                            return (
                                <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" name="price" min="1" defaultValue={data.price / 100}/>
                </div>
                <div>
                    <label htmlFor="shippingFee">Shipping Fee</label>
                    <input id="shippingFee" type="number" name="shippingFee" min="1" defaultValue={data.shippingFee / 100}/>
                </div>
                <div className="custom-message hide"></div>
                <div className="colors-box">
                    <label className="colors-label" htmlFor="colors">Colors <span className="option" onClick={() => addInput()}>+</span></label>
                    {colors.map((color, index) => (
                        <div key={index} style={{display: 'flex'}} id="color-box">
                            <input className="color-input" id="color-input" value={color} onChange={(event) => handleInputChange(event, index)}/>
                            <button className="remove-color" id="remove-color" type="button" onClick={() => {
                                if (document.querySelectorAll('.colors-box input').length === 1) {
                                    (document.querySelector('.custom-message') as HTMLDivElement).textContent = 'Note: You must have atleast 1 color!';
                                    if (!(document.querySelector('.custom-message') as HTMLDivElement).classList.contains('hide')) {
                                        return;
                                    }
                                    (document.querySelector('.custom-message') as HTMLDivElement).classList.toggle('hide');
                                    return;
                                }
                                removeInput(index);
                            }}>Delete</button>
                        </div>
                    ))}
                </div>
                <button type="submit">{updateSingleProductLoading ? 'Editing...' : 'Edit'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    .edit-product-form {
        width:50%;
        margin:auto;
        label {
            display: block;
            margin:10px 0px;
        }
        input, select {
            padding:10px;
            border-radius:0px;
            width:100%;
        }
        button {
            color:#FFFFFF;
            padding:10px 60px;
            border-width:0px;
            background-color:#000000;
        }
    }
    #color-box {
        margin: 1rem 0;
    }
    #color-input {
        padding: 0.5rem;
        margin: 0;
    }
    #remove-color {
        color:#FFFFFF;
        margin-top:0px;
        padding:0px 20px;
        background-color:#000000;
    }
    .colors-box {
        margin-top: 0.5rem;
    }
    .option {
        background-color: white;
        color: black;
        padding: 0 0.5rem;
        outline: 1px solid black;
        cursor: pointer;
        margin-left: 0.25rem;
    }
    .option:hover, .option:active {
        color: white;
        background-color: black;
    }
    .custom-message {
        background-color: lightgray;
        padding: 0.25rem;
    }
    .hide {
        display: none;
    }
`;

export default EditProduct;