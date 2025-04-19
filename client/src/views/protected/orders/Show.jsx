import { useState, useEffect } from 'react'; 
import { Link, useLocation, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() { 
    const location = useLocation(); 
    const params = useParams(); 
    const { order, getOrder } = useOrder(params?.id); 
    // console.log(order); 

    const handlePrint = () => {
        window.print();
    };

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-6 d-flex flex-column">
                        <span><small>Order #</small>{ order?.data?.paypal_order_id }</span>
                        <small>
                            <small className="">Ref:&nbsp;
                                <span className="fw-semibold text-uppercase">#{ order?.data?._id }</span>
                            </small>
                        </small>
                    </h2> 

                    <div className="py-3"> 
                        <section className="amount-and-client">
                            { (location?.pathname?.startsWith('/home/invoices')) && (
                                <div className="pb-4">
                                    <section 
                                        onClick={ handlePrint } 
                                        className="d-flex align-items-center gap-1 cursor-pointer">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-printer-fill" viewBox="0 0 16 16">
                                                <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
                                                <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                                            </svg>
                                        </span>
                                        <span>Print copy</span>
                                    </section>
                                    <section className="barcode pt-3 d-flex justify-content-end" style={{ textAlign: 'center' }}>
                                        <img alt='Barcode Generator TEC-IT'
                                        src={`https://barcode.tec-it.com/barcode.ashx?data=${(order?.data?.paypal_order_id)?.replace(/[a-zA-Z]/g, '')?.slice(0,12)}&code=EAN13`}/>
                                    </section>
                                </div>
                            ) }

                            <h3 className="fw-semibold">${ (order?.data?.total_to_be_paid)?.toFixed(2) || '0.00' }</h3> 
                            <p className="d-flex align-items-center" style={{ marginTop: '-0.5rem' }}>
                                { (order?.data?.paid == true) && <span>Paid with&nbsp;</span> }
                                { (order?.data?.payment_mode == 'paypal') && 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paypal" viewBox="0 0 16 16">
                                        <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/>
                                    </svg>
                                }
                                { (order?.data?.payment_mode == 'card') && 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                        <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                    </svg>
                                }
                                { (order?.data?.payment_mode == 'cash') && 
                                    <span className="fw-semibold">Cash</span>
                                }
                            </p>
                            <p>by&nbsp;
                                <Link 
                                    to={ route('home.users.show', { username: order?.data?.user?.username }) } 
                                    className="text-dark">
                                        { order?.data?.user?.first_name + ' ' + order?.data?.user?.last_name }
                                </Link>
                            </p>
                            <p style={{ marginTop: '-0.5rem' }}><small>{ dayjs.utc(order?.data?.created_at).fromNow() }</small></p>
                        </section> 

                        { (order?.data?.order_items?.length > 0) ? (
                            <section className="ordered-items pt-1" style={{ maxWidth: '600px' }}> 
                                <h4 className="fw-semibold border-bottom pb-1 fs-6">Ordered Items</h4>
                                <ol className='list-unstyled d-flex flex-column gap-1'> 
                                { (order?.data?.order_items?.length > 0) && (order?.data?.order_items?.map((orderItem, index) => {
                                    return (
                                        <li 
                                            key={ index+1 }
                                            className="ordered-item row align-items-center g-3 py-1">
                                            <div className="col-md-2">
                                                <div id={`carouselModalItem${orderItem?._id}`} className="carousel slide">
                                                    <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                        <div className="images"> 
                                                            { (orderItem?.product?.images?.length > 0) && (orderItem?.product?.images?.map((image, index) => {
                                                                return (
                                                                    <div key={ image } className={`carousel-item ${(index==0) && `active`}`}>
                                                                        <img src={ image?.hi_res ? image?.hi_res
                                                                                    : image?.large ? image?.large 
                                                                                    : image?.thumb ? image?.thumb
                                                                                    : image } className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt={ image } />
                                                                    </div>
                                                                )
                                                            })) }
                                                        </div> 

                                                        <div>
                                                            <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carouselModalItem${orderItem?._id}`} data-bs-slide="prev">
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                    </svg>
                                                                </span>
                                                                <span className="visually-hidden">Previous</span>
                                                            </button>
                                                            <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`#carouselModalItem${orderItem?._id}`} data-bs-slide="next">
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                                    </svg>
                                                                </span>
                                                                <span className="visually-hidden">Next</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                                    <h5>{ orderItem?.product?.title?.slice(0,23) }{ (orderItem?.product?.title?.length > 23) && '...'}</h5>
                                                    <div className=""><small className="quantity">{ orderItem?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ (orderItem?.selling_price)?.toFixed(2) }</span></div>
                                                </div>
                                            </div> 
                                        </li>
                                    )
                                })) }
                                </ol> 


                                <div className="text-end border-top border-bottom py-1">
                                    <span className="fw-semibold fs-5">${ (order?.data?.total_to_be_paid)?.toFixed(2) ?? '0.00' }</span>
                                </div>
                            </section> 
                        ) : ( 
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no items for this order.</span>
                                </div>
                            ) }
                    </div> 
                </div> 
            </div>
        </Layout>
    )
}
