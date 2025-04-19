import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc'; 
// dayjs.extend(LocalizedFormat)
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useNotifications } from '@/hooks/useNotifications.jsx'; 
import { useNotification } from '@/hooks/useNotification.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [notificationQuery, setNotificationQuery] = useState({ 
        page: 1, 
        limit: 10, 
    }); 

    const { notifications, getNotifications, setNotifications } = useNotifications(notificationQuery); 
    // console.log(notifications); 
    const { readNotification, deleteNotification } = useNotification(); 

    const removeNotificationFromList = (notificationId) => {
        setNotifications((prevNotifications) => ({
            ...prevNotifications,
            data: notifications?.data?.filter(notification => notification?._id !== notificationId),
        }));
    };

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

                        {/* <ul className="list-unstyled d-flex flex-column gap-3">
                            <li className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                <h3 className='fs-6 fw-semibold'>Email Notification</h3> 
                                <p>Response to your inquiry has just been sent to your email. Comsult your email for the message.</p> 
                            </li>
                            <li className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                <h3 className='fs-6 fw-semibold'>Bonus Notification</h3> 
                                <p>You have just been awarded a discount of $10 on any item you purchase. You can use it on any item on our online shop.&nbsp;<span><Link to={ route('home.deals.show') } className="text-warning">View details</Link></span>.</p> 
                            </li>
                        </ul> */}
                        <section>
                            { (notifications?.data?.length > 0) 
                                ?   <ul className="list-unstyled d-flex flex-column gap-3">
                                        { (notifications?.data?.length > 0) && notifications?.data?.map(notification => {
                                            return (
                                                <li 
                                                    key={ notification?._id } 
                                                    className={`box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer 
                                                        ${(notification?.read == false) ? 'bg-secondary text-white' : ''}`}>
                                                            <h3 className='fs-6 fw-semibold d-flex justify-content-between'>
                                                                <span>{ (notification?.type == 'order') && 'Order' }&nbsp;Notification</span>
                                                                <div className="dropdown">
                                                                    <span className="text-decoration-none text-dark" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                        className="bi bi-three-dots" viewBox="0 0 16 16">
                                                                            <path
                                                                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                                                        </svg> 
                                                                    </span>
                            
                                                                    <ul className="dropdown-menu"> 
                                                                        <li 
                                                                            onClick={ () => {
                                                                                swal.fire({
                                                                                    text: "Are you sure you want to delete this?", 
                                                                                    showCancelButton: true,
                                                                                    confirmButtonColor: "#FF0000",
                                                                                    cancelButtonColor: "#414741",
                                                                                    confirmButtonText: "Yes!", 
                                                                                    cancelButtonText: "No!", 
                                                                                    customClass: {
                                                                                        confirmButton: 'swal2-button', 
                                                                                        cancelButton: 'swal2-button'
                                                                                    }, 
                                                                                }).then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        deleteNotification(notification?._id);
                                                                                        removeNotificationFromList(notification?._id); 
                                                                                        getNotifications(notificationQuery);
                                                                                    }
                                                                                });
                                                                            }}>
                                                                            <span className="dropdown-item d-flex align-items-center gap-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF0000" className="bi bi-trash2" viewBox="0 0 16 16">
                                                                                    <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                                                                                </svg>
                                                                                <span className="text-danger fw-semibold cursor-pointer">Delete</span>
                                                                            </span> 
                                                                        </li> 
                                                                    </ul>
                                                                </div> 
                                                            </h3> 
                                                            <p>
                                                                { (notification?.type == 'order') && 
                                                                    <span>You placed an order worth ${ (notification?.order?.total_to_be_paid)?.toFixed(2) || '0.00' }.&nbsp;
                                                                        <span 
                                                                            type="button"
                                                                            onClick={ async () => {
                                                                                await readNotification(notification?._id); 
                                                                                await getNotifications()
                                                                            } }>
                                                                                <Link to={ route('home.orders.show', { id: notification?.order?._id }) } className="text-warning">View details</Link>
                                                                        </span>.
                                                                    </span>
                                                                }
                                                                { (notification?.type == 'delivery-arrival') && 
                                                                    <span>You just order placed { dayjs.utc(notification?.order?.created_at).fromNow() }, worth ${ notification?.order?.total_to_be_paid}&nbsp;has just arrived.
                                                                        <span
                                                                            type="button"
                                                                            onClick={ async () => {
                                                                                await readNotification(notification?._id); 
                                                                                await getNotifications()
                                                                            } }>
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

                { (notifications?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ notifications } 
                            getItems={ getNotifications } 
                            query={ notificationQuery } 
                            setQuery={ setNotificationQuery } /> }
            </div>
        </Layout>
    )
}
