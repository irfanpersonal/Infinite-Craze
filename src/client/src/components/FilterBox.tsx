import React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {categories, conditions, sortValues} from '../utils';
import {FaAngleUp, FaAngleDown, FaMagnifyingGlass} from "react-icons/fa6";
import {nanoid} from 'nanoid';

interface FilterBoxProps {
    searchBoxValues: {
        search: string,
        category: '' | 'electronics' | 'apparel' | 'home' | 'beauty' | 'books' | 'sports' | 'games' | 'health' | 'grocery' | 'tools',
        state: '' | 'new' | 'used' | 'refurbished' | 'damaged',
        minimumBudget: string,
        maximumBudget: string,
        sort: '' | 'a-z' | 'z-a' | 'lowest' | 'highest',
    },
    updateSearchBoxValues: Function,
    updateSearch: Function,
    id?: string,
    setPage: Function,
    productsLoading: boolean
}

const FilterBox: React.FunctionComponent<FilterBoxProps> = ({searchBoxValues, updateSearchBoxValues, updateSearch, id, setPage, productsLoading}) => {
    const dispatch = useDispatch<useDispatchType>();
    const [showCategory, setShowCategory] = React.useState(false);
    const [showCondition, setShowCondition] = React.useState(true);
    const [showPriceRange, setShowPriceRange] = React.useState(false);
    const [showSort, setShowSort] = React.useState(false);
    return (
        <Wrapper>
            {/* <h2 className="pad10">Filter Results</h2> */}
            <div className="filterGroup">
                <div className="filter-option" onClick={() => setShowCondition(currentState => !currentState)}>
                    <div className="filter-name">Condition</div>
                    <div>{showCondition ? <FaAngleUp/> : <FaAngleDown/>}</div>
                </div>

                
                {showCondition && (
                    <>
                        <div className="filterOptionSet">
                        {conditions.map(condition => {
                            return (
                                <div onClick={() => {
                                    if (searchBoxValues.state === condition) {
                                        dispatch(updateSearchBoxValues({name: 'state', value: ''}));
                                        dispatch(setPage(1));
                                        dispatch(updateSearch(id));
                                        return;
                                    }
                                    dispatch(updateSearchBoxValues({name: 'state', value: condition}));
                                    dispatch(setPage(1));
                                    dispatch(updateSearch(id));
                                }} 
                                    className={searchBoxValues.state === condition ? 'filter-option-value active' : 'filter-option-value'}
                                    key={nanoid()}>
                                        {condition}
                                </div>
                            );
                        })}
                       </div>
                    </>
                )}
            </div>
            <div className="filterGroup">
                <div className="filter-option" onClick={() => setShowPriceRange(currentState => !currentState)}>
                    <div className="filter-name">Price Range</div>
                    <div>{showPriceRange ? <FaAngleUp/> : <FaAngleDown/>}</div>
                </div>
                {showPriceRange && (
                    <div className="filterOptionSet">
                        <div className="price-range">
                            <input style={{width: '50%'}} type="number" value={searchBoxValues.minimumBudget} onChange={(event) => {
                                dispatch(updateSearchBoxValues({name: 'minimumBudget', value: event.target.value}));
                            }} placeholder='$ Min'/>
                            <span style={{margin: '0 0.25rem'}}>to</span>
                            <input style={{width: '50%'}} type="number" value={searchBoxValues.maximumBudget} onChange={(event) => {
                                dispatch(updateSearchBoxValues({name: 'maximumBudget', value: event.target.value}));
                            }} placeholder='$ Max'/>
                            <button type="button" className="priceSearch" onClick={() => {
                                dispatch(setPage(1));
                                dispatch(updateSearch(id));
                            }}><FaMagnifyingGlass/></button>
                        </div>
                    </div>
                )}
            </div>
            <div className="filterGroup">
                <div className="filter-option" onClick={() => setShowSort(currentState => !currentState)}>
                    <div className="filter-name">Sort</div>
                    <div>{showSort ? <FaAngleUp/> : <FaAngleDown/>}</div>
                </div>
                {showSort && (
                    <>
                        <div className="filterOptionSet">
                        {sortValues.map(sort => {
                            return (
                                <div onClick={() => {
                                    if (searchBoxValues.sort === sort) {
                                        dispatch(updateSearchBoxValues({name: 'sort', value: ''}));
                                        dispatch(setPage(1));
                                        dispatch(updateSearch(id));
                                        return;
                                    }
                                    dispatch(updateSearchBoxValues({name: 'sort', value: sort}));
                                    dispatch(setPage(1));
                                    dispatch(updateSearch(id));
                                }} className={searchBoxValues.sort === sort ? 'filter-option-value active' : 'filter-option-value'} key={nanoid()}>{sort}</div>
                            );
                        })}
                        </div>
                    </>
                )}
            </div>
            <div className="filterGroup">
                <div className="filter-option" onClick={() => setShowCategory(currentState => !currentState)}>
                    <div className="filter-name">Category</div>
                    <div>{showCategory ? <FaAngleUp/> : <FaAngleDown/>}</div>
                </div>
                {showCategory && (
                    <div className="categoryWrapper filterOptionSet">
                    <select id="category" name="category" value={searchBoxValues.category} onChange={(event) => {
                        dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        dispatch(setPage(1));
                        dispatch(updateSearch(id));
                    }}>
                        {categories.map(category => {
                            return (
                                <option key={nanoid()} value={category}>{category}</option>
                            );
                        })}
                    </select>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    padding: 10px;
    display: flex;
    flex-direction: column;
    #category {
        width: 100%;
        border-width:0px;
        outline:1px solid #eeeeee;
        border-right: 16px solid transparent
    }
    .filter-option {
        padding: 10px 0px;
        font-weight:600;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .filter-option-value {
        margin:10px 0px;
        padding:0px 0px 0px 30px;
        position:relative;
        text-transform:capitalize;
    }
    .filter-option-value::before {
        content:'';
        left:0px;
        top:0px;
        bottom:0px;
        margin:auto;
        width:14px;
        height:14px;
        border-radius:999px;
        position:absolute;
        background-color:#eeeeee;
    }
    .filter-option-value.active::before {
        background-color:#000000;
    }
    .filter-option-value.active::after {
        content:'';
        left:4px;
        top:0px;
        bottom:0px;
        margin:auto;
        width:6px;
        height:6px;
        border-radius:999px;
        position:absolute;
        background-color:#ffffff;
    }
    .price-range {
        padding:10px 0px;
        display: flex;
        flex-direction:row;
        align-items:center;
    }
    .priceSearch {
        width:42px;
        height:42px;
        min-width:42px;
        border-width:0px;
        border-radius:10px;
        margin-left: 10px;
        background-color:#f9f9f9;
        border:1px solid #eeeeee;
    }
    #category {
        text-transform:capitalize;
    }
    .categoryWrapper {
        padding:10px 0px;
    }
    .filterGroup {
        margin: 0px 10px;
        padding: 10px 0px;
        border-radius: 2px;
        position:relative;
        border-bottom: 1px solid #eee;
    }
    .filter-name {
        white-space:nowrap;
    }
`;

export default FilterBox;