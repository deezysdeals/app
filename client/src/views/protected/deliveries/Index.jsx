import { useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useDeliveries } from '@/hooks/useDeliveries.jsx'; 
import OrderComponent1 from '@/components/protected/nested-components/OrderComponent1.jsx';
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
    const [deliveryQuery, setDeliveryQuery] = useState({
        page: 1, 
        limit: 10, 
        delivery_status: 'all',
    }); 
    const { deliveries, getDeliveries } = useDeliveries(deliveryQuery); 
    // const { deleteDelivery } = useDelivery(); 
    // console.log(deliveries); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center gap-3 flex-wrap border-bottom pb-1">
                        <h2 className="fs-4">Deliveries</h2> 
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setDeliveryQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                delivery_status: 'all'
                                            })); 
                                            await getDeliveries(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(deliveryQuery?.delivery_status == 'all') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            All
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setDeliveryQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                delivery_status: 'pending'
                                            })); 
                                            await getDeliveries(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(deliveryQuery?.delivery_status == 'pending') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Pending
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setDeliveryQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                delivery_status: 'delivered'
                                            })); 
                                            await getDeliveries(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(deliveryQuery?.delivery_status == 'delivered') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Delivered
                                    </span>
                                </li> 
                            </ul>
                        </div>
                    </section>

                    <div className="d-flex justify-content-end align-items-center flex-wrap gap-2 py-3"> 
                        <span className="text-end">
                            { (deliveries?.data?.length > 0) 
                                && <PaginationMeter 
                                    current_page={ deliveries?.meta?.current_page } 
                                    limit={ deliveries?.meta?.limit } 
                                    total_pages={ deliveries?.meta?.total_pages } 
                                    total_results={ deliveries?.meta?.total_results } /> } 
                        </span> 
                    </div>

                        
                    { (deliveries?.data?.length > 0) 
                        ?   <section className="py-3">
                                <ul className="list-unstyled d-flex flex-column gap-5">
                                    { (deliveries?.data?.length > 0) && (deliveries?.data?.map((order, index) => {
                                        return (
                                            <li key={order?._id} className="box-shadow-1 border-radius-25 py-4 px-2">
                                                <OrderComponent1 
                                                    order={order} 
                                                    index={index}
                                                    current_page={deliveries?.meta?.current_page} 
                                                    limit={deliveries?.meta?.limit} />
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

                { (deliveries?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ deliveries } 
                            getItems={ getDeliveries } 
                            query={ deliveryQuery } 
                            setQuery={ setDeliveryQuery } /> }
            </div>
        </Layout>
    )
}
