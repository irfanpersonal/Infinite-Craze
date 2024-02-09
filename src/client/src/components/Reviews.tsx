import {personOne, personTwo, personThree, personFour} from '../images';
import React from 'react';
import {FaArrowCircleLeft, FaArrowCircleRight} from "react-icons/fa";

const data = [
    {
        name: 'Johnny Appleseed',
        text: 'I love to come here and spend!',
        image: personOne
    },
    {
        name: 'Chilly Willy',
        text: 'This is the peanut butter to my jelly. I cant live without it!',
        image: personTwo
    },
    {
        name: 'Albert Einstein',
        text: 'I belive this is the best Ecommerce Store in the world!',
        image: personThree
    },
    {
        name: 'Sam Donald',
        text: 'Wow so easy and fast!',
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
        <section style={{border: '1px solid black', width: '75%', margin: '0 auto', backgroundColor: 'lightgray', padding: '1rem'}}>
            <h1>Reviews</h1>
            <img src={data[index].image} style={{width: '150px', height: '150px', border: '1px solid black'}}/>
            <h1>{data[index].name}</h1>
            <p>{data[index].text}</p>
            <span onClick={left}><FaArrowCircleLeft/></span> <span onClick={right}><FaArrowCircleRight/></span>
        </section>
    );
}

export default Reviews;