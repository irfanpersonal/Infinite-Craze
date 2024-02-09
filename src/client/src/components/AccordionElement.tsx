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
        <article>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid black', margin: '1rem', backgroundColor: 'white'}}>
                <h1>{data.name}</h1>
                <button onClick={toggleShow}>{show ? '-' : '+'}</button>
            </div>
            {show && data.text}
        </article>
    );
}

export default AccordionElement;