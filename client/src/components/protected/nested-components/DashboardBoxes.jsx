import { useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import MapBackgroundImage from '@/assets/images/map.jpg'; 
import UserNoImage from '@/assets/images/user-icon.jpg'; 
import { useCheckIns } from '@/hooks/dashboard/useCheckIns.jsx'; 
import { useClientsGrowth } from '@/hooks/dashboard/useClientsGrowth.jsx'; 
import { useOrders } from '@/hooks/dashboard/useOrders.jsx'; 
import { usePurchases } from '@/hooks/dashboard/usePurchases.jsx'; 
import { useRatings } from '@/hooks/dashboard/useRatings.jsx'; 
import RatingChart from './RatingChart';


export default function DashboardBoxes() { 
    const [checkInRange, setCheckInRange] = useState('all'); 
    const [clientGrowthRange, setClientGrowthRange] = useState('all'); 
    const [orderRange, setOrderRange] = useState('all'); 
    const [purchaseRange, setPurchaseRange] = useState('all'); 
    const [ratingsRange, setRatingsRange] = useState('all'); 
    
    // console.log(orderRange); 

    const { checkIns, getCheckIns } = useCheckIns(checkInRange); 
    const { clientsGrowth, getClientsGrowth } = useClientsGrowth(clientGrowthRange); 
    const { orders, getOrders } = useOrders(orderRange); 
    const { purchases, getPurchases } = usePurchases(purchaseRange); 
    const { ratings, getRatings } = useRatings(ratingsRange); 

    // console.log(checkIns); 
    // console.log(clientsGrowth); 
    // console.log(orders); 
    // console.log(purchases); 
    // console.log(ratings); 

    /** Compute the Percentage Difference */ 
    function calculatePercentageDifference(totalPaidThisMonth, totalPaidLastMonth) {
        const absoluteDifference = Math.abs(totalPaidThisMonth - totalPaidLastMonth);
        const average = (totalPaidThisMonth + totalPaidLastMonth) / 2;
        const percentageDifference = (absoluteDifference / average) * 100;
        return percentageDifference || 0;
    } 
    /** End of Compute the Percentage Difference */ 

    /** For Clients Growth */ 
    const totalClientsGrowthCurrent = clientsGrowth?.data?.total_amount?.clients; 
    const totalClientsGrowthPrevious = clientsGrowth?.data?.total_amount?.clients_previous; 

    const clientsGrowthPercentageDifference = calculatePercentageDifference(totalClientsGrowthCurrent, totalClientsGrowthPrevious); 
    /** End of For ClientsGrowth */ 

    /** For Check-Ins */ 
    const totalCheckInsCurrent = checkIns?.data?.total_amount?.check_ins; 
    const totalCheckInsPrevious = checkIns?.data?.total_amount?.check_ins_previous; 

    const checkInPercentageDifference = calculatePercentageDifference(totalCheckInsCurrent, totalCheckInsPrevious); 
    /** End of For CheckIns */ 

    /** For Purchases */ 
    const totalPurchasesCurrent = Number(purchases?.data?.total_amount?.total_paid); 
    const totalPurchasesPrevious = Number(purchases?.data?.total_amount?.total_paid_previous); 

    const purchasePercentageDifference = calculatePercentageDifference(totalPurchasesCurrent, totalPurchasesPrevious); 
    /** End of For Purchases */ 

    /** For Orders */ 
    const totalOrdersCurrent = orders?.data?.total_amount?.total_paid; 
    const totalOrdersPrevious = orders?.data?.total_amount?.total_paid_previous; 

    const orderPercentageDifference = calculatePercentageDifference(totalOrdersCurrent, totalOrdersPrevious); 
    /** End of For Orders */ 

    /** For Ratings */ 
    const totalRatingsCurrent = ratings?.data?.total_amount?.ratings; 
    const totalRatingsPrevious = ratings?.data?.total_amount?.ratings_previous; 

    let totalSatisfactionCurrent = 0, totalSatisfactionPrevious = 0;

    for (const key in totalRatingsCurrent) {
        if (totalRatingsCurrent.hasOwnProperty(key)) {
            if (totalRatingsCurrent['5_star'] || totalRatingsCurrent['4_star']) totalSatisfactionCurrent += totalRatingsCurrent[key];
        }
    }

    for (const key in totalRatingsPrevious) {
        if (totalRatingsPrevious.hasOwnProperty(key)) {
            if (totalRatingsPrevious['5_star'] || totalRatingsPrevious['4_star']) totalSatisfactionPrevious += totalRatingsPrevious[key];
        }
    }

    const ratingPercentageDifference = calculatePercentageDifference(totalSatisfactionCurrent, totalSatisfactionPrevious); 
    /** End of For Ratings */ 

    /** End of Compute the Percentage Difference */  

    return (
        <section className="dashboard-boxes d-flex flex-column gap-4">
            <div className="line line-1">
                <section className="order-purchase gap-4">
                    <div className="order d-flex justify-content-between p-3 border-radius-25 box-shadow-1 bg-secondary text-white">
                        <div className="d-flex flex-column justify-content-between gap-2">
                            <h2 className="fs-6">Total Orders&nbsp;<span className="fw-semibold">({ orders?.data?.total_results })</span></h2>
                            <span className="fs-4 fw-semibold">${ (orders?.data?.total_amount?.total_paid)?.toLocaleString('en') }</span>
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
                                                setOrderRange('today'); 
                                                await getOrders(orderRange); 
                                            }}
                                            className="dropdown-item">
                                                Today
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setOrderRange('this-week'); 
                                                await getOrders(orderRange); 
                                            }}
                                            className="dropdown-item">
                                                This Week
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setOrderRange('this-month');
                                                await getOrders(orderRange); 
                                            }}
                                            className="dropdown-item">
                                                This Month
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setOrderRange('this-year'); 
                                                await getOrders(orderRange);  
                                            }}
                                            className="dropdown-item">
                                                This Year
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setOrderRange('all'); 
                                                await getOrders(orderRange); 
                                            }}
                                            className="dropdown-item">
                                                All Time
                                        </span>
                                    </li>
                                </ul>
                            </span>
                            { (orderRange != 'all') && 
                                <span className="d-flex justify-content-end align-items-center gap-1 flex-wrap">
                                    <span className={`badge rounded-pill ${ ((totalOrdersPrevious>totalOrdersCurrent)||(totalOrdersPrevious==totalOrdersCurrent)) 
                                        ? 'text-bg-danger' : 'text-bg-success'}`}>
                                        <span>
                                            { (totalOrdersPrevious<totalOrdersCurrent) 
                                                ?   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                                        className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                            d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                                    </svg> 
                                                : (totalOrdersPrevious>totalOrdersCurrent) 
                                                    ?   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
                                                        </svg> 
                                                        : '' }
                                        </span>
                                        <span> 
                                            <small>
                                                { (((totalOrdersPrevious>totalOrdersCurrent)&&(Number(orderPercentageDifference)?.toFixed()!=0))
                                                    ? '-'
                                                        : ((totalOrdersPrevious<totalOrdersCurrent)&&(Number(orderPercentageDifference)?.toFixed()!=0)) 
                                                            ? '+' 
                                                                : '' ) }
                                                { Number(orderPercentageDifference)?.toFixed() }%
                                            </small> 
                                        </span>
                                    </span>
                                    <span>
                                        <small>{ (orderRange == 'today') ? 'vs yesterday' 
                                                : (orderRange == 'this-week') ? 'vs last week' 
                                                : (orderRange == 'this-month') ? 'vs last month' 
                                                : (orderRange == 'this-year') ? 'vs last year' 
                                                : '' }</small>
                                    </span>
                                </span> 
                            }
                        </div>
                    </div>
                    <div className="purchase d-flex justify-content-between p-3 border-radius-25 box-shadow-1">
                        <div className="d-flex flex-column justify-content-between gap-2">
                            <h2 className="fs-6">Total Purchases&nbsp;<span className="fw-semibold">({ purchases?.data?.total_results })</span></h2>
                            <span className="fs-4 fw-semibold">${ (purchases?.data?.total_amount?.total_paid)?.toLocaleString('en') }</span>
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
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setPurchaseRange('today'); 
                                                await getPurchases(purchaseRange); 
                                            }}
                                            className="dropdown-item">
                                                Today
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setPurchaseRange('this-week'); 
                                                await getPurchases(purchaseRange); 
                                            }}
                                            className="dropdown-item">
                                                This Week
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setPurchaseRange('this-month');
                                                await getPurchases(purchaseRange); 
                                            }}
                                            className="dropdown-item">
                                                This Month
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setPurchaseRange('this-year'); 
                                                await getPurchases(purchaseRange);  
                                            }}
                                            className="dropdown-item">
                                                This Year
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setPurchaseRange('all'); 
                                                await getPurchases(purchaseRange); 
                                            }}
                                            className="dropdown-item">
                                                All Time
                                        </span>
                                    </li>
                                </ul>
                            </span>
                            { (purchaseRange != 'all') && 
                                <span className="d-flex justify-content-end align-items-center gap-1 flex-wrap">
                                    <span className={`badge rounded-pill ${ ((totalPurchasesPrevious>totalPurchasesCurrent)||(totalPurchasesPrevious==totalPurchasesCurrent)) 
                                        ? 'text-bg-danger' : 'text-bg-success'}`}>
                                        <span>
                                            { (totalPurchasesPrevious<totalPurchasesCurrent) 
                                                ?   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                                        className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                            d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                                    </svg> 
                                                : (totalPurchasesPrevious>totalPurchasesCurrent) 
                                                    ?   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
                                                        </svg> 
                                                        : '' }
                                        </span>
                                        <span> 
                                            <small>
                                                { (((totalPurchasesPrevious>totalPurchasesCurrent)&&(Number(purchasePercentageDifference)?.toFixed()!=0))
                                                    ? '-'
                                                        : ((totalPurchasesPrevious<totalPurchasesCurrent)&&(Number(purchasePercentageDifference)?.toFixed()!=0)) 
                                                            ? '+' 
                                                                : '' ) }
                                                { Number(purchasePercentageDifference)?.toFixed() }%
                                            </small> 
                                        </span>
                                    </span>
                                    <span>
                                        <small>{ (purchaseRange == 'today') ? 'vs yesterday' 
                                                    : (purchaseRange == 'this-week') ? 'vs last week' 
                                                    : (purchaseRange == 'this-month') ? 'vs last month' 
                                                    : (purchaseRange == 'this-year') ? 'vs last year' 
                                                    : '' }</small>
                                    </span>
                                </span> 
                            }
                        </div>
                    </div>
                </section>
            
                <div className="client-checkin box-shadow-1 border-radius-25 p-3 d-flex flex-column gap-2">
                    <div>
                        <div className="d-flex align-items-center justify-content-between">
                            <h2 className="fs-6">Client Check-ins</h2> 
                        </div>
                        
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setCheckInRange('all'); 
                                            await getCheckIns(checkInRange); 
                                        }}
                                        className={`badge rounded-pill ${(checkInRange == 'all') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            All
                                    </span>
                                </li>
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setCheckInRange('today'); 
                                            await getCheckIns(checkInRange); 
                                        }}
                                        className={`badge rounded-pill ${(checkInRange == 'today') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Today
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setCheckInRange('this-week'); 
                                            await getCheckIns(checkInRange); 
                                        }}
                                        className={`badge rounded-pill ${(checkInRange == 'this-week') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Week
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setCheckInRange('this-month'); 
                                            await getCheckIns(checkInRange); 
                                        }}
                                        className={`badge rounded-pill ${(checkInRange == 'this-month') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Month
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setCheckInRange('this-year'); 
                                            await getCheckIns(checkInRange); 
                                        }}
                                        className={`badge rounded-pill ${(checkInRange == 'this-year') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Year
                                    </span>
                                </li> 
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="fw-semibold fs-4">{ (checkIns?.data?.total_results)?.toLocaleString('en') }</span>
                        <span className={`badge rounded-pill ${ ((totalCheckInsPrevious>totalCheckInsCurrent)||(totalCheckInsPrevious==totalCheckInsCurrent)) 
                            ? 'text-bg-danger' : 'text-bg-success'}`}>
                            <span>
                                { (totalCheckInsPrevious<totalCheckInsCurrent) 
                                    ?   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                            className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                        </svg> 
                                    : (totalCheckInsPrevious>totalCheckInsCurrent) 
                                        ?   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
                                            </svg> 
                                            : '' }
                            </span>
                            <span> 
                                <small>
                                    { (((totalCheckInsPrevious>totalCheckInsCurrent)&&(Number(checkInPercentageDifference)?.toFixed()!=0))
                                        ? '-'
                                            : ((totalCheckInsPrevious<totalCheckInsCurrent)&&(Number(checkInPercentageDifference)?.toFixed()!=0)) 
                                                ? '+' 
                                                    : '' ) }
                                    { Number(checkInPercentageDifference)?.toFixed() }%
                                </small> 
                            </span>
                        </span>
                    </div> 

                    <div>
                        <meter id="fuel" min="0" max="100" low="33" high="66" optimum="80" value={ checkInPercentageDifference?.toFixed() }>at 50/100</meter>
                    </div> 

                    <div className="d-flex align-items-center justify-content-between fw-semibold">
                        <small>Check-ins totally</small> 
                        <small>{ ((checkIns?.data?.total_results)>0)&&'+' }{ (checkIns?.data?.total_results)?.toLocaleString('en') }&nbsp;
                            { (checkInRange == 'today') ? 'today' 
                                : (checkInRange == 'this-week')? 'this week' 
                                : (checkInRange == 'this-month')? 'this month' 
                                : (checkInRange == 'this-year')? 'this year' 
                                : '' }
                        </small>
                    </div>
                </div>

                <div className="client-volume box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2">
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
                                            setClientGrowthRange('today'); 
                                            await getClientsGrowth(clientGrowthRange); 
                                        }}
                                        className="dropdown-item">
                                            Today
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setClientGrowthRange('this-week'); 
                                            await getClientsGrowth(clientGrowthRange); 
                                        }}
                                        className="dropdown-item">
                                            This Week
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setClientGrowthRange('this-month'); 
                                            await getClientsGrowth(clientGrowthRange); 
                                        }}
                                        className="dropdown-item">
                                            This Month
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setClientGrowthRange('this-year'); 
                                            await getClientsGrowth(clientGrowthRange); 
                                        }}
                                        className="dropdown-item">
                                            This Year
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setClientGrowthRange('all'); 
                                            await getClientsGrowth(clientGrowthRange); 
                                        }}
                                        className="dropdown-item">
                                            All Time
                                    </span>
                                </li> 
                            </ul>
                        </span>
                    </div> 

                    <div className="d-flex flex-column">
                        <span className="fs-4 fw-semibold">{ (clientsGrowth?.data?.total_results)?.toLocaleString('en') }</span> 
                        <span>New Clients</span>
                    </div> 

                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
                        <span className="border border-1 border-secondary border-radius-35 px-3" style={{ fontSize: '0.75rem' }}>Client vol. { (((totalClientsGrowthPrevious>totalClientsGrowthCurrent)||(totalClientsGrowthPrevious==totalClientsGrowthCurrent))
                            ?'decreased':'increased') }</span>
                        <span className={`badge rounded-pill ${ ((totalClientsGrowthPrevious>totalClientsGrowthCurrent)||(totalClientsGrowthPrevious==totalClientsGrowthCurrent)) 
                            ? 'text-bg-danger' : 'text-bg-success'}`}>
                            <span>
                                { (totalClientsGrowthPrevious<totalClientsGrowthCurrent) 
                                    ?   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                            className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z" />
                                        </svg> 
                                    : (totalClientsGrowthPrevious>totalClientsGrowthCurrent) 
                                        ?   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-left" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M2 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H3.707L13.854 2.854a.5.5 0 0 0-.708-.708L3 12.293V7.5a.5.5 0 0 0-1 0z"/>
                                            </svg> 
                                            : '' }
                            </span>
                            <span> 
                                <small>
                                    { (((totalClientsGrowthPrevious>totalClientsGrowthCurrent)&&(Number(clientsGrowthPercentageDifference)?.toFixed()!=0))
                                        ? '-'
                                            : ((totalClientsGrowthPrevious<totalClientsGrowthCurrent)&&(Number(clientsGrowthPercentageDifference)?.toFixed()!=0)) 
                                                ? '+' 
                                                    : '' ) }
                                    { Number(clientsGrowthPercentageDifference)?.toFixed() }%
                                </small> 
                            </span>
                        </span>
                        <span>
                            <small>{ (clientGrowthRange == 'today') ? 'vs yesterday' 
                                    : (clientGrowthRange == 'this-week') ? 'vs last week' 
                                    : (clientGrowthRange == 'this-month') ? 'vs last month' 
                                    : (clientGrowthRange == 'this-year') ? 'vs last year' 
                                    : '' }</small>
                        </span>
                    </div>
                </div>
            </div>

            <div className="line line-2">
                <div className="statistics box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                            <h2 className="fs-6">Ratings</h2>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge rounded-pill text-bg-secondary"> 
                                { (ratingsRange == 'today') ? 'Today' 
                                    : (ratingsRange == 'this-week') ? 'This Week' 
                                    : (ratingsRange == 'this-month') ? 'This Month' 
                                    : (ratingsRange == 'this-year') ? 'This Year' 
                                    : 'All' }
                            </span> 
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
                                                setRatingsRange('today'); 
                                                await getRatings(ratingsRange); 
                                            }}
                                            className="dropdown-item">
                                                Today
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setRatingsRange('this-week'); 
                                                await getRatings(ratingsRange); 
                                            }}
                                            className="dropdown-item">
                                                This Week
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setRatingsRange('this-month');
                                                await getRatings(ratingsRange); 
                                            }}
                                            className="dropdown-item">
                                                This Month
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setRatingsRange('this-year'); 
                                                await getRatings(ratingsRange);  
                                            }}
                                            className="dropdown-item">
                                                This Year
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setRatingsRange('all'); 
                                                await getRatings(ratingsRange); 
                                            }}
                                            className="dropdown-item">
                                                All Time
                                        </span>
                                    </li>
                                </ul>
                            </span>
                        </div>
                    </div> 

                    <div className="h-100 d-flex flex-row justify-content-between align-items-center gap-1" style={{ minHeight: '200px' }}>
                        <div className="h-100 d-flex flex-column flex-wrap gap-1 col-3">
                            <span className="fw-semibold fs-4">
                                { (((totalSatisfactionPrevious>totalSatisfactionCurrent)&&(Number(ratingPercentageDifference)?.toFixed()!=0))
                                        ? '-'
                                            : ((totalSatisfactionPrevious<totalSatisfactionCurrent)&&(Number(ratingPercentageDifference)?.toFixed()!=0)) 
                                                ? '+' 
                                                    : '' ) }
                                    { Number(ratingPercentageDifference)?.toFixed() }%
                            </span> 
                            <small className="w-100">Customer satisfaction&nbsp;
                                { ((ratingsRange!='all')&&(totalSatisfactionCurrent>totalSatisfactionPrevious)) ? 'increase from' 
                                    : ((ratingsRange!='all')&&(totalSatisfactionCurrent<totalSatisfactionPrevious)) ? 'decrease from' 
                                    : ((ratingsRange!='all')&&(totalSatisfactionCurrent==totalSatisfactionPrevious)) ? 'stagnant from' 
                                    : '' }&nbsp;
                                { (ratingsRange == 'today') ? 'yesterday' 
                                    : (ratingsRange == 'this-week') ? 'last week' 
                                    : (ratingsRange == 'this-month') ? 'last month' 
                                    : (ratingsRange == 'this-year') ? 'last year' 
                                    : '' }</small>
                        </div>

                        <section className="h-100 col-9">
                            <RatingChart 
                                ratingsRange={ ratingsRange } 
                                fiveStar={ ratings?.data?.total_amount?.ratings?.five_star }  
                                fourStar={ totalRatingsCurrent?.four_star } 
                                threeStar={ totalRatingsCurrent?.three_star } 
                                twoStar={ totalRatingsCurrent?.two_star } 
                                oneStar={ totalRatingsCurrent?.one_star } />
                        </section>
                    </div>
                </div> 

                <div className="orders box-shadow-1 border-radius-25 p-3 d-flex flex-column justify-content-between gap-2" style={{ background: `url(${MapBackgroundImage})`, backgroundSize: 'cover' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <h2 className="fs-6" style={{ textShadow: '2px 2px white, -2px -2px white' }}>Most Order by Client</h2>
                    </div>

                    <section>
                        {/* (orders?.data?.length > 0) && (orders?.data?.map((order, index) => { */}
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            { (orders?.data?.top_3?.length > 0) && ((orders?.data?.top_3)?.map((order, index) => {
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
                                                <img src={ order?.user?.user_image_path?.url ? order?.user?.user_image_path?.url : UserNoImage}
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
