import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { Link, useLocation, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import formatNumber from '@/utils/FormatNumber.jsx';
import { useFavorites } from '@/hooks/useFavorites.jsx'; 
import { useFavorite } from '@/hooks/useFavorite.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 


export default function ProductComponent2({ source, 
                                            itemId, 
                                            productId, 
                                            asin, 
                                            index,
                                            imgSrc, 
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
    const params = useParams();
    const { user } = useContext(AuthContext);
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext); 
    const { favorites, getFavorites } = useFavorites(); 
    
    const { createFavorite, deleteFavorite } = useFavorite(); 

    return (
        <article className="card border-0 mb-5">
            <div className="row align-items-center g-3">
                <div className="col-sm-12 col-lg-4 d-flex justify-content-center">
                    <Link 
                        to={ route('products.show', { id: itemId, source: (params?.source || 'shop') }) } 
                        className="text-decoration-none text-dark">
                            <div id={`carouselExample${itemId}`} className="carousel slide">
                                <div className="carousel-inner position-relative" style={{ width: '225px', height: '250px' }}>
                                    <div className="images">
                                        { (imgSrc?.length > 0) && (imgSrc?.map((image, index) => {
                                            // console.log(image)
                                            return (
                                                <div className={`carousel-item ${(index==0) && `active`}`}>
                                                    <img src={ image?.hi_res ? image?.hi_res
                                                                : image?.large ? image?.large
                                                                : image?.thumb ? image?.thumb
                                                                : image } className="d-block img-fluid object-fit-cover border-radius-35" style={{ width: '225px', height: '250px' }} alt="..." />
                                                </div>
                                            )
                                        }))} 
                                    </div>

                                    <div>
                                        <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target={`#carouselExample${itemId}`} data-bs-slide="prev">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                </svg>
                                            </span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target={`#carouselExample${itemId}`} data-bs-slide="next">
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
                    </Link>
                </div>
                <div className="col-sm-12 col-lg-8">
                    <div className="card-body d-flex flex-column gap-0">
                        <h4 className="card-title fs-4">
                            <Link 
                                to={ route('products.show', { id: itemId, source: params?.source }) } 
                                className="text-decoration-none text-dark word-wrap">
                                    { title }
                            </Link>
                        </h4>
                        { (variations && variationsValue) && 
                            <span className="card-text">
                                <small>Options:&nbsp;
                                    <span className="fw-semibold">{ variationsValue }&nbsp;{ variations }
                                    </span>
                                </small>
                            </span>
                        } 
                        { (orderCount>0) && 
                            <span className="card-text">
                                { (Number(orderCount)>0) && formatNumber(Number(orderCount)) }&nbsp;
                                bought
                            </span> 
                        }
                        <span className="card-text fs-5">
                            { (Number(oldPrice)?.toFixed()>0) &&
                                <small><s>{ oldPrice && '$'+Number(oldPrice)?.toFixed(2) }</s>{ oldPrice && <span>&nbsp;</span>}</small>
                            }
                            { (!location.pathname.startsWith('/home/sales')) 
                                ?   <span className="fw-semibold">
                                        { currentPrice ? '$'+Number(currentPrice)?.toFixed(2) : '$'+0 }
                                    </span>
                                    :   <span className="fw-semibold">
                                            { sellingPrice ? '$'+Number(sellingPrice)?.toFixed(2) : '$'+0 }
                                        </span> 
                                    }
                        </span> 
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
                        <div className="pt-2 d-flex gap-3">
                            <span 
                                type="button" 
                                onClick={ async () => {
                                            await createFavorite(itemId); 
                                            await getFavorites();
                                        } }
                                className="cursor-pointer">
                                    { (favorites?.data?.length > 0) && favorites?.data?.find(foundFavorite => foundFavorite?.product?.asin == itemId) 
                                        ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                                            </svg>
                                        : 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bookmark"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                            </svg>
                                        
                                    }
                            </span> 
                            {/* { !(user && user?.user?.role == 'admin') &&  */}
                            <span>
                                { (cartItems?.length > 0) && cartItems?.find(item => item?.id == asin) ? 
                                    <svg 
                                        type="button"
                                        onClick={ () => removeFromCart(asin) }
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="25" 
                                        height="22" 
                                        fill="currentColor" 
                                        className="bi bi-handbag-fill" 
                                        viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2M5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0z"/>
                                    </svg> :
                                    <svg 
                                        type="button" 
                                        onClick={ () => {addToCart(itemId, 
                                                                    asin, 
                                                                    // imgSrc, 
                                                                    imgSrc?.[0]?.hi_res ? imgSrc?.[0]?.hi_res
                                                                        : imgSrc?.[0]?.large ? imgSrc?.[0]?.large
                                                                        : imgSrc?.[0]?.thumb,
                                                                    title, 
                                                                    description, 
                                                                    oldPrice, 
                                                                    currentPrice
                                        )} }
                                        xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-handbag" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
                                    </svg> } 
                            </span> 
                            {/* } */}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
