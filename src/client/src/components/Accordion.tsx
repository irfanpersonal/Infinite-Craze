import styled from 'styled-components';
import AccordionElement from './AccordionElement';
import {nanoid} from 'nanoid';

const data = [
    {
        id: nanoid(),
        name: 'Why is this the best Ecommerce Store?',
        text: 'At Infinite Craze, we pride ourselves on offering an exceptional shopping experience. Our store stands out due to our extensive selection of high-quality products, competitive pricing, and outstanding customer service. We carefully curate our inventory to ensure that every item meets our rigorous standards, and our user-friendly website makes shopping both enjoyable and efficient. With secure checkout and fast, reliable shipping, we make it easy for you to get what you need when you need it.'
    },
    {
        id: nanoid(),
        name: 'Why should we trust you?',
        text: 'Trust is at the heart of everything we do at Infinite Craze. We are committed to transparency and integrity, providing clear product information, genuine customer reviews, and straightforward policies. Our secure payment system ensures your personal information is protected, and our dedicated customer support team is always available to assist you with any concerns. We’re proud of the positive feedback from our satisfied customers and our reputation for reliability and excellence in the ecommerce space.'
    },
    {
        id: nanoid(),
        name: 'Whats next for Infinite Craze?',
        text: 'We are continuously evolving to enhance your shopping experience. In the coming months, we plan to expand our product range, introduce new and innovative features on our website, and launch exclusive deals and promotions. Our focus will also be on improving our sustainability practices and ensuring that we provide even more value to our customers. Stay tuned for exciting updates and developments as we continue to grow and innovate.'
    },
    {
        id: nanoid(),
        name: 'What are your plans in the next 10 years?',
        text: 'Over the next decade, Infinite Craze aims to become a leading global ecommerce destination. We plan to broaden our product offerings, enter new markets, and leverage emerging technologies to offer a cutting-edge shopping experience. Our commitment to sustainability and ethical practices will guide our growth, and we envision creating new opportunities for our customers, employees, and partners. By staying at the forefront of industry trends and maintaining our dedication to exceptional service, we aim to build lasting relationships and continue delivering outstanding value.'
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
    padding:20px;
`;

export default Accordion;