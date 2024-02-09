import React from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {categories, conditions, sortValues} from '../utils';
import {FaArrowAltCircleUp, FaArrowCircleDown, FaArrowAltCircleRight} from "react-icons/fa";
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
    const [showCategory, setShowCategory] = React.useState(true);
    const [showCondition, setShowCondition] = React.useState(true);
    const [showPriceRange, setShowPriceRange] = React.useState(true);
    const [showSort, setShowSort] = React.useState(true);
    return (
        <Wrapper>
            <div>
                <div className="filter-option">
                    <div className="filter-name">Condition</div>
                    <div onClick={() => setShowCondition(currentState => !currentState)}>{showCondition ? <FaArrowAltCircleUp/> : <FaArrowCircleDown/>}</div>
                </div>
                {showCondition && (
                    <>
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
                                }} style={{backgroundColor: searchBoxValues.state === condition ? 'gray' : ''}} className="filter-option-value" key={nanoid()}>{condition}</div>
                            );
                        })}
                    </>
                )}
            </div>
            <div>
                <div className="filter-option">
                    <div className="filter-name">Price Range</div>
                    <div onClick={() => setShowPriceRange(currentState => !currentState)}>{showPriceRange ? <FaArrowAltCircleUp/> : <FaArrowCircleDown/>}</div>
                </div>
                {showPriceRange && (
                    <div>
                        <div className="price-range">
                            <input style={{width: '50%'}} type="number" value={searchBoxValues.minimumBudget} onChange={(event) => {
                                dispatch(updateSearchBoxValues({name: 'minimumBudget', value: event.target.value}));
                            }} placeholder='$ Min'/>
                            <span style={{margin: '0 0.25rem'}}>to</span>
                            <input style={{width: '50%'}} type="number" value={searchBoxValues.maximumBudget} onChange={(event) => {
                                dispatch(updateSearchBoxValues({name: 'maximumBudget', value: event.target.value}));
                            }} placeholder='$ Max'/>
                            <button type="button" onClick={() => {
                                dispatch(setPage(1));
                                dispatch(updateSearch(id));
                            }}><FaArrowAltCircleRight/></button>
                        </div>
                    </div>
                )}
            </div>
            <div style={{marginTop: '0.25rem'}}>
                <div className="filter-option">
                    <div className="filter-name">Sort</div>
                    <div onClick={() => setShowSort(currentState => !currentState)}>{showSort ? <FaArrowAltCircleUp/> : <FaArrowCircleDown/>}</div>
                </div>
                {showSort && (
                    <>
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
                                }} style={{backgroundColor: searchBoxValues.sort === sort ? 'gray' : ''}} className="filter-option-value" key={nanoid()}>{sort}</div>
                            );
                        })}
                    </>
                )}
            </div>
            <div>
                <div className="filter-option">
                    <div className="filter-name">Category</div>
                    <div onClick={() => setShowCategory(currentState => !currentState)}>{showCategory ? <FaArrowAltCircleUp/> : <FaArrowCircleDown/>}</div>
                </div>
                {showCategory && (
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
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    #category {
        width: 100%;
        margin-bottom: 0.25rem;
    }
    .filter-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin-bottom: 0.5rem;
    }
    .filter-option-value {
        text-transform: capitalize;
        outline: 1px solid black;
        margin-bottom: 0.5rem;
        padding-left: 0.5rem;
    }
    .price-range {
        display: flex;
    }
`;

export default FilterBox;