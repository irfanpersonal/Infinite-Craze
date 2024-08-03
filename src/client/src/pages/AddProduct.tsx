import React from 'react';
import styled from 'styled-components';
import {conditions, categories} from '../utils';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {createProduct} from '../features/products/productsThunk';

const AddProduct: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {createProductLoading} = useSelector((store: useSelectorType) => store.products);
    const [colors, setColors] = React.useState<string[]>([]);
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
        dispatch(createProduct(formData));
    }
    return (
        <Wrapper>
            <div className="pad20 pageHeader"><h1 className="tCenter">Add Product</h1><p className="tCenter">List a new item.</p></div>
            
            <div className="pad50">
            <form onSubmit={handleSubmit} className="addProductForm">
                <div>
                    <label htmlFor="name">Name</label>
                    <input placeholder="Product Title" id="name" type="text" name="name"/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea placeholder="Product Description" id="description" name="description"></textarea>
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" placeholder="Product Price" type="number" name="price"/>
                </div>
                <div>
                    <label htmlFor="shippingFee">Shipping Fee</label>
                    <input id="shippingFee" placeholder="Shipping Cost" type="number" name="shippingFee"/>
                </div>
                <div>
                    <label htmlFor="condition">Condition</label>
                    <select id="condition" name="condition">
                        <option value=""></option>
                        {conditions.map(condition => {
                            return (
                                <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category">
                        {categories.map(category => {
                            return (
                                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="custom-message hide"></div>
                <div className="colors-box">
                    <label className="colors-label" htmlFor="colors">Colors <span className="option" onClick={() => addInput()}>+</span></label>
                    {colors.map((color, index) => (
                        <div key={index} style={{display: 'flex'}} id="color-box">
                            <input placeholder="Enter color" className="color-input" id="color-input" value={color} onChange={(event) => handleInputChange(event, index)}/>
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
                <div>
                    <label htmlFor="image">Image</label>
                    <input style={{padding: '0'}} id="image" type="file" name="file"/>
                </div>
                <button type="submit" disabled={createProductLoading}>{createProductLoading ? 'Creating...' : 'Create'}</button>
            </form>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .pageHeader {
        border-top:1px solid #eeeeee;
        border-bottom:1px solid #eeeeee;
    }
    .title {
        text-align: center;
        border-bottom: 1px solid black;
    }
    form {
        width: 50%;
        margin:auto;
        label {
            display:block;
            margin:15px 0px;
        }
        input, select, textarea {
            width: 100%;
            padding:10px;
            border-radius:0px;
            border:1px solid #eeeeee;
            background-color:#f9f9f9;
        }
        textarea {
            height: 120px;
            resize: none;
        }
        button {
            width: 100%;
            padding:10px;
            color:#FFFFFF;
            border-radius:0px;
            border:0px solid #eeeeee;
            background-color:#000000;
            margin-top:20px;
        }
        p {
            margin: 1rem 0;
            text-align: center;
        }
    }
    .custom-message {
        margin-top: 1rem;
        background-color: lightgray;
        padding: 0.25rem;
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
    .color-input {
        padding: 0;
        margin: 0;
    }
    .remove-color {
        
    }
    .hide {
        display: none;
    }
    #color-box {
        margin: 1rem 0;
    }
    #color-input {
        padding: 0.5rem;
        margin: 0;
    }
    #remove-color {
        padding: 0.5rem;
        margin: 0;
    }
`;

export default AddProduct;