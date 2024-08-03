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
            <form className="orderFilters" onSubmit={handleSubmit}>
                {role === 'admin' && (
                    <div className="orderFilterItem">
                        <div className="orderFilterSubItem">
                            <label htmlFor="username">Find</label>
                            <input placeholder='Filter by name' id="username" type="search" name="username" value={searchBoxValues.username} onChange={handleChange}/>
                        </div>
                    </div>
                )}
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <label htmlFor="date-range">Date Range</label>
                        <input id="date-range" type="date" name="startDate" value={moment(searchBoxValues.startDate).utc().format('YYYY-MM-DD')} onChange={handleChange}/> 
                    </div>
                </div>
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <span>To</span>
                        <input id="date-range" type="date" name="endDate" value={moment(searchBoxValues.endDate).utc().format('YYYY-MM-DD')} onChange={handleChange}/> 
                    </div>
                </div>
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <label htmlFor="total-range">Total Range</label>
                        <input placeholder='$ Min' min="1" id="total-range" type="number" name="minimumTotal" value={searchBoxValues.minimumTotal} onChange={handleChange}/> 
                    </div>
                </div>
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <span>To</span>
                        <input placeholder='$ Max' min="1" id="total-range" type="number" name="maximumTotal" value={searchBoxValues.maximumTotal} onChange={handleChange}/> 
                    </div>
                </div>
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <label htmlFor="orderStatus">Order Status</label>
                        <select id="orderStatus" name="orderStatus" value={searchBoxValues.orderStatus} onChange={handleChange}>
                            <option value=""></option>
                            <option value="paid">Paid</option>
                            <option value="preparing">Preparing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
                <div className="orderFilterItem">
                    <div className="orderFilterSubItem">
                        <label htmlFor="sortBy">Sort By</label>
                        <select id="sortBy" name="sortBy" value={searchBoxValues.sortBy} onChange={handleChange}>
                            <option value=""></option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>
                <button type="submit" disabled={ordersLoading}>{ordersLoading ? 'Searching' : 'Search'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        flex:1;
        padding:10px;
        display:flex;
        flex-direction:row;
        align-items:flex-end;
        label , span {
            display: block;
            margin-bottom: 10px;
        }
        input, select {
            padding:10px;
            border-radius:0px;
        }
        button {
            margin:10px;
            height:42px;
            width:initial;
            border: none;
            padding:0px 15px;
            background-color:#f9f9f9;
            border:1px solid #eeeeee;
        }
        .orderFilterItem {
            flex:1;
            display:flex;
            flex-direction:row;
        }
        .orderFilterSubItem {
            flex:1;
            padding: 10px;
            display:flex;
            flex-direction:column;
        }
    }
`;

export default SearchOrdersBox;