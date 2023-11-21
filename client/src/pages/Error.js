import styled from 'styled-components';
import {Link, useRouteError} from 'react-router-dom';

const Error = () => {
    const error = useRouteError();
    console.log(error);
    if (error.status === 404) {
        return (
            <Wrapper>
                <h1>404 Page Not Found</h1>
                <p>Oopsies! Looks like you don't know where your going. How about home?</p>
                <Link to='/'>Back Home</Link>
            </Wrapper>
        );
    }
    return (
        <Wrapper>

        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: lightcoral;
    a {
        display: block;
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

export default Error;