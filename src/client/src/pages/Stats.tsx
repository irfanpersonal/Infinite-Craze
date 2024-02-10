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
            <h1 className="title">Stats</h1>
            {getStatsLoading ? (
                <Loading title="Loading Stats" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div className="stats-container">
                        <div className="stats-item">Total Earnings: ${statsData!.totalEarnings}</div>
                        <div className="stats-item">Total Orders: {statsData!.totalOrders}</div>
                        <div className="stats-item">Total Products: {statsData!.totalProducts}</div>
                        <div className="stats-item">Total Reviews: {statsData!.totalReviews}</div>
                        <div className="stats-item">Total Users: {statsData!.totalUsers}</div>
                    </div>
                    {statsData!.ordersPerMonth.length > 0 ? (
                        <>
                            <p className="chart-label" onClick={() => setViewBarChart(currentState => !currentState)}>{viewBarChart ? 'View Pie Chart' : 'View Bar Chart'}</p>
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
    padding: 1rem;
    .title {
        text-align: center;
        background-color: black;
        color: white;
    }
    .stats-container {
        .stats-item {
            outline: 1px solid black;
            margin: 1rem 0;
            padding: 1rem;
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
        background-color: lightgray;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export default Stats;