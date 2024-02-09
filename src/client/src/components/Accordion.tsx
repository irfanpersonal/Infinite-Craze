import styled from 'styled-components';
import AccordionElement from './AccordionElement';
import {nanoid} from 'nanoid';

const data = [
    {
        id: nanoid(),
        name: 'Why is this the best Ecommerce Store?',
        text: 'Because its super cool and easy to use.'
    },
    {
        id: nanoid(),
        name: 'Why should we trust you',
        text: 'Because we are the best in the business.'
    },
    {
        id: nanoid(),
        name: 'Whats next for Infinite Craze',
        text: 'An infinite amount of awesomeness!'
    },
    {
        id: nanoid(),
        name: 'How are you so good?',
        text: 'Because customer is always right!'
    }
];

const Accordion: React.FunctionComponent = () => {
    return (
        <Wrapper>
            {data.map(item => {
                return <AccordionElement key={item.id} data={item}/>
            })}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    border: 1px solid black;
    width: 50%;
    margin: 1rem auto;
    padding: 1rem;
    background-color: lightgray;
`;

export default Accordion;