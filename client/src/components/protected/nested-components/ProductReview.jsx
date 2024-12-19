import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc'; 
// dayjs.extend(LocalizedFormat)
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import formatNumber from '@/utils/FormatNumber.jsx'; 


const InactiveStar = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
        </svg>
    )
} 

const ActiveStar = () => {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>
    )
}

export default function ProductReview({ productReview }) {
    return (
        <>
            <div className="d-flex justify-content-end align-items-center gap-3">
                <div className="">
                    <div>
                        <span 
                            type="button" 
                            data-bs-toggle="modal" data-bs-target={ `#productModal${productReview?._id}` }
                            className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                View Details
                        </span>
                    </div>
                    <div className="modal fade" id={ `productModal${productReview?._id}` } tabIndex="-1" aria-labelledby={ `productModal${productReview?._id}Label` } aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-end align-items-center gap-1">
                                    <h3 className="modal-title fs-5 d-none" id={ `productModal${productReview?._id}Label` }>{ productReview?.order_item?.product?.title }</h3>
                                    <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <section className="product-review-details">
                                        <h4 className="border-bottom pb-2 fw-semibold fs-6 d-none">Product Review Details</h4> 
                                        <div className="d-flex flex-column">
                                            <span className="py-2">
                                                { (productReview?.rating == 5) 
                                                    ?   <span>
                                                            <ActiveStar />
                                                            <ActiveStar />
                                                            <ActiveStar />
                                                            <ActiveStar />
                                                            <ActiveStar />
                                                        </span> 
                                                            : (productReview?.rating == 4) 
                                                            ?   <span>
                                                                    <ActiveStar />
                                                                    <ActiveStar />
                                                                    <ActiveStar />
                                                                    <ActiveStar />
                                                                    <InactiveStar />
                                                                </span> 
                                                                    : (productReview?.rating == 3) 
                                                                    ?   <span>
                                                                            <ActiveStar />
                                                                            <ActiveStar />
                                                                            <ActiveStar />
                                                                            <InactiveStar />
                                                                            <InactiveStar />
                                                                        </span> 
                                                                            : (productReview?.rating == 2) 
                                                                            ?   <span>
                                                                                    <ActiveStar />
                                                                                    <ActiveStar />
                                                                                    <InactiveStar />
                                                                                    <InactiveStar />
                                                                                    <InactiveStar />
                                                                                </span> 
                                                                                    : (productReview?.rating == 4) 
                                                                                    ?   <span>
                                                                                            <ActiveStar />
                                                                                            <InactiveStar />
                                                                                            <InactiveStar />
                                                                                            <InactiveStar />
                                                                                            <InactiveStar />
                                                                                        </span> 
                                                                                            : ''}
                                            </span> 
                                            <h3 className='fs-6'>{ productReview?.title }</h3> 
                                            <p>{ productReview?.content }</p> 
                                            <p className="text-end">-&nbsp;
                                                { productReview?.user?.first_name + ' ' + productReview?.user?.last_name },&nbsp;
                                                <small className=""><small>{ dayjs.utc(productReview?.created_at).fromNow() }</small></small>
                                            </p>
                                        </div>
                                    </section>
                                    <section className="order-details pt-3">
                                        <h4 className="border-bottom pb-2 fw-semibold fs-6">Order Details</h4> 

                                        <section className="d-flex flex-column pb-3">
                                            <p className="py-0 my-0">Order ID: #{ productReview?.order?._id }</p> 
                                            <p className="py-0 my-0">Order Date: { dayjs(productReview?.order?.created_at).format('dddd, MMMM D, YYYY h:mm A') }</p> 
                                            <span className="mt-2 align-self-end btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                                <Link to={ route('home.orders.show', { id: productReview?.order?._id }) } target="_blank" className="text-decoration-none ps-1 fw-semibold text-white">
                                                    <span className="fw-semibold">See order details</span>&nbsp;
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                    </svg>
                                                </Link>
                                            </span>
                                        </section>

                                        <section className="item-details"> 
                                            <h5 className="border-bottom pb-2 fw-semibold fs-6"><small>Item</small></h5>
                                            <div className="row align-items-center justify-content-between p-4 pt-2 g-3">
                                                <div className="col-md-5">
                                                    <div id={ `carouselModalImage${productReview?._id}` } className="carousel slide">
                                                        <div className="carousel-inner position-relative" style={{ width: '215px', height: '215px' }}>
                                                            <div className="images">
                                                                { (productReview?.order_item?.product?.images?.length > 0) && productReview?.order_item?.product?.images?.map((imgSrc, imgSrcIndex) => {
                                                                        return (
                                                                            <div key={ imgSrcIndex } className={`carousel-item ${ (imgSrcIndex == 0) && `active` }`}>
                                                                                <img src={ imgSrc } className="d-block object-fit-cover border-radius-35" style={{ width: '215px', height: '215px' }} alt="..." />
                                                                            </div> 
                                                                        )
                                                                    }) 
                                                                }
                                                            </div> 

                                                            <div>
                                                                <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target={ `#carouselModalImage${productReview?._id}` } data-bs-slide="prev">
                                                                    <span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                        </svg>
                                                                    </span>
                                                                    <span className="visually-hidden">Previous</span>
                                                                </button>
                                                                <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target={ `#carouselModalImage${productReview?._id}` } data-bs-slide="next">
                                                                    <span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                                        </svg>
                                                                    </span>
                                                                    <span className="visually-hidden">Next</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-7">
                                                    <div className="card-body d-flex flex-column gap-0">
                                                        <h4 className="card-title fs-4">{ productReview?.order_item?.product?.title }</h4> 
                                                        { productReview?.order_item?.product?.order_count && 
                                                            <span className="card-text">
                                                                { formatNumber(Number(productReview?.order_item?.product?.order_count)) }&nbsp;
                                                                bought in the last month
                                                            </span> 
                                                        }
                                                        <span className="card-text"> 
                                                            { productReview?.order_item?.product?.initial_retail_price && 
                                                                <small>
                                                                    <s>${ Number(productReview?.order_item?.product?.initial_retail_price / 100)?.toFixed(2) }</s>&nbsp;
                                                                </small> 
                                                            }
                                                            <span className="fw-semibold">
                                                                ${ Number(productReview?.order_item?.product?.retail_price / 100)?.toFixed(2) }
                                                            </span>
                                                        </span> 
                                                        { productReview?.deal && 
                                                            <span className="card-text">
                                                                <small>
                                                                    <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">
                                                                        Saved { productReview?.deal?.value + (productReview?.deal?.value_unit)?.toUpperCase() }
                                                                    </span>&nbsp;
                                                                    with coupon
                                                                </small>
                                                            </span> 
                                                        }
                                                        { (productReview?.order?.delivery_status == 'delivered') 
                                                            ?   <span className="card-text pt-1">Delivery:&nbsp;
                                                                    <span className="fw-semibold">{ dayjs(productReview?.order?.delivery_date).format('dddd, MMMM D, YYYY h:mm A') }</span>
                                                                </span>
                                                                : <span className="text-warning fw-semibold pt-1">Not yet delivered</span> } 
                                                        {/* <div className="pt-2 d-flex gap-2">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                                                    className="bi bi-bookmark" viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                                                </svg>
                                                            </span> 
                                                        </div>  */}
                                                    </div>
                                                </div>
                                            </div> 

                                            <div className="d-flex justify-content-end px-4 pt-4 pb-2">
                                                <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                                    <Link to={ route('products.show', { id: productReview?.order_item?.product?._id }) } target="_blank"  className="text-decoration-none ps-1 fw-semibold text-white">
                                                        <span className="fw-semibold">See item full details</span>&nbsp;
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                        </svg>
                                                    </Link>
                                                </span>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                                <div className="modal-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div>
                    <span className="dropdown">
                        <a className="text-decoration-none text-dark" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            className="bi bi-three-dots" viewBox="0 0 16 16">
                                <path
                                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                            </svg> 
                        </a>

                        <ul className="dropdown-menu"> 
                            {/* <li>
                                <Link to={ route('home.product-reviews.edit', { id: productReview?._id }) } className="dropdown-item d-flex align-items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                        <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                                    </svg>
                                    <span className="fw-semibold">Update</span>
                                </Link>
                            </li>  */}
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
                                            deleteProductReview(productReview?._id); 
                                            getProductReviews(productReviewQuery); 
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
                    </span>
                </div>
            </div> 
            
            <span className="py-2">
                { (productReview?.rating == 5) 
                    ?   <span>
                            <ActiveStar />
                            <ActiveStar />
                            <ActiveStar />
                            <ActiveStar />
                            <ActiveStar />
                        </span> 
                            : (productReview?.rating == 4) 
                            ?   <span>
                                    <ActiveStar />
                                    <ActiveStar />
                                    <ActiveStar />
                                    <ActiveStar />
                                    <InactiveStar />
                                </span> 
                                    : (productReview?.rating == 3) 
                                    ?   <span>
                                            <ActiveStar />
                                            <ActiveStar />
                                            <ActiveStar />
                                            <InactiveStar />
                                            <InactiveStar />
                                        </span> 
                                            : (productReview?.rating == 2) 
                                            ?   <span>
                                                    <ActiveStar />
                                                    <ActiveStar />
                                                    <InactiveStar />
                                                    <InactiveStar />
                                                    <InactiveStar />
                                                </span> 
                                                    : (productReview?.rating == 4) 
                                                    ?   <span>
                                                            <ActiveStar />
                                                            <InactiveStar />
                                                            <InactiveStar />
                                                            <InactiveStar />
                                                            <InactiveStar />
                                                        </span> 
                                                            : ''}
            </span>
            <h3 className='fs-6'>{ productReview?.title }</h3> 
            <p>{ productReview?.content }</p> 
            <p className="text-end">
                <small className="">
                    <small>{ dayjs.utc(productReview?.created_at).fromNow() }</small>
                </small>
            </p>
        </>
    )
}
