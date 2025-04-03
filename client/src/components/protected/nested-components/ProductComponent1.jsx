import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useFavorites } from '@/hooks/useFavorites.jsx'; 
import { useFavorite } from '@/hooks/useFavorite.jsx'; 
import { useProductReview } from '@/hooks/useProductReview.jsx'; 
import { useProducts } from '@/hooks/useProducts.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 


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

export default function ProductComponent1({ itemId, 
                                            productId, 
                                            asin, 
                                            index, 
                                            imgsSrc, 
                                            title, 
                                            description = '', 
                                            oldPrice = '',
                                            currentPrice, 
                                            rating, 
                                            category = '', 
                                            orderId, 
                                            orderCount, 
                                            orderPrice, 
                                            variations, 
                                            variationsValue, 
                                            dealValue, 
                                            dealValueUnit, 
                                            deliveryStatus, 
                                            deliveryDate, 
                                            purchasePrice, 
                                            purchaseDate, 
                                            sellingPrice, 
                                            saleDate }) { 
    const location = useLocation(); 
    const { user } = useContext(AuthContext); 
    // console.log(user)
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext); 
    const { getFavorites } = useFavorites(); 
    const { deleteFavorite } = useFavorite(); 
    const { productReview, createProductReview } = useProductReview(); 
    const { products, getProducts } = useProducts(); 
    const { addToShop, deleteProduct } = useProduct(); 
    const [displayComponent, setDisplayComponent] = useState(true); 

    const [stars, setStars] = useState({
        star_1: false, 
        star_2: false, 
        star_3: false, 
        star_4: false, 
        star_5: false, 
    }); 
    // console.log('stars', stars); 

    const handleStarClick = (starIndex) => {
        const newStars = { 
            star_1: starIndex >= 1, 
            star_2: starIndex >= 2, 
            star_3: starIndex >= 3, 
            star_4: starIndex >= 4, 
            star_5: starIndex >= 5 
        };
        setStars(newStars);
    }; 

    async function submitReview(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        formData.append('product', productId); 
        formData.append('order', orderId); 
        formData.append('order_item', itemId); 
        formData.append('title', productReview?.data?.title); 
        formData.append('content', productReview?.data?.comment); 
        formData.append('rating', ((stars?.star_5 == true) ? 5 
                                    : (stars?.star_4 == true) ? 4 
                                        : (stars?.star_3 == true) ? 3 
                                            : (stars?.star_2 == true) ? 2 
                                                : (stars?.star_1 == true) ? 1 
                                                    : '')); 

        await createProductReview(formData); 
        await productReview?.setData({}); 
    } 

    return (
        <>
            { (displayComponent) && 
                
                <>
                    <div className="text-dark">
                        <div className="d-flex justify-content-between align-items-center flex-wrap pb-2 px-3">
                            <span className="fw-semibold">#{ index }</span>
                            <div className="d-flex align-items-center gap-3 flex-wrap"> 
                                { (!(location?.pathname)?.startsWith('/home/brands') && !(location?.pathname)?.startsWith('/home/market')) && 
                                    <span 
                                        type="button" 
                                        data-bs-toggle="modal" data-bs-target={ `#productModal${itemId}` }
                                        className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold"> 
                                            {/* View { (location?.pathname)?.startsWith('/home/ordered-items') && `Item` } */}
                                            View
                                    </span> }
                                { (location?.pathname)?.startsWith('/home/market') && 
                                    <span 
                                        type="button" 
                                        className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                            <a href={ `https://www.amazon.com/dp/${asin}` } target="_blank" className="text-white text-decoration-none">View</a>
                                    </span> }
                                { ((location?.pathname)?.startsWith('/home/products') &&
                                    ((user?.user?.role == 'superadmin') || (user?.user?.role == 'admin'))) &&
                                    <div className="dropdown">
                                        <span className="text-decoration-none text-dark" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            className="bi bi-three-dots" viewBox="0 0 16 16">
                                                <path
                                                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                            </svg> 
                                        </span>

                                        <ul className="dropdown-menu"> 
                                            <li>
                                                <Link to={ route('home.products.edit', { id: productId }) } className="dropdown-item d-flex align-items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                                        <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                                                    </svg>
                                                    <span className="fw-semibold">Update</span>
                                                </Link>
                                            </li> 
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
                                                            deleteProduct(productId); 
                                                            getProducts();
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
                                }
                            </div>
                        </div>
                        <div className="row align-items-center g-3 px-3 py-1">
                            <div className="col-md-5">
                                <div id={ `carouselImage${itemId}` } className="carousel slide">
                                    <div className="carousel-inner position-relative" style={{ width: '215px', height: '215px' }}>
                                        <div className="images">
                                            { (imgsSrc?.length > 0) && imgsSrc?.map((imgSrc, imgSrcIndex) => {
                                                    return (
                                                        <div key={ imgSrcIndex } className={`carousel-item ${ (imgSrcIndex == 0) && `active` }`}>
                                                            <img src={ imgSrc?.[imgSrcIndex]?.image ? imgSrc?.[imgSrcIndex]?.image 
                                                                                                : imgSrc?.large ? imgSrc?.large
                                                                                                : imgSrc?.hi_res ? imgSrc?.hi_res
                                                                                                : imgSrc?.thumb ? imgSrc?.thumb
                                                                                                : imgSrc } className="d-block object-fit-cover border-radius-35" style={{ width: '215px', height: '215px' }} alt="..." />
                                                        </div>
                                                    )
                                                }) 
                                            }
                                        </div>

                                        <div>
                                            <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target={ `#carouselImage${itemId}` } data-bs-slide="prev">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                    </svg>
                                                </span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target={ `#carouselImage${itemId}` } data-bs-slide="next">
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
                                    { (location.pathname.startsWith('/home/ordered-items')) &&
                                        <small className="card-text">#:&nbsp;<small className="fw-semibold">{ orderId }</small></small> 
                                    } 
                                    { (location.pathname.startsWith('/home/market')) && 
                                        <div className="pb-2">
                                            <span className="btn btn-sm btn-dark border-radius-35 py-0">
                                                <span className="d-flex align-items-center gap-1"> 
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-boxes" viewBox="0 0 16 16">
                                                    <path
                                                        d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
                                                </svg>
                                                    <span 
                                                        onClick={ async () => await addToShop(asin) }
                                                        className="fw-semibold">Add to Shop</span> 
                                                </span>
                                            </span> 
                                        </div>
                                    }
                                    <h4 className="card-title fs-6">{ title }</h4>
                                    { (variations && variationsValue) && 
                                        <span className="card-text">
                                            <small>Options:&nbsp;
                                                <span className="fw-semibold">{ variationsValue }&nbsp;{ variations }
                                                </span>
                                            </small>
                                        </span>
                                    } 
                                    { orderCount && 
                                        <span className="card-text">
                                            { formatNumber(Number(orderCount)) }&nbsp;
                                            bought
                                        </span> 
                                    }
                                    { !location.pathname.startsWith('/home/market') && (
                                        <span className="card-text">
                                            <small><s>{ oldPrice && '$'+Number(oldPrice)?.toFixed(2) }</s>{ oldPrice && <span>&nbsp;</span>}</small>
                                            { (!location.pathname.startsWith('/home/sales')) 
                                                ?   <span className="fw-semibold">
                                                        { currentPrice ? '$'+Number(currentPrice)?.toFixed(2) : '$'+0 }
                                                    </span>
                                                    :   <span className="fw-semibold">
                                                            { sellingPrice ? '$'+Number(sellingPrice)?.toFixed(2) : '$'+0 }
                                                        </span> 
                                                    }
                                        </span>
                                    ) }
                                    <div className="d-flex pt-1">
                                        { ((location.pathname.startsWith('/home/ordered-items')) &&
                                            ((user?.user?.role == 'individual') || (user?.user?.role == 'vendor'))) 
                                            ?   <div>
                                                    <span 
                                                        type="button"
                                                        data-bs-toggle="modal" 
                                                        data-bs-target={`#ratingModal${itemId}`}
                                                        className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                                        <span className="d-flex align-items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12.5" height="12.5" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                                            </svg> 
                                                            <span>Rate</span> 
                                                        </span>
                                                    </span> 

                                                    <div className="modal fade" id={`ratingModal${itemId}`} tabindex="-1" aria-labelledby={`ratingModal${itemId}Label`} aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <form onSubmit={ submitReview }>
                                                                <div className="modal-content">
                                                                    <div className="modal-header d-flex justify-content-between align-items-center gap-1">
                                                                        <h3 className="modal-title fs-6" id={`ratingModal${itemId}Label`}>Rate&nbsp;<span className="fw-semibold fs-5">{ (title)?.slice(0,50) } { (title?.length > 50) && '...' }</span></h3>  
                                                                        <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="fields"> 
                                                                            <div className="stars d-flex gap-2 px-3 pt-2 pb-4">
                                                                                {[1, 2, 3, 4, 5].map((starIndex) => (
                                                                                    <span key={starIndex} className={`star-${starIndex}`}>
                                                                                        {stars[`star_${starIndex}`] ? (
                                                                                            <span onClick={() => handleStarClick(starIndex - 1)}>
                                                                                                <ActiveStar />
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span onClick={() => handleStarClick(starIndex)}>
                                                                                                <InactiveStar />
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                            <div className="row g-2">
                                                                                <div className="col-md">
                                                                                    <div className="mb-3"> 
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-text border-radius-35 fw-semibold">Title</span>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                value={ productReview?.data?.title ?? '' } 
                                                                                                onChange={ e => productReview.setData({
                                                                                                    ...productReview?.data,
                                                                                                    title: e.target.value,
                                                                                                }) }
                                                                                                placeholder='e.g. Excellent buy!' 
                                                                                                id="title" 
                                                                                                className="form-control border-radius-35" 
                                                                                                aria-label="Item Review Title" 
                                                                                                aria-describedby="Item review title" />
                                                                                        </div>
                                                                                        <div className="form-text px-3" id="basic-addon4"><small>Item Review Title.</small></div>
                                                                                    </div>
                                                                                </div> 
                                                                            </div> 
                                                                            <div className="row g-2">
                                                                                <div className="mb-3">
                                                                                    <div className="input-group">
                                                                                        <span className="input-group-text border-radius-35 fw-semibold">Comment</span>
                                                                                        <textarea 
                                                                                            value={ productReview?.data?.comment ?? '' } 
                                                                                            onChange={ e => productReview.setData({
                                                                                                ...productReview?.data,
                                                                                                comment: e.target.value,
                                                                                            }) }
                                                                                            placeholder='e.g. This is an awesome buy!' 
                                                                                            id="comment" 
                                                                                            className="form-control border-radius-35" 
                                                                                            aria-label="Item Review Comment" 
                                                                                            aria-describedby="item review comment"></textarea>
                                                                                    </div> 
                                                                                    <div className="form-text px-3" id="desription-1"><small>Item Review Comment.</small></div>
                                                                                </div>
                                                                            </div> 
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="submit" className="btn btn-dark px-2 py-1 border-radius-35">
                                                                            <span><small>Save</small></span>&nbsp;
                                                                            <span>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17.8" height="17.8" fill="currentColor" className="bi bi-arrow-right-circle"
                                                                                    viewBox="0 0 16 16">
                                                                                    <path fillRule="evenodd"
                                                                                        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                                                </svg>
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form> 
                                                        </div>
                                                    </div>
                                                </div>
                                                :   (!location.pathname.startsWith('/home/favorites')) 
                                                        ?   <div className="d-flex flex-column">
                                                                { (dealValue && dealValueUnit) && 
                                                                    <span className="card-text">
                                                                        <small>
                                                                            <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">
                                                                                Save 
                                                                                { (!location.pathname.startsWith('/home/ordered-items')) && 'd' }
                                                                                { dealValue + (dealValueUnit)?.toUpperCase() }
                                                                            </span>&nbsp;
                                                                            with coupon
                                                                        </small>
                                                                    </span> 
                                                                } 
                                                                { (deliveryStatus == 'pending') 
                                                                    ? <span className="text-warning fw-semibold pt-1">Not yet delivered</span> 
                                                                        : '' }
                                                                <span className="card-text">
                                                                    { (deliveryStatus == 'delivered') ? 'Delivered' 
                                                                        : (deliveryStatus == 'pending') ? 'Delivery on' 
                                                                            : '' }&nbsp;
                                                                    <span className="fw-semibold">
                                                                        { (deliveryStatus == 'delivered') ? dayjs(deliveryDate).format('dddd, MMMM D, YYYY h:mm A') 
                                                                            : (deliveryStatus == 'pending') ? dayjs(deliveryDate).format('dddd, MMMM D, YYYY') 
                                                                                : '' } 
                                                                    </span>
                                                                </span> 
                                                                { !(user && user?.user?.role == 'admin') && 
                                                                    <span>
                                                                        { (cartItems?.length > 0) && cartItems?.find(item => item?.id == asin) ? 
                                                                            <svg 
                                                                                type="button"
                                                                                onClick={ () => removeFromCart(asin) }
                                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                                width="20" 
                                                                                height="20" 
                                                                                fill="currentColor" 
                                                                                className="bi bi-handbag-fill" 
                                                                                viewBox="0 0 16 16">
                                                                                <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2M5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0z"/>
                                                                            </svg> :
                                                                            <svg 
                                                                                type="button" 
                                                                                onClick={ () => {addToCart(itemId, 
                                                                                                            asin, 
                                                                                                            imgsSrc, 
                                                                                                            title, 
                                                                                                            description, 
                                                                                                            oldPrice, 
                                                                                                            currentPrice
                                                                                )} }
                                                                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-handbag" viewBox="0 0 16 16">
                                                                                <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
                                                                            </svg> } 
                                                                    </span> }
                                                            </div> 
                                                                :   <div className="d-flex flex-wrap gap-2">
                                                                        <span 
                                                                            type="button" 
                                                                            onClick={ async () => { 
                                                                                        setDisplayComponent(false); 
                                                                                        await deleteFavorite(itemId); 
                                                                                        await getFavorites();
                                                                                    } } 
                                                                            title="Remove favorite"
                                                                            className="card-text cursor-pointer">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="000000" className="bi bi-bookmark-x" viewBox="0 0 16 16">
                                                                                    <path fillRule="evenodd" d="M6.146 5.146a.5.5 0 0 1 .708 0L8 6.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 7l1.147 1.146a.5.5 0 0 1-.708.708L8 7.707 6.854 8.854a.5.5 0 1 1-.708-.708L7.293 7 6.146 5.854a.5.5 0 0 1 0-.708"/>
                                                                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                                                                                </svg>
                                                                        </span>
                                                                        <span>
                                                                            { (cartItems?.length > 0) && cartItems?.find(item => item?.id == asin) ? 
                                                                                <svg 
                                                                                    type="button"
                                                                                    onClick={ () => removeFromCart(asin) }
                                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                                    width="20" 
                                                                                    height="20" 
                                                                                    fill="currentColor" 
                                                                                    className="bi bi-handbag-fill" 
                                                                                    viewBox="0 0 16 16">
                                                                                    <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2M5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0z"/>
                                                                                </svg> :
                                                                                <svg 
                                                                                    type="button" 
                                                                                    onClick={ () => {addToCart(itemId, 
                                                                                                                asin, 
                                                                                                                imgsSrc, 
                                                                                                                title, 
                                                                                                                description, 
                                                                                                                oldPrice, 
                                                                                                                currentPrice
                                                                                    )} }
                                                                                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-handbag" viewBox="0 0 16 16">
                                                                                    <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
                                                                                </svg> } 
                                                                        </span>
                                                                    </div> } 
                                    </div> 
                                </div>
                            </div> 
                        </div>
                    </div> 

                    <div className="modal fade" id={ `productModal${itemId}` } tabIndex="-1" aria-labelledby={ `productModal${itemId}Label` } aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                            <div className="modal-content">
                                <div className="modal-header d-flex justify-content-end align-items-center gap-1">
                                    <h3 className="modal-title fs-5 d-none" id={ `productModal${itemId}Label` }>{ title }</h3>
                                    <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row align-items-center justify-content-between p-4 pt-2 g-3">
                                        <div className="col-md-5">
                                            <div id={ `carouselModalImage${itemId}` } className="carousel slide">
                                                <div className="carousel-inner position-relative" style={{ width: '215px', height: '215px' }}>
                                                    <div className="images">
                                                        {console.log(imgsSrc)}
                                                        {console.log(imgsSrc[0])}
                                                        { (imgsSrc?.length > 0) && imgsSrc?.map((imgSrc, imgSrcIndex) => {
                                                            console.log(imgSrc);
                                                            console.log(imgSrc?.[0]?.image);
                                                                return (
                                                                    <div key={ imgSrcIndex } className={`carousel-item ${ (imgSrcIndex == 0) && `active` }`}>
                                                                        <img src={ imgSrc?.[imgSrcIndex]?.image ? imgSrc?.[imgSrcIndex]?.image 
                                                                                                    : imgSrc?.large ? imgSrc?.large
                                                                                                    : imgSrc?.hi_res ? imgSrc?.hi_res
                                                                                                    : imgSrc?.thumb ? imgSrc?.thumb
                                                                                                    : imgSrc } className="d-block object-fit-cover border-radius-35" style={{ minWidth: '175px', maxWidth: '215px', ninHeight: '175px', maxHeight: '215px' }} alt="..." />
                                                                    </div>
                                                                )
                                                            }) 
                                                        }
                                                    </div> 

                                                    <div>
                                                        <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target={ `#carouselModalImage${itemId}` } data-bs-slide="prev">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                </svg>
                                                            </span>
                                                            <span className="visually-hidden">Previous</span>
                                                        </button>
                                                        <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target={ `#carouselModalImage${itemId}` } data-bs-slide="next">
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
                                                <h4 className="card-title fs-4">{ title }</h4>
                                                { (variations && variationsValue) && 
                                                    <span className="card-text">
                                                        <small>Options:&nbsp;
                                                            <span className="fw-semibold">{ variationsValue }&nbsp;{ variations }
                                                            </span>
                                                        </small>
                                                    </span>
                                                } 
                                                { orderCount && 
                                                    <span className="card-text">
                                                        { formatNumber(Number(orderCount)) }&nbsp;
                                                        bought in the last month
                                                    </span> 
                                                }
                                                { !location.pathname.startsWith('/home/market') && (
                                                    <span className="card-text">
                                                        <small><s>{ oldPrice && '$'+Number(oldPrice)?.toFixed(2) }</s>{ oldPrice && <span>&nbsp;</span>}</small>
                                                        { (!location.pathname.startsWith('/home/sales')) 
                                                            ?   <span className="fw-semibold">
                                                                    { currentPrice ? '$'+Number(currentPrice)?.toFixed(2) : '$'+0 }
                                                                </span> 
                                                                :   <span className="fw-semibold">
                                                                        { sellingPrice ? '$'+Number(sellingPrice)?.toFixed(2) : '$'+0 }
                                                                    </span> 
                                                                }
                                                    </span> 
                                                ) }
                                                    
                                                { (dealValue && dealValueUnit) && 
                                                    <span className="card-text">
                                                        <small>
                                                            <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">
                                                                Save 
                                                                { (!location.pathname.startsWith('/home/ordered-items')) && 'd' }
                                                                { dealValue + (dealValueUnit)?.toUpperCase() }
                                                            </span>&nbsp;
                                                            with coupon
                                                        </small>
                                                    </span> 
                                                } 
                                                { (deliveryStatus == 'pending') 
                                                    ? <span className="text-warning fw-semibold pt-1">Not yet delivered</span> 
                                                        : '' }
                                                <span className="card-text">
                                                    { (deliveryStatus == 'delivered') ? 'Delivered' 
                                                        : (deliveryStatus == 'pending') ? 'Delivery on' 
                                                            : '' }&nbsp;
                                                    <span className="fw-semibold">
                                                        { (deliveryStatus == 'delivered') ? dayjs(deliveryDate).format('dddd, MMMM D, YYYY h:mm A') 
                                                            : (deliveryStatus == 'pending') ? dayjs(deliveryDate).format('dddd, MMMM D, YYYY') 
                                                                : '' } 
                                                    </span>
                                                </span> 
                                            </div>
                                        </div>
                                    </div> 

                                    { (location.pathname.startsWith('/home/sales')) && (
                                        <div className="sales px-3 pt-3">
                                            <section className="orders d-flex flex-column">
                                                <h4 className="border-bottom fs-6">Order Details</h4> 
                                                <div className="d-flex flex-column">
                                                    <p className="my-0">
                                                        <Link 
                                                            to={ route('home.orders.show', { id: orderId }) } 
                                                            target="_blank" 
                                                            className="text-dark">
                                                            <small><small>#{ orderId }</small></small>
                                                        </Link>    
                                                    </p> 
                                                    <p className="my-0"><small>Total paid:&nbsp;</small><span className="fw-semibold">${ (orderPrice)?.toFixed(2) }</span></p>
                                                    <p className="my-0 text-secondary"><small><small>{ dayjs.utc(saleDate).fromNow() }</small></small></p>
                                                </div>
                                            </section>
                                            <section className="product d-flex flex-column pt-3">
                                                <h4 className="border-bottom fs-6">Product Details</h4> 
                                                <div className="d-flex flex-column">
                                                    <p className="my-0">
                                                        <Link 
                                                            to={ route('products.show', { source: 'shop', id: productId }) } 
                                                            target="_blank" 
                                                            className="text-dark" 
                                                            style={{ textTransform: "capitalize" }}>
                                                                <small><small>{ title }</small></small>
                                                        </Link>    
                                                    </p> 
                                                    <div className="pt-3">
                                                        <p className="my-0">
                                                            <small>Bought:&nbsp;</small>
                                                            <span className="fw-semibold">
                                                                ${ Number(purchasePrice)?.toFixed(2) }&nbsp;
                                                            </span><small><small>{ dayjs.utc(purchaseDate).fromNow() }</small></small>
                                                        </p>

                                                        <p className="my-0">
                                                            <small>Sold:&nbsp;</small>
                                                            <span className="fw-semibold">
                                                                ${ Number(sellingPrice)?.toFixed(2) }&nbsp;
                                                            </span><small><small>{ dayjs.utc(saleDate).fromNow() }</small></small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    ) }
                                    
                                    { (!location.pathname.startsWith('/home/sales')) && 
                                        <div className="d-flex justify-content-end px-4 pt-4 pb-2">
                                            <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                                <Link 
                                                    to={ route('products.show', 
                                                            { source: ((location?.pathname)?.startsWith('/home/market') 
                                                                ? 'market' 
                                                                    : 'shop'), 
                                                            id: productId }) } 
                                                    target="_blank"  
                                                    className="text-decoration-none ps-1 fw-semibold text-white"> 
                                                    <span className="fw-semibold">See full details</span>&nbsp;
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                        <path
                                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                    </svg>
                                                </Link>
                                            </span>
                                        </div> 
                                    }
                                </div>
                                <div className="modal-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                </> }
        </>
    )
}
