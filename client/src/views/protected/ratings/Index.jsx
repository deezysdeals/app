import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc'; 
// dayjs.extend(LocalizedFormat)
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useProductReviews } from '@/hooks/useProductReviews.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


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

export default function Index() {
    const [activeLink, setActiveLink] = useState(0); 

    const [productReviewQuery, setProductReviewQuery] = useState({ 
        page: 1, 
        limit: 10, 
        stars: null
    }); 
    console.log(productReviewQuery); 
    const { productReviews, getProductReviews } = useProductReviews(productReviewQuery); 
    console.log(productReviews);

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">Reviews/Ratings</h2> 

                    <div className="py-4">
                        <section className="tabs">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 0) && 'active'}`}
                                        aria-current="page" 
                                        onClick={ async () => { 
                                            setActiveLink(0)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: null
                                            })); 
                                            await getProductReviews(1, 10, null); 
                                        } }>All</span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 5) && 'active'}`}
                                        aria-current="page" 
                                        onClick={ async () => { 
                                            setActiveLink(5)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 5
                                            })); 
                                            await getProductReviews(1, 10, 5); 
                                        } }>5-stars</span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button"
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 4) && 'active'}`}
                                        onClick={ async () => { 
                                            setActiveLink(4)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 4
                                            })); 
                                            await getProductReviews(1, 10, 4); 
                                        } }>4-stars</span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 3) && 'active'}`}
                                        onClick={ async () => { 
                                            setActiveLink(3)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 3
                                            })); 
                                            await getProductReviews(1, 10, 3); 
                                        } }>3-stars</span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 2) && 'active'}`}
                                        onClick={ async () => { 
                                            setActiveLink(2)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 2
                                            })); 
                                            await getProductReviews(1, 10, 2); 
                                        } }>2-stars</span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold text-dark ${(activeLink == 1) && 'active'}`}
                                        onClick={ async () => { 
                                            setActiveLink(1)
                                            scrollToTop(); 
                                            let firstPage = 1
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 1
                                            })); 
                                            await getProductReviews(1, 10, 1); 
                                        } }>1-star</span>
                                </li>
                            </ul>
                        </section>

                        <section className="py-3"> 
                            <div className="text-end pb-3">
                                <span>
                                    { (productReviews?.data?.length > 0) 
                                        && <PaginationMeter 
                                                current_page={ productReviews?.meta?.current_page } 
                                                limit={ productReviews?.meta?.limit } 
                                                total_pages={ productReviews?.meta?.total_pages } 
                                                total_results={ productReviews?.meta?.total_results } /> } 
                                </span> 
                            </div> 

                            { (productReviews?.data?.length > 0) 
                            ?   <ul className="list-unstyled d-flex flex-column gap-3">
                                    { ((productReviews?.data?.length > 0) && productReviews?.data?.map(productReview => {
                                        return (
                                            <li key={ productReview?._id } className="d-flex flex-column box-shadow-1 border-radius-25 py-3 px-4"> 
                                                <div>
                                                    <div className="d-flex justify-content-end">
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
                                                                                <small>{ dayjs.utc(productReview?.created_at).fromNow() }</small>
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
                                                                                        <span className="card-text"><small>Options: <span className="fw-semibold">7
                                                                                                    sizes</span></small></span>
                                                                                        <span className="card-text">10k+ bought in the last month</span>
                                                                                        <span className="card-text"><small><s>$86.99</s></small>&nbsp;<span
                                                                                                className="fw-semibold">$${ Number(productReview?.order_item?.product?.retail_price)?.toFixed(2) }</span></span>
                                                                                        <span className="card-text"><small><span
                                                                                                    className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">Save
                                                                                                    $15.00</span>&nbsp;with coupon</small></span>
                                                                                        <span className="card-text">Delivery&nbsp;<span className="fw-semibold">Fri, Aug
                                                                                                30</span></span>
                                                                                        <span>
                                                                                            <small>More Buying Choices:</small>
                                                                                            <small className="fw-semibold">$400.98(46 used & new offers)</small>
                                                                                        </span>
                                                                                        <div className="pt-2 d-flex gap-2">
                                                                                            <span>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                                                                                    className="bi bi-bookmark" viewBox="0 0 16 16">
                                                                                                    <path
                                                                                                        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                                                                                </svg>
                                                                                            </span>
                                                                                            <span>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                                                                                    className="bi bi-heart" viewBox="0 0 16 16">
                                                                                                    <path
                                                                                                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                                                                </svg>
                                                                                            </span>
                                                                                        </div> 
                                                                                    </div>
                                                                                </div>
                                                                            </div> 

                                                                            <div className="about px-4">
                                                                                <h4 className="border-bottom pb-2 fs-6">About this Item:</h4> 
                                                                                <ul>
                                                                                    <li>Powerful Performance: Equipped with an Intel Celeron N5100 processor (4C/4T, 1.1/2.8GHz) and integrated Intel UHD Graphics, ensuring smooth and efficient multitasking for everyday computing tasks.</li> 
                                                                                    <li>Generous Storage & Memory: Features 32GB DDR4 RAM and a 1TB SSD for fast data access and ample storage space, perfect for storing large files and applications.</li> 
                                                                                    <li>Sleek Design & Display: 15.6" FHD (1920x1080) anti-glare display delivers clear and vibrant visuals. The laptop has a modern and durable design with a black PC-ABS chassis, weighing just 1.7 kg (3.75 lbs) for portability.</li> 
                                                                                    <li>Enhanced Connectivity & Security: Includes multiple ports for versatile connectivity - USB 2.0, USB 3.2 Gen 1, HDMI 1.4b, and RJ-45 Ethernet. Features Wi-Fi 5, Bluetooth 5.1, a camera privacy shutter, Firmware TPM 2.0 for added security, and comes with Windows 11 Pro pre-installed.</li> 
                                                                                    <li>Complete Accessory Package for Ultimate Convenience: Alongside the laptop, this package includes a set of valuable accessories to enhance your computing experience. You'll receive a 512GB external hard drive for additional storage, a microfiber cloth for keeping your screen clean and smudge-free, and a hotkey sticker sheet to speed up your workflow. Find your special voucher inside due to package size constraints. Claim your free exclusive gifts with a simple scan, shipped at no extra cost!</li>
                                                                                </ul>
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
                                                    <small>{ dayjs.utc(productReview?.created_at).fromNow() }</small>
                                                </p>
                                            </li> 
                                        )
                                    })) }
                                </ul> 
                                    :   (
                                            <></>
                                        )}
                        </section>
                    </div> 
                </div> 

                <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let firstPage = 1
                            setProductReviewQuery(prevState => ({
                                ...prevState, 
                                page: firstPage
                            })); 
                            await getProductReviews(); 
                            } }>
                            <First /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let previousPage = ((productReviews?.meta?.current_page >= 1) ? (productReviews?.meta?.current_page - 1) : 1)
                            setProductReviewQuery(prevState => ({
                                ...prevState, 
                                page: previousPage
                            })); 
                            await getProductReviews(); 
                        } }>
                            <Previous /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let nextPage = ((productReviews?.meta?.current_page < productReviews?.meta?.total_pages) ? (productReviews?.meta?.current_page + 1) : productReviews?.meta?.total_pages)
                            setProductReviewQuery(prevState => ({
                                ...prevState, 
                                page: nextPage
                            })); 
                            await getProductReviews(); 
                        } }>
                        <Next /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            let lastPage = productReviews?.meta?.total_pages
                            setProductReviewQuery(prevState => ({
                                ...prevState, 
                                page: lastPage
                            })); 
                            await getProductReviews(); 
                        } }>
                            <Last />
                    </span>
                </section>
            </div>
        </Layout>
    )
}
