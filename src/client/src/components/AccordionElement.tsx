import styled from 'styled-components';
import React from 'react';

interface AccordionElementProps {
    data: any
}

const AccordionElement: React.FunctionComponent<AccordionElementProps> = ({data}) => {
    const [show, setShow] = React.useState(false);
    const toggleShow = () => {
        setShow(currentState => {
            return !currentState;
        });
    }
    return (
        <Wrapper>
            <div onClick={toggleShow} className="accordianItem">
                <div className="row aCenter">
                    <h1>{data.name}</h1>
                    <button>{show ? '-' : '+'}</button>
                </div>
                {show && (
                    <div onClick={toggleShow} className="answer">
                        {data.text}
                    </div>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding: 1rem 0;
    border-bottom: 1px solid rgb(238, 238, 238);
    button {
        width: 40px;
        height: 40px;
        color: white;
        background-color: black; 
        cursor: pointer;
    }
    h1 {
        flex: 1;
        display: flex;
        cursor: pointer;
    }
    .answer {
        margin-top: 20px;
    }
`;

export default AccordionElement;