import { useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useOrders } from '@/hooks/useOrders.jsx'; 
import { useUsers } from '@/hooks/useUsers.jsx'; 
import RatingChart from './RatingChart';


export default function DashboardBoxes() { 
    const [orderQuery, setOrderQuery] = useState({
        range: 'all', 
        type: 'all', 
        page: 1, 
        limit: 10 
    }); 
    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        type: 'all', 
        page: 1, 
        limit: 10, 
        role: 'individual' 
    }); 

    const { orders, getOrders } = useOrders(orderQuery); 
    console.log(orders); 
    // console.log(orderQuery); 

    const { users, getUsers } = useUsers(userQuery); 
    console.log(users); 

    // Compute the Percentage Difference
    function calculatePercentageDifference(totalPaidLastMonth, totalPaidThisMonth) {
        const absoluteDifference = Math.abs(totalPaidLastMonth - totalPaidThisMonth);
        const average = (totalPaidLastMonth + totalPaidThisMonth) / 2;
        const percentageDifference = (absoluteDifference / average) * 100;
        return percentageDifference;
    } 

    // For Orders
    const totalPaidOrdersLastMonth = orders?.meta?.total_amount?.total_paid_last_month; 
    const totalPaidOrdersThisMonth = orders?.meta?.total_amount?.total_paid_this_month; 

    const monthlyOrderPercentageDifference = calculatePercentageDifference(totalPaidOrdersLastMonth, totalPaidOrdersThisMonth); 
    // End of For Orders

    // For New Clients
    const totalUsersLastMonth = users?.meta?.total_previous_results; 
    const totalUsersThisMonth = users?.meta?.total_results; 

    const usersPercentageDifference = calculatePercentageDifference(totalUsersLastMonth, totalUsersThisMonth); 
    // End of For New Clients
    // End of Compute the Percentage Difference 

    return (
        <section className="dashboard-boxes d-flex flex-column gap-4">
            <div className="line line-1">
                <section className="sales-purchase gap-4">
                    <div className="sales d-flex justify-content-between p-3 border-radius-25 box-shadow-1 bg-secondary text-white">
                        <div className="d-flex flex-column justify-content-between gap-2">
                            <h2 className="fs-6">Total Orders <span className="fw-semibold">({ orders?.meta?.total_results })</span></h2>
                            <span className="fs-4 fw-semibold">${ (orders?.meta?.total_amount?.total_paid)?.toLocaleString('en') }</span>
                        </div>
            
                        <div className="d-flex flex-column justify-content-between align-items-end gap-2">
                            <span className="dropdown">
                                <a className="text-decoration-none text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path
                                            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                    </svg> 
                                </a>

                                <ul className="dropdown-menu">
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => {
                                                await setOrderQuery(prevState => ({
                                                    ...prevState,
                                                    range: 'this-week'
                                                })); 
                                                await getOrders(orderQuery); 
                                            }}
                                            className="dropdown-item">
                                                This Week
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => {
                                                await setOrderQuery(prevState => ({
                                                    ...prevState,
                                                    range: 'this-month'
                                                })); 
                                                await getOrders(orderQuery); 
                                            }}
                                            className="dropdown-item">
                                                This Month
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                await setOrderQuery(prevState => ({
                                                    ...prevState,
                                                    range: 'this-year'
                                                })); 
                                                await getOrders(orderQuery);  
                                            }}
                                            className="dropdown-item">
                                                This Year
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                await setOrderQuery(prevState => ({
                                                    ...prevState,
                                                    range: 'all'
                                                })); 
                                                await getOrders(orderQuery); 
                                            }}
                                            className="dropdown-item">
                                                All Time
                                        </span>
                                    </li>
                                </ul>
                            </span>
                            <span className="d-flex justify-content-end align-items-center gap-1 flex-wrap">
                                <span className={`badge rounded-pill ${ (totalPaidOrdersLastMonth>totalPaidOrdersThisMonth) ? 'text-bg-danger' : 'text-bg-success'}`}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                            className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </span>
                                    <span>
                                        <small>
                                            { ((totalPaidOrdersLastMonth>totalPaidOrdersThisMonth)?'-':'+') }{ monthlyOrderPercentageDifference?.toFixed() }%
                                        </small>
                                    </span>
                                </span>
                                <span>
                                    <small>vs last month</small>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="purchase d-flex justify-content-between p-3 border-radius-25 box-shadow-1">
                        <div className="d-flex flex-column justify-content-between gap-2">
                            <h2 className="fs-6">Total Purchase</h2>
                            <span className="fs-4 fw-semibold">$240,592.00</span>
                        </div>
            
                        <div className="d-flex flex-column justify-content-between align-items-end gap-2">
                            <span className="dropdown">
                                <span className="text-decoration-none text-dark" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path
                                            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                    </svg> 
                                </span>

                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">This Week</a></li>
                                    <li><a className="dropdown-item" href="#">This Month</a></li>
                                    <li><a className="dropdown-item" href="#">This Year</a></li>
                                    <li><a className="dropdown-item" href="#">All Time</a></li>
                                </ul>
                            </span>
                            <span className="d-flex justify-content-end align-items-center gap-1 flex-wrap">
                                <span className="badge rounded-pill text-bg-danger">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                            className="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z" />
                                        </svg>
                                    </span>
                                    <span><small>-4%</small></span>
                                </span>
                                <span>
                                    <small>vs last month</small>
                                </span>
                            </span>
                        </div>
                    </div>
                </section>
            
                <div className="client-growth box-shadow-1 border-radius-25 p-3 d-flex flex-column gap-2">
                    <div>
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className="fs-6">Client Check-ins</h2> 
                            {/* <span className="menu cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                            </span> */}
                        </div>
                        
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li 
                                    type="button" 
                                    onClick={ async () => {
                                        await setUserQuery(prevState => ({
                                            ...prevState,
                                            range: 'all'
                                        })); 
                                        await getUsers(userQuery?.range); 
                                    }}
                                    className={`badge rounded-pill ${(userQuery?.range == 'all') ? `text-bg-dark` : `text-bg-secondary`}`}>
                                        <span>All</span>
                                </li>
                                <li 
                                    type="button" 
                                    onClick={ async () => {
                                        await setUserQuery(prevState => ({
                                            ...prevState,
                                            range: 'today'
                                        })); 
                                        await getUsers(userQuery?.range); 
                                    }}
                                    className={`badge rounded-pill ${(userQuery?.range == 'today') ? `text-bg-dark` : `text-bg-secondary`}`}>
                                        <span>Today</span>
                                </li>
                                <li 
                                    type="button" 
                                    onClick={ async () => {
                                        await setUserQuery(prevState => ({
                                            ...prevState,
                                            range: 'week'
                                        })); 
                                        await getUsers(userQuery?.range); 
                                    }}
                                    className={`badge rounded-pill ${(userQuery?.range == 'week') ? `text-bg-dark` : `text-bg-secondary`}`}>
                                        <span>A Week</span>
                                </li> 
                                <li 
                                    type="button" 
                                    onClick={ async () => {
                                        await setUserQuery(prevState => ({
                                            ...prevState,
                                            range: 'month'
                                        })); 
                                        await getUsers(userQuery?.range); 
                                    }}
                                    className={`badge rounded-pill ${(userQuery?.range == 'month') ? `text-bg-dark` : `text-bg-secondary`}`}>
                                        <span>A Month</span>
                                </li> 
                                <li 
                                    type="button" 
                                    onClick={ async () => {
                                        await setUserQuery(prevState => ({
                                            ...prevState,
                                            range: 'year'
                                        })); 
                                        await getUsers(userQuery?.range); 
                                    }}
                                    className={`badge rounded-pill ${(userQuery?.range == 'year') ? `text-bg-dark` : `text-bg-secondary`}`}>
                                        <span>A Year</span>
                                </li> 
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="fw-semibold fs-4">{ (users?.meta?.total_results)?.toLocaleString('en') }</span>
                        <span className="badge rounded-pill text-bg-success">
                            { (totalUsersThisMonth>totalUsersLastMonth) ? 
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-up-right"
                                    viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </span> :
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                    className="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z" />
                                </svg>
                            </span> }
                            <span>
                                <small>
                                    { (((totalUsersThisMonth>totalUsersLastMonth) && !isNaN(usersPercentageDifference?.toFixed()))?'+':'-') }
                                    { isNaN(usersPercentageDifference?.toFixed())?'0':usersPercentageDifference?.toFixed() }%
                                </small>
                            </span>
                        </span>
                    </div> 

                    <div>
                        <meter id="fuel" min="0" max="100" low="33" high="66" optimum="80" value={ usersPercentageDifference?.toFixed() }>at 50/100</meter>
                    </div> 

                    <div className="d-flex align-items-center justify-content-between fw-semibold">
                        <small>Check-ins totally</small> 
                        <small>{ ((users?.meta?.total_today)>0)&&'+' }{ (users?.meta?.total_today)?.toLocaleString('en') } today</small>
                    </div>
                </div>
            
                <div className="customers-volume box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <h2 className="fs-6">Client Growth</h2>
                        <span className="dropdown">
                            <a className="text-decoration-none text-dark" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-three-dots" viewBox="0 0 16 16">
                                    <path
                                        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg> 
                            </a>

                            <ul className="dropdown-menu">
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => {
                                            await setUserQuery(prevState => ({
                                                ...prevState,
                                                range: 'today'
                                            })); 
                                            await getUsers(userQuery); 
                                        }}
                                        className="dropdown-item">
                                            Today
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => {
                                            await setUserQuery(prevState => ({
                                                ...prevState,
                                                range: 'week'
                                            })); 
                                            await getUsers(userQuery); 
                                        }}
                                        className="dropdown-item">
                                            This Week
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => {
                                            await setUserQuery(prevState => ({
                                                ...prevState,
                                                range: 'month'
                                            })); 
                                            await getUsers(userQuery); 
                                        }}
                                        className="dropdown-item">
                                            This Month
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            await setUserQuery(prevState => ({
                                                ...prevState,
                                                range: 'year'
                                            })); 
                                            await getUsers(userQuery);  
                                        }}
                                        className="dropdown-item">
                                            This Year
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            await setUserQuery(prevState => ({
                                                ...prevState,
                                                range: 'all'
                                            })); 
                                            await getUsers(userQuery); 
                                        }}
                                        className="dropdown-item">
                                            All Time
                                    </span>
                                </li>
                            </ul>
                        </span>
                    </div> 

                    <div className="d-flex flex-column">
                        <span className="fs-4 fw-semibold">{ (users?.meta?.total_results)?.toLocaleString('en') }</span> 
                        <span>New Clients</span>
                    </div> 

                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <span className="border border-1 border-secondary border-radius-35 px-3" style={{ fontSize: '0.75rem' }}>Client volume { ((totalUsersLastMonth>totalUsersThisMonth)?'decreased':'increased') }</span>
                        <span className={`badge rounded-pill ${ ((totalUsersLastMonth>totalUsersThisMonth)?'text-bg-danger':'text-bg-success') }`}>
                            { (totalUsersThisMonth>totalUsersLastMonth) ? 
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-up-right"
                                    viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                </svg>
                            </span> :
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                    className="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z" />
                                </svg>
                            </span> }
                            <span>
                                <small>
                                    { (((totalUsersThisMonth>totalUsersLastMonth) && !isNaN(usersPercentageDifference?.toFixed()))?'+':'-') }
                                    { isNaN(usersPercentageDifference?.toFixed())?'0':usersPercentageDifference?.toFixed() }%
                                </small>
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="line line-2">
                <div className="statistics box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                            <h2 className="fs-6">Statistics</h2>
                            <span className="badge rounded-pill text-bg-success p-2">
                                Ratings
                            </span>
                        </div>
                        <div>
                            <span className="badge rounded-pill text-bg-secondary">
                                Weekly
                            </span> 
                            <span className="menu cursor-pointer ms-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                            </span>
                        </div>
                    </div> 

                    <div className="row">
                        <div className="d-flex flex-column gap-1 col-3">
                            <span className="fw-semibold fs-4">+72%</span>
                            <small>Customer satisfaction increase from last week</small>
                        </div>

                        <section className="col-9">
                            {/* <div className="chart-bars">
                                <span className="mon bg-secondary cursor-pointer" style={{ height: '2rem', minWidth: '1.7rem' }}></span>
                                <span className="tue bg-secondary cursor-pointer" style={{ height: '4rem', minWidth: '1.7rem' }}></span>
                                <span className="wed bg-secondary cursor-pointer" style={{ height: '6rem', minWidth: '1.7rem' }}></span>
                                <span className="thu bg-secondary cursor-pointer" style={{ height: '3.5rem', minWidth: '1.7rem' }}></span>
                                <span className="fri bg-secondary cursor-pointer" style={{ height: '2.5rem', minWidth: '1.7rem' }}></span>
                                <span className="sat bg-secondary cursor-pointer" style={{ height: '4.5rem', minWidth: '1.7rem' }}></span>
                                <span className="sun bg-secondary cursor-pointer" style={{ height: '2rem', minWidth: '1.7rem' }}></span>
                            </div> */} 
                            <RatingChart />
                        </section>
                    </div>
                </div> 

                <div className="orders box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2" style={{ background: 'url(https://c8.alamy.com/comp/2K69C8B/map-of-setagaya-city-urban-black-and-white-poster-road-map-image-with-metropolitan-city-area-view-2K69C8B.jpg)', backgroundSize: 'cover' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <h2 className="fs-6" style={{ textShadow: '2px 2px white, -2px -2px white' }}>Most Order by Client</h2>
                        {/* <span className="menu cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots"
                                viewBox="0 0 16 16">
                                <path
                                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                            </svg>
                        </span> */}
                    </div>

                    <section>
                        {/* (orders?.data?.length > 1) && (orders?.data?.map((order, index) => { */}
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            { (orders?.meta?.top_3?.length > 0) && ((orders?.meta?.top_3)?.map((order, index) => {
                                return (
                                    <li 
                                        key={index} 
                                        className={`d-flex align-items-center justify-content-between 
                                                    ${(index==0) ? `bg-success` 
                                                        : (index==1) ? `bg-secondary` 
                                                        : `bg-white`} 
                                                    border-radius-35 px-3 
                                                    ${((index==0)||index==1) ? `text-white` : `text-dark`} 
                                                    py-1`} 
                                        style={{
                                            width: (index == 0) ? '100%' 
                                                    : (index == 1) ? '95%'
                                                    : '90%'
                                        }}>
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                <img src="https://plus.unsplash.com/premium_photo-1683140621573-233422bfc7f1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                    className={`object-fit-cover border border-2 ${(index==2) ? `border-secondary` : `border-white`}`} style={{ width: '40px', height: '40px', borderRadius: '50px' }}
                                                    alt="" />
                                            </span> 
                                            <span className="d-flex flex-column">
                                                <small className="fw-semibold">{ order?.user?.first_name + ' ' + order?.user?.last_name }</small>
                                                <small className=""><small>${ (order?.total_to_be_paid)?.toLocaleString('en') }, { dayjs.utc(order?.created_at).fromNow() }</small></small>
                                            </span>
                                        </span>
                                        
                                        <span>{ order?.state_region }</span>
                                        <span>#{index+1}</span>
                                    </li>
                                )
                            }))}
                        </ul>
                    </section>
                </div>
            </div>
        </section>
    )
}
