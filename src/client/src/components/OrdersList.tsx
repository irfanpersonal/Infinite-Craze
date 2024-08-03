import React from 'react';
import styled from 'styled-components';
import OrdersListItem from './OrdersListItem';
import {type OrderType} from '../features/orders/ordersSlice';
import {nanoid} from 'nanoid';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

type ViewType = 'grid' | 'list';

interface OrderListProps {
    data: OrderType[],
    totalOrders: number
}

const OrdersList: React.FunctionComponent<OrderListProps> = ({data, totalOrders}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <Wrapper>
            <div className="order-info">
                <h1 className="">{totalOrders} Order{totalOrders! > 1 && 's'} Found.</h1>
                <div>
                    <MdGridView onClick={() => setViewType(currentState => 'grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`}/>
                    <GiHamburgerMenu onClick={() => setViewType(currentState => 'list')} className={`view-type ${viewType === 'list' && 'active-type'}`}/>
                </div>
            </div>
            <div className={`${viewType === 'grid' && 'grid-styling'}`}>
                {data.map(item => {
                    return (
                        <OrdersListItem key={nanoid()} data={item}/>
                    );
                })}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .order-info {
        padding:20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:1px solid #eeeeee;
    }
    .view-type {
        margin-left:10px;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0.25rem;
        border: 1px solid black;
    }
    .active-type {
        filter:invert(1);
        background-color: #FFFFFF;
    }
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
`;

export default OrdersList;