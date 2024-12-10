import { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext.jsx'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useFavorites } from '@/hooks/useFavorites.jsx'; 
import { useFavorite } from '@/hooks/useFavorite.jsx'; 
import { useProductReview } from '@/hooks/useProductReview.jsx'; 


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
                                            orderId }) { 
    const location = useLocation(); 
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext); 
    const { getFavorites } = useFavorites(); 
    const { deleteFavorite } = useFavorite(); 
    const { productReview, createProductReview } = useProductReview(); 
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
                            <span 
                                type="button" 
                                data-bs-toggle="modal" data-bs-target={ `#productModal${itemId}` }
                                className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                    View { (location?.pathname)?.startsWith('/home/ordered-items') && `Item` } Details
                            </span>
                        </div>
                        <div className="row align-items-center g-3 px-3 py-1">
                            <div className="col-md-5">
                                <div id={ `carouselImage${itemId}` } className="carousel slide">
                                    <div className="carousel-inner position-relative" style={{ width: '215px', height: '215px' }}>
                                        <div className="images">
                                            { (imgsSrc?.length > 0) && imgsSrc?.map((imgSrc, imgSrcIndex) => {
                                                    return (
                                                        <div key={ imgSrcIndex } className={`carousel-item ${ (imgSrcIndex == 0) && `active` }`}>
                                                            <img src={ imgSrc } className="d-block object-fit-cover border-radius-35" style={{ width: '215px', height: '215px' }} alt="..." />
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
                                        <span className="card-text">Order #:&nbsp;<span className="fw-semibold">{ orderId }</span></span> 
                                    } 
                                    { (location.pathname.startsWith('/home/market')) && 
                                        <div className="pb-2">
                                            <span className="btn btn-sm btn-dark border-radius-35 py-0">
                                                <span className="d-flex align-items-center gap-1"> 
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-handbag" viewBox="0 0 16 16">
                                                        <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
                                                    </svg>
                                                    <span className="fw-semibold">Buy for Shop at ${ Number(currentPrice)?.toFixed(2) }</span> 
                                                </span>
                                            </span> 
                                        </div>
                                    }
                                    <h4 className="card-title fs-6">{ title }</h4>
                                    <span className="card-text"><small>Options: <span className="fw-semibold">7
                                                sizes</span></small></span>
                                    <span className="card-text">10k+ bought in the last month</span>
                                    <span className="card-text"><small><s>$86.99</s></small>&nbsp;<span className="fw-semibold">${ Number(currentPrice)?.toFixed(2) }</span></span> 

                                    <div className="d-flex pt-1">
                                        { (location.pathname.startsWith('/home/ordered-items')) 
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
                                                                <span className="card-text">
                                                                    <small>
                                                                        <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">
                                                                            Save $15.00
                                                                        </span>&nbsp;
                                                                        with coupon
                                                                    </small>
                                                                </span>
                                                                <span className="card-text">Delivered&nbsp;
                                                                    <span className="fw-semibold">
                                                                    Fri, Aug 30
                                                                    </span>
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
                                                        { (imgsSrc?.length > 0) && imgsSrc?.map((imgSrc, imgSrcIndex) => {
                                                                return (
                                                                    <div key={ imgSrcIndex } className={`carousel-item ${ (imgSrcIndex == 0) && `active` }`}>
                                                                        <img src={ imgSrc } className="d-block object-fit-cover border-radius-35" style={{ width: '215px', height: '215px' }} alt="..." />
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
                                                <span className="card-text"><small>Options: <span className="fw-semibold">7
                                                            sizes</span></small></span>
                                                <span className="card-text">10k+ bought in the last month</span>
                                                <span className="card-text"><small><s>$86.99</s></small>&nbsp;<span
                                                        className="fw-semibold">$${ Number(currentPrice)?.toFixed(2) }</span></span>
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

                                    <section className="about px-4">
                                        <h4 className="border-bottom pb-2 fs-6">About this Item:</h4> 
                                        <ul>
                                            <li>Powerful Performance: Equipped with an Intel Celeron N5100 processor (4C/4T, 1.1/2.8GHz) and integrated Intel UHD Graphics, ensuring smooth and efficient multitasking for everyday computing tasks.</li> 
                                            <li>Generous Storage & Memory: Features 32GB DDR4 RAM and a 1TB SSD for fast data access and ample storage space, perfect for storing large files and applications.</li> 
                                            <li>Sleek Design & Display: 15.6" FHD (1920x1080) anti-glare display delivers clear and vibrant visuals. The laptop has a modern and durable design with a black PC-ABS chassis, weighing just 1.7 kg (3.75 lbs) for portability.</li> 
                                            <li>Enhanced Connectivity & Security: Includes multiple ports for versatile connectivity - USB 2.0, USB 3.2 Gen 1, HDMI 1.4b, and RJ-45 Ethernet. Features Wi-Fi 5, Bluetooth 5.1, a camera privacy shutter, Firmware TPM 2.0 for added security, and comes with Windows 11 Pro pre-installed.</li> 
                                            <li>Complete Accessory Package for Ultimate Convenience: Alongside the laptop, this package includes a set of valuable accessories to enhance your computing experience. You'll receive a 512GB external hard drive for additional storage, a microfiber cloth for keeping your screen clean and smudge-free, and a hotkey sticker sheet to speed up your workflow. Find your special voucher inside due to package size constraints. Claim your free exclusive gifts with a simple scan, shipped at no extra cost!</li>
                                        </ul>
                                    </section>

                                    <div className="d-flex justify-content-end px-4 pt-4 pb-2">
                                        <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                            <Link to={ route('products.show', { id: productId }) } target="_blank"  className="text-decoration-none ps-1 fw-semibold text-white">
                                                <span className="fw-semibold">See full details</span>&nbsp;
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                </svg>
                                            </Link>
                                        </span>
                                    </div>
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
