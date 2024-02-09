import {useDispatch} from 'react-redux';
import moment from 'moment';
import {type useDispatchType} from '../store';
import styled from 'styled-components';

interface SearchOrdersBoxProps {
    searchBoxValues: {
        username: string,
        startDate: Date | '',
        endDate: Date | '',
        minimumTotal: number | '',
        maximumTotal: number | '',
        orderStatus: 'paid' | 'preparing' | 'shipped' | 'delivered' | '',
        sortBy: 'newest' | 'oldest' | ''
    },
    updateSearchBoxValues: Function,
    updateSearch: Function,
    id?: string,
    setPage: Function,
    ordersLoading: boolean,
    role: 'user' | 'admin'
}

const SearchOrdersBox: React.FunctionComponent<SearchOrdersBoxProps> = ({searchBoxValues, updateSearchBoxValues, updateSearch, id, setPage, ordersLoading, role}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(setPage(1));
        dispatch(updateSearch(id));
    }
    const handleChange = (event: React.ChangeEvent) => {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        dispatch(updateSearchBoxValues({name: target.name, value: target.value}));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                {role === 'admin' && (
                    <div>
                        <input placeholder='Find Orders based off User Name' id="username" type="search" name="username" value={searchBoxValues.username} onChange={handleChange}/>
                    </div>
                )}
                <div>
                    <label htmlFor="date-range">Date Range</label>
                    <input id="date-range" type="date" name="startDate" value={moment(searchBoxValues.startDate).utc().format('YYYY-MM-DD')} onChange={handleChange}/> 
                    to
                    <input id="date-range" type="date" name="endDate" value={moment(searchBoxValues.endDate).utc().format('YYYY-MM-DD')} onChange={handleChange}/> 
                </div>
                <div>
                    <label htmlFor="total-range">Total Range</label>
                    <input placeholder='$ Min' min="1" id="total-range" type="number" name="minimumTotal" value={searchBoxValues.minimumTotal} onChange={handleChange}/> 
                    to 
                    <input placeholder='$ Max' min="1" id="total-range" type="number" name="maximumTotal" value={searchBoxValues.maximumTotal} onChange={handleChange}/> 
                </div>
                <div>
                    <label htmlFor="orderStatus">Order Status</label>
                    <select id="orderStatus" name="orderStatus" value={searchBoxValues.orderStatus} onChange={handleChange}>
                        <option value=""></option>
                        <option value="paid">Paid</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sortBy">Sort By</label>
                    <select id="sortBy" name="sortBy" value={searchBoxValues.sortBy} onChange={handleChange}>
                        <option value=""></option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
                <button type="submit" disabled={ordersLoading}>{ordersLoading ? 'Searching' : 'Search'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        margin: 1rem 0;
        outline: 1px solid black;
        label {
            display: block;
            margin-top: 0.5rem;
        }
        input, select {
            margin-bottom: 0.5rem;
        }
        input, select, button {
            width: 100%;
            padding: 0.25rem;
        }
        button {
            border: none;
            border-top: 1px solid black;
            margin-top: 0.5rem;
        }
    }
`;

export default SearchOrdersBox;