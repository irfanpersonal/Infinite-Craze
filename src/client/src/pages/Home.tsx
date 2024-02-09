import styled from 'styled-components';
import store from '../images/store.jpg';
import {Reviews, Accordion} from '../components';
import {Link} from 'react-router-dom';

const Home: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <img src={store} alt="An individual making a purchase"/>
            <h1 style={{margin: '1rem 0'}}>Infinite Craze is your ultimate destination for fulfilling all your limitless requirements!</h1>
            <Link to='/product'>Go to Products</Link>
            <h1 style={{margin: '1rem 0'}}>Check out what our totally real users said!</h1>
            <Reviews/>
            <h1 style={{margin: '1rem 0'}}>Need your questions answered? Check our FAQ!</h1>
            <Accordion/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    text-align: center;
    img {
        margin-top: 1rem;
        width: 15rem;
        height: 15rem;
        border: 1px solid black;
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
`;

export default Home;