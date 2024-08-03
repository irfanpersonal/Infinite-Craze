import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading} from '../components';
import {getStats} from '../features/stats/statsThunk';
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie} from 'recharts';

const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

const Stats: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {statsData, getStatsLoading} = useSelector((store: useSelectorType) => store.stats);
    const [viewBarChart, setViewBarChart] = React.useState(true);
    React.useEffect(() => {
        dispatch(getStats());
    }, []);
    return (
        <Wrapper>
            
            {getStatsLoading ? (
                <Loading title="Loading Stats" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div className="pad20 pageHeader"><h1 className="tCenter">Statistics</h1><p className="tCenter">Fine-tuned reporting metrics</p></div>
                    <div className="pad10">
                        <div className="stats-container">
                            <div className="stats-item">
                                <div className="stats-itemInner">Total Earnings: <span>${statsData!.totalEarnings}</span></div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-itemInner">Total Orders: <span>{statsData!.totalOrders}</span></div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-itemInner">Total Products: <span>{statsData!.totalProducts}</span></div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-itemInner">Total Reviews: <span>{statsData!.totalReviews}</span></div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-itemInner">Total Users: <span>{statsData!.totalUsers}</span></div>
                            </div>
                        </div>
                    </div>
                    {statsData!.ordersPerMonth.length > 0 ? (
                        <>
                            
                            <div className="chart-container">
                                {viewBarChart ? (
                                    <BarChart width={600} height={300} data={statsData!.ordersPerMonth.map(item => {
                                        const monthName = monthNames[item.month - 1];
                                        return { month: monthName, orders: item.count };
                                    })}>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="orders" fill="black"/>
                                    </BarChart>
                                ) : (
                                    <PieChart width={600} height={300}>
                                        <Pie dataKey="count" nameKey="month" data={statsData!.ordersPerMonth.map(item => {
                                            const monthName = monthNames[item.month - 1];
                                            return { month: monthName, count: item.count };
                                        })} fill="black" label/>
                                        <Tooltip/>
                                    </PieChart>
                                )}
                            </div>
                            <p className="chart-label" onClick={() => setViewBarChart(currentState => !currentState)}>{viewBarChart ? 'View Pie Chart' : 'View Bar Chart'}</p>
                        </>
                    ) : (
                        <h1 style={{textAlign: 'center'}}>Not Enough Data to Provide Chart!</h1>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    flex:1;
    display:flex;
    flex-direction:column;
    .pageHeader {
        border-top:1px solid #eeeeee;
    }
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    .stats-container {
        flex:1;
        display:flex;
        flex-direction:row;
        .stats-item {
            flex:1;
            display: flex;
            flex-direction: row;
            font-weight: 600;
            padding: 0px 10px;
        }
        .stats-itemInner {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid #eeeeee;
        }
    }
    .chart-label {
        margin: 1rem 0;
        text-align: center;
        cursor: pointer;
    }
    .chart-label:hover, .chart-label:active {
        color: gray;
    }
    .chart-container {
        flex:1;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
    }
    span {
        font-size:18px;
        font-weight:400;
        margin-top: 5px;
    }
`;

export default Stats;