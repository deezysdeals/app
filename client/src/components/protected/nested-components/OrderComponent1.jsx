import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 


export default function OrderComponent1({ order, 
                                        index,
                                        current_page, 
                                        limit }) {
    return (
        <>
            <div className="text-dark px-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                    <span className="fw-semibold">#
                        { (current_page != 1) 
                            ? (((current_page - 1) * limit) + (index + 1))
                            : current_page * (index + 1) }
                    </span>
                    <span 
                        type="button" 
                        data-bs-toggle="modal" data-bs-target={ `#order${order?._id}Modal` }
                        className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                            View
                    </span>
                </div> 
                <div className="amount-and-client">
                    <h3 className="fw-semibold">${ (order?.total_to_be_paid)?.toFixed(2) || 0 }</h3> 
                    <p>By&nbsp;
                        <Link 
                            to={ route('home.users.show', { username: order?.user?.username }) } 
                            className="text-dark">
                                { order?.user?.first_name + ' ' + order?.user?.last_name }
                        </Link>
                        { order?.state_region && 
                            <span>&nbsp;from { order?.state_region }</span>
                        }, <small>{ dayjs.utc(order?.created_at).fromNow() }</small></p>
                </div>
                { (order?.order_items?.length > 0) &&
                    <section className="ordered-items pt-3" style={{ maxWidth: '600px' }}> 
                        <h4 className="fw-semibold border-bottom pb-1 fs-6">Ordered Items</h4>
                        <ol className='list-unstyled d-flex flex-column gap-1'> 
                            { (order?.order_items?.length > 0) && (order?.order_items?.slice(0,2)?.map((orderItem, index) => {
                                return (
                                    <li key={ orderItem?._id } className="ordered-item row align-items-center g-3 py-1">
                                        <div className="col-md-2">
                                            <div id={`carousel${orderItem?._id}Image`} className="carousel slide">
                                                <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                    <div className="images">
                                                        { (orderItem?.product?.images?.map((image, index) => {
                                                            return (
                                                                <div key={ index } className={`carousel-item ${ (index == 0) && `active`}`}>
                                                                    { (image) && (
                                                                            <img src={ image?.hi_res ? image?.hi_res
                                                                                        : image?.large ? image?.large 
                                                                                        : image?.thumb ? image?.thumb
                                                                                        : image } className="object-fit-cover border-radius-15" style={{ width: '75px', height: '75px' }} alt="..." />
                                                                        ) }
                                                                </div>
                                                            )
                                                        })) }
                                                    </div> 

                                                    <div>
                                                        <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carousel${orderItem?._id}Image`} data-bs-slide="prev">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                </svg>
                                                            </span>
                                                            <span className="visually-hidden">Previous</span>
                                                        </button>
                                                        <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`#carousel${orderItem?._id}Image`} data-bs-slide="next">
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
                                                <h5>{ ((orderItem?.product?.title)?.length > 20) ? ((orderItem?.product?.title)?.slice(0,20) + ' ...') : orderItem?.product?.title }</h5>
                                                <div className=""><small className="quantity">{ orderItem?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ (orderItem?.product?.retail_price) }</span></div>
                                            </div>
                                        </div> 
                                    </li>
                                )
                            })) }
                        </ol> 
                        { (order?.order_items?.length > 2) && 
                        (<span 
                            type="button" 
                            data-bs-toggle="modal" 
                            data-bs-target={ `#order${order?._id}Modal` } 
                            className="text-decoration-underline pt-4">
                                <span className="fw-semibold">+{ order?.order_items?.length - 2 }</span>
                                &nbsp;other item{ ((order?.order_items?.length - 2) > 1) && 's' }
                        </span>) }
                    </section> 
                }
            </div> 

            <div className="modal fade" id={ `order${order?._id}Modal` } tabIndex="-1" aria-labelledby={ `order${order?._id}ModalLabel` } aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-end align-items-center gap-1">
                            <h3 className="modal-title fs-5 d-none" id={ `order${order?._id}ModalLabel` }>#{ order?._id }</h3>
                            <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <section className="amount-and-client">
                                <h3 className="fs-6">
                                    { order?.paypal_order_id &&
                                        <small>Order #:&nbsp;{ order?.paypal_order_id }</small> 
                                    }
                                </h3>
                                <small>Ref:&nbsp;<small className="fw-semibold">#{ (order?._id)?.toUpperCase() }</small></small>
                                <p className="fw-semibold fs-3">${ (order?.total_to_be_paid) ? (order?.total_to_be_paid)?.toFixed(2) : '0' }</p> 
                                { (order?.paid == true) && 
                                    <p className="d-flex align-items-center" style={{ marginTop: '-0.5rem' }}>
                                        <span>Paid with&nbsp;</span>
                                        { (order?.payment_mode == 'paypal') && 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paypal" viewBox="0 0 16 16">
                                                <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/>
                                            </svg>
                                        }
                                        { (order?.payment_mode == 'card') && 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16">
                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                            </svg>
                                        }
                                        { (order?.payment_mode == 'cash') && 
                                            <span className="fw-semibold">Cash</span>
                                        }
                                    </p> 
                                }
                                <p style={{ marginTop: '-0.5rem' }}>By&nbsp;
                                    <Link 
                                        to={ route('home.users.show', { username: order?.user?.username }) } 
                                        target="_blank" 
                                        className="text-dark">
                                            { order?.user?.first_name + ' ' + order?.user?.last_name }
                                    </Link>
                                    &nbsp;from { order?.state_region }, <small className="text-secondary">{ dayjs.utc(order?.created_at).fromNow() }</small>
                                </p>
                            </section> 

                            { (order?.order_items?.length > 0) &&
                                <section className="ordered-items pt-1" style={{ maxWidth: '600px' }}> 
                                    <h4 className="fw-semibold border-bottom pb-1 fs-6">Ordered Items</h4>
                                    <ol className='list-unstyled d-flex flex-column gap-1'> 
                                        { (order?.order_items?.length > 0) && (order?.order_items?.map(orderItem => {
                                            return (
                                                <li key={ orderItem?._id } className="ordered-item row align-items-center g-3 py-1">
                                                    <div className="col-md-2">
                                                        <div id={`carousel${orderItem?._id}ModalDetailImages`} className="carousel slide">
                                                            <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                                <div className="images"> 
                                                                    { (orderItem?.product?.images?.map((image, index) => {
                                                                        return (
                                                                            <div key={ index } className={`carousel-item ${ (index == 0) && `active`}`}>
                                                                                { (image) && (
                                                                                    <img src={ image?.hi_res ? image?.hi_res
                                                                                                : image?.large ? image?.large 
                                                                                                : image?.thumb ? image?.thumb
                                                                                                : image } 
                                                                                        className="object-fit-cover border-radius-15" style={{ width: '75px', height: '75px' }} alt="..." />
                                                                                ) }
                                                                            </div>
                                                                        )
                                                                    })) } 
                                                                </div> 

                                                                <div>
                                                                    <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carousel${orderItem?._id}ModalDetailImages`} data-bs-slide="prev">
                                                                        <span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                            </svg>
                                                                        </span>
                                                                        <span className="visually-hidden">Previous</span>
                                                                    </button>
                                                                    <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`#carousel${orderItem?._id}ModalDetailImages`} data-bs-slide="next">
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
                                                            <h5>{ ((orderItem?.product?.title)?.length > 20) ? ((orderItem?.product?.title)?.slice(0,20) + ' ...') : orderItem?.product?.title }</h5>
                                                            <div className=""><small className="quantity">{ orderItem?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ (orderItem?.product?.retail_price) }</span></div>
                                                        </div>
                                                    </div> 
                                                </li>
                                            )
                                        })) } 
                                    </ol> 
                                </section> 
                            }
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        </> 
    )
}
