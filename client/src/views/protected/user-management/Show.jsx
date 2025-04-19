import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useUser } from '@/hooks/useUser.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() { 
    const params = useParams(); 
    const { retrievedUser, getUser } = useUser(params?.username); 

    console.log(params?.username)
    console.log(retrievedUser?.data); 
    
    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4 text-break" style={{ textTransform: 'capitalize' }}>
                        <Link to={ route('home.users.index') } className="text-dark">
                            Users
                        </Link>&nbsp;
                        | { (retrievedUser?.data?.first_name)?.slice(0,1)?.toUpperCase()+(retrievedUser?.data?.first_name)?.slice(1)?.toLowerCase() + 
                            ' ' + 
                            (retrievedUser?.data?.last_name)?.slice(0,1)?.toUpperCase()+(retrievedUser?.data?.last_name)?.slice(1)?.toLowerCase() }</h2> 

                    <div className="py-4"> 
                        <section className="d-flex align-items-center flex-wrap column-gap-5 row-gap-3">
                            { retrievedUser?.data?.user_image_path?.url 
                                ?   <span>
                                        <img 
                                            src={ retrievedUser?.data?.user_image_path?.url } 
                                            className="object-fit-cover border-radius-15" 
                                            style={{ width: '200px', height: '225px' }} 
                                            alt={ retrievedUser?.data?.first_name + ' ' + retrievedUser?.data?.last_name } /> 
                                    </span>
                                :   <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="225" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                        </svg>
                                    </span> }
                            <div className="d-flex flex-column">
                                <h3>{ (retrievedUser?.data?.first_name)?.slice(0,1)?.toUpperCase()+(retrievedUser?.data?.first_name)?.slice(1)?.toLowerCase() + ' ' + (retrievedUser?.data?.last_name)?.slice(0,1)?.toUpperCase()+(retrievedUser?.data?.last_name)?.slice(1)?.toLowerCase() }</h3> 
                                <span className="fw-semibold">@{ retrievedUser?.data?.username }</span>
                                <span className="pt-0 mt-0">{ retrievedUser?.data?.email }</span> 
                            </div>
                        </section> 

                        <section className="activities pt-5 pb-3">
                            <h3 className="border-bottom pb-1 fs-5 w-100">Activities</h3>
                            <div className="d-flex flex-column gap-3 pt-3">
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Orders ({ retrievedUser?.data?.orders_count || 0 }), <small className="text-secondary">{ retrievedUser?.data?.orders_pending_count || 0 } pending</small></h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.orders', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article> 
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Items Ordered ({ retrievedUser?.data?.order_items_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.ordered-items', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Payments ({ retrievedUser?.data?.payments_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.payments', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Ratings/Reviews ({ retrievedUser?.data?.product_reviews_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.product-reviews', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Deliveries ({ retrievedUser?.data?.deliveries_count || 0 }), <small className="text-secondary">{ retrievedUser?.data?.deliveries_pending_count || 0 } pending</small></h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.deliveries', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Purchases ({ retrievedUser?.data?.purchases_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.purchases', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Queries ({ retrievedUser?.data?.client_queries_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.client-queries', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                                <article className="w-100 d-flex justify-content-between border-radius-25 box-shadow-1 p-3">
                                    <div>
                                        <h4 className="fs-6">Client Queries Solved ({ retrievedUser?.data?.client_queries_solved_count || 0 })</h4>
                                    </div>
                                    <div>
                                        <Link to={ route('home.users.show.query-responses', { username: params?.username }) } className="btn btn-sm btn-dark py-0 border-radius-35 text-decoration-none fw-semibold">
                                            View
                                        </Link>
                                    </div>
                                </article>
                            </div>
                        </section> 
                    </div>
                </div> 
            </div>
        </Layout>
    )
}
