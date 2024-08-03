import styled from 'styled-components';
import {personOne, personTwo, personThree, personFour} from '../images';
import React from 'react';

const data = [
    {
        name: 'Johnny Appleseed',
        text: "I've been using this online shopping platform for over a year now, and I couldn't be happier with the service. The product selection is fantastic, and the delivery is always prompt. Plus, their customer support team is super responsive and helpful!",
        image: personOne
    },
    {
        name: 'Chilly Willy',
        text: "The variety of products available is amazing. I can find everything I need in one place, from electronics to clothing. The shipping can be a bit slow sometimes, but the quality of the products makes up for it.",
        image: personTwo
    },
    {
        name: 'Albert Einstein',
        text: "Fantastic shopping experience! I love the detailed product descriptions and customer reviews, which help me make informed decisions. I've never had an issue with my orders, and the prices are unbeatable.",
        image: personThree
    },
    {
        name: 'Sam Donald',
        text: "I've tried several online shopping sites, but this one is by far the best. The site is easy to navigate, the deals are great, and I appreciate the secure payment options. I've recommended it to all my friends and family.",
        image: personFour
    }
];

const Reviews: React.FunctionComponent = () => {
    const [index, setIndex] = React.useState(0);
    const left = () => {
        setIndex(currentState => {
            let newState = currentState - 1;
            if (newState === -1) {
                newState = data.length - 1;
            }
            return newState;
        });
    }
    const right = () => {
        setIndex(currentState => {
            let newState = currentState + 1;
            if (newState === data.length) {
                newState = 0;
            }
            return newState;
        });
    }
    return (
        <Wrapper>
        <section>
            <img src={data[index].image}/>
            <h1>{data[index].name}</h1>
            <div className="review">{data[index].text}</div>
            <div className="row">
                <span onClick={left}> <div className="left-arrow"></div> </span> 
                <span onClick={right}> <div className="right-arrow"></div> </span>
            </div>
        </section>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding:20px;
    section {
        display:flex;
        flex-direction:column;
    }
    img {
        width: 100px;
        height: 100px;
        margin-bottom:20px;
        object-fit:cover;
        border-radius:0px;
        box-shadow:0px 1px 2px rgba(0,0,0,0.16);
    }
    a {
        display: inline-block;
        margin: 1rem 0;
        background-color: lightblue;
        padding: 0.5rem 2rem;
        border-radius: 1rem;
        text-decoration: none;
        color: black;
    }
    a:hover {
        outline: 1px solid black;
    }
    span {    
        width: 40px;
        height: 40px;
        margin-right:20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        border: 1px solid #eeeeee;
        cursor: pointer;
    }
    span:hover, span:active {
        background-color: gray;
    }
    .review {
        margin:20px 0px;
        padding:20px;
        background-color:#eeeeee;
    }
    .left-arrow {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-left: 2px solid black;
        border-bottom: 2px solid black;
        transform: rotate(45deg);
        margin-left:4px;
    }
    .right-arrow {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-right: 2px solid black;
        border-top: 2px solid black;
        transform: rotate(45deg);
        margin-right:4px;
    }
`;

export default Reviews;