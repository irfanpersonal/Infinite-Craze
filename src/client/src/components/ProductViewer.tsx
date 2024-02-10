import React from 'react';
import styled from 'styled-components';
import emptyProductImage from '../images/empty-product-image.jpeg';
import {type OrderType} from '../features/orders/ordersSlice';
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

interface ProductViewerProps {
    data: OrderType
}

const ProductViewer: React.FunctionComponent<ProductViewerProps> = ({data: OrderListItem}) => {
    const names = OrderListItem.items.map(value => {
        const {product} = value;
        return product?.name;
    });
    const images = OrderListItem.items.map(value => {
        const {product} = value;
        return product?.image;
    });
    const amounts = OrderListItem.items.map(value => {
        const {amount} = value;
        return amount;
    });
    const colors = OrderListItem.items.map(value => {
        const {color} = value;
        return color;
    });
    const [currentImage, setCurrentImage] = React.useState(0);
    const previous = () => {
        const newImage = currentImage - 1;
        if (newImage === -1) {
            setCurrentImage(currentState => {
                return images.length - 1;
            });
            return;
        }
        setCurrentImage(currentState => {
            return newImage;
        });
    }
    const next = () => {
        const newImage = currentImage + 1;
        if (newImage === images.length) {
            setCurrentImage(currentState => {
                return 0;
            });
            return;
        }
        setCurrentImage(currentState => {
            return newImage;
        });
    }
    return (
        <Wrapper>
            <div>{names[currentImage] || 'Product Deleted'}</div>
            <img className="product-image" src={images[currentImage] || emptyProductImage}/>
            <div>Amount: {amounts[currentImage]}</div>
            <div>Color: {colors[currentImage]}</div>
            {images.length > 1 && (
                <div className="navigation-box">
                    <div className="navigators" onClick={previous}><FaArrowLeft/></div>
                    <div className="navigators" onClick={next}><FaArrowRight/></div>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    .product-image {
        display: block;
        margin: 0 auto;
        width: 5rem;
        height: 5rem;
        outline: 1px solid black;
    }
    .navigation-box {
        display: flex;
        justify-content: space-between;
        div {
            outline: 1px solid black;
            padding: 0.5rem;
        }
    }
    .navigators {
        cursor: pointer;
    }
    .navigators:hover, .navigators:active {
        background-color: gray;
    }
`;

export default ProductViewer;