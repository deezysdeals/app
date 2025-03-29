import { useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useOrders } from '@/hooks/useOrders.jsx'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import OrderComponent1 from '@/components/protected/nested-components/OrderComponent1.jsx';
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [orderQuery, setOrderQuery] = useState({
        page: 1, 
        limit: 10, 
        payment_status: 'all'
    }); 
    const { orders, getOrders } = useOrders(orderQuery); 
    const { deleteOrder } = useOrder(); 
    // console.log(orders); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center gap-3 flex-wrap border-bottom pb-1">
                        <h2 className="fs-4">Orders</h2> 
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: 'all'
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'all') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            All
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: false
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'false') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Unpaid
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: true
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'true') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Paid
                                    </span>
                                </li> 
                            </ul>
                        </div>
                    </section>

                    <div className="d-flex justify-content-end align-items-center flex-wrap gap-2 py-3"> 
                        <div className="text-end">
                            { (orders?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ orders?.meta?.current_page } 
                                        limit={ orders?.meta?.limit } 
                                        total_pages={ orders?.meta?.total_pages } 
                                        total_results={ orders?.meta?.total_results } /> } 
                        </div> 
                    </div>

                        
                    { (orders?.data?.length > 0) 
                        ?   <section className="py-3">
                                <ul className="list-unstyled d-flex flex-column gap-5">
                                    { (orders?.data?.length > 0) && (orders?.data?.map((order, index) => {
                                        return (
                                            <li key={order?._id} className="box-shadow-1 border-radius-25 py-4 px-2">
                                                <OrderComponent1 
                                                    order={order} 
                                                    index={index}
                                                    current_page={orders?.meta?.current_page} 
                                                    limit={orders?.meta?.limit} />
                                            </li> 
                                            
                                        )
                                    }))}
                                </ul> 
                            </section>
                                : (
                                    <div className="h-100 w-100 py-4 d-flex justify-content-center align-items-center">
                                        <span>You have no orders yet.</span>
                                    </div>
                                )}
                </div>

                { (orders?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ orders } 
                            getItems={ getOrders } 
                            query={ orderQuery } 
                            setQuery={ setOrderQuery } /> } 
            </div>
        </Layout>
    )
}
