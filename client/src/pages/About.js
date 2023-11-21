import styled from 'styled-components';

const About = () => {
    return (
        <Wrapper>
            <h1>Welcome to Infinite Craze - Your Ultimate Online Shopping Destination!</h1>
            <p>At Infinite Craze, we believe in making your shopping experience as effortless and enjoyable as possible. Our mission is simple: to provide you with a seamless and convenient platform where you can discover, explore, and indulge in an infinite array of products.</p>
            <h2>Why Choose Infinite Craze?</h2>
            <h3>Simplicity Redefined</h3>
            <p>Navigating through our website is as easy as a breeze. We've designed our platform with simplicity in mind, ensuring that you can effortlessly find what you're looking for without any hassle. No complicated menus or confusing interfaces - just a straightforward and user-friendly experience.</p>
            <h3>Diverse Selection</h3>
            <p>At Infinite Craze, we take pride in offering an extensive range of products to cater to every taste and preference. Whether you're searching for the latest fashion trends, cutting-edge electronics, or unique home decor items, we've got you covered. Our diverse selection ensures there's something for everyone in the Infinite Craze family.</p>
            <h3>Quality Assurance</h3>
            <p>We understand the importance of quality, and that's why we source our products from reputable suppliers and brands. Each item undergoes thorough quality checks to guarantee that you receive nothing but the best. Your satisfaction is our priority, and we stand by the quality of every product we offer.</p>
            <h4>Infinite Craze is not just an online store; it's a destination where simplicity meets variety, and customer satisfaction is paramount. Join us on this exciting journey of endless possibilities. Happy shopping!</h4>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    h1, p, h2, h3, h4 {
        text-align: center;
        margin-bottom: 1rem;
    }
`;

export default About;