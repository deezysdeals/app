import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc'; 
// dayjs.extend(LocalizedFormat)
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useNotifications } from '@/hooks/useNotifications.jsx'; 
import { useNotification } from '@/hooks/useNotification.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [notificationQuery, setNotificationQuery] = useState({ 
        page: 1, 
        limit: 10, 
    }); 

    const { notifications, getNotifications } = useNotifications(notificationQuery); 
    console.log(notifications); 
    const { readNotification, deleteNotification } = useNotification(); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">Notifications</h2> 

                    <section className="py-3"> 
                        <div className="text-end pb-3">
                            <span>
                                { (notifications?.data?.length > 0) 
                                    && <PaginationMeter 
                                            current_page={ notifications?.meta?.current_page } 
                                            limit={ notifications?.meta?.limit } 
                                            total_pages={ notifications?.meta?.total_pages } 
                                            total_results={ notifications?.meta?.total_results } /> } 
                            </span> 
                        </div> 

                        <ul className="list-unstyled d-flex flex-column gap-3">
                            {/* <li className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                <h3 className='fs-6 fw-semibold'>Email Notification</h3> 
                                <p>Response to your inquiry has just been sent to your email. Comsult your email for the message.</p> 
                            </li>
                            <li className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                <h3 className='fs-6 fw-semibold'>Bonus Notification</h3> 
                                <p>You have just been awarded a discount of $10 on any item you purchase. You can use it on any item on our online shop.&nbsp;<span><Link to={ route('home.deals.show') } className="text-warning">View details</Link></span>.</p> 
                            </li> */}
                        </ul>
                        <section>
                            { (notifications?.data?.length > 0) 
                                ?   <ul className="list-unstyled d-flex flex-column gap-3">
                                        { (notifications?.data?.length > 0) && notifications?.data?.map(notification => {
                                            return (
                                                <li 
                                                    key={ notification?._id } 
                                                    onClick={ async () => {
                                                        await readNotification(notification?._id); 
                                                        getNotifications()
                                                    } }
                                                    className={`box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer 
                                                        ${(notification?.read == false) ? 'bg-secondary text-white' : ''}`}>
                                                            <h3 className='fs-6 fw-semibold'>{ (notification?.type == 'order') && 'Order' }&nbsp;Notification</h3> 
                                                            <p>
                                                                { (notification?.type == 'order') && 
                                                                    <span>You placed an order worth ${ (notification?.order?.total_to_be_paid)?.toFixed(2) || '0.00' }.&nbsp;
                                                                        <span>
                                                                            <Link to={ route('home.orders.show', { id: notification?.order?._id }) } className="text-warning">View details</Link>
                                                                        </span>.
                                                                    </span>
                                                                }
                                                                { (notification?.type == 'delivery-arrival') && 
                                                                    <span>You just order placed { dayjs.utc(notification?.order?.created_at).fromNow() }, worth ${ notification?.order?.total_to_be_paid}&nbsp;has just arrived.
                                                                        <span>
                                                                            <Link to={ route('home.orders.show', { id: notification?.order?._id }) } className="text-warning">View details</Link>
                                                                        </span>.
                                                                    </span>
                                                                }
                                                            </p> 
                                                </li>
                                            )
                                        }) }
                                    </ul> 
                                        :   (
                                                <div className="h-100 w-100 py-4 d-flex justify-content-center align-items-center">
                                                    <span>There are no notifications yet.</span>
                                                </div>
                                        )}
                        </section>
                    </section>
                </div> 

                { (notifications?.data?.length > 0) && 
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let firstPage = 1
                                setNotificationQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getNotifications(); 
                                } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let previousPage = ((notifications?.meta?.current_page >= 1) ? (notifications?.meta?.current_page - 1) : 1)
                                setNotificationQuery(prevState => ({
                                    ...prevState, 
                                    page: previousPage
                                })); 
                                await getNotifications(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let nextPage = ((notifications?.meta?.current_page < notifications?.meta?.total_pages) ? (notifications?.meta?.current_page + 1) : notifications?.meta?.total_pages)
                                setNotificationQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getNotifications(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let lastPage = notifications?.meta?.total_pages
                                setNotificationQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getNotifications(); 
                            } }>
                                <Last />
                        </span>
                    </section> }
            </div>
        </Layout>
    )
}
