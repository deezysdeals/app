import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import formatNumber from '@/utils/FormatNumber.jsx';
import { useFavorites } from '@/hooks/useFavorites.jsx'; 
import { useFavorite } from '@/hooks/useFavorite.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 


export default function ProductComponent3({ productArticle }) {
    const params = useParams(); 
    const source = params?.source; 
    const { user } = useContext(AuthContext);
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext); 
    const { favorites, getFavorites } = useFavorites(); 
    const { createFavorite, deleteFavorite } = useFavorite(); 

    return (
        <>
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main">
                    <section className="products pt-3">
                        <article className="card border-0 mb-5">
                            <a href="#" className="text-decoration-none text-dark">
                                <div className="row align-items-center g-3">
                                    <div className="col-sm-12 col-md-5">
                                        <div id="carouselExample" className="carousel slide">
                                            <div className="carousel-inner position-relative" style={{ width: '225px', height: '250px' }}>
                                                { params?.source == 'market' && 
                                                    <div className="images">
                                                        { (productArticle?.data?.image?.length > 0) && (productArticle?.data?.image?.map((image, index) => {
                                                            return (
                                                                <div className={`carousel-item ${(index==0) && `active`}`}>
                                                                    <img src={ image } className="d-block img-fluid object-fit-cover border-radius-35" style={{ width: '225px', height: '250px' }} alt="..." />
                                                                </div>
                                                            )
                                                        }))} 
                                                    </div> 
                                                }
                                                { params?.source == 'shop' && 
                                                    <div className="images">
                                                        { (productArticle?.data?.images?.length > 0) && (productArticle?.data?.images?.map((image, index) => {
                                                            return (
                                                                <div key={ image?.image_path?.url } className={`carousel-item ${(index==0) && `active`}`}>
                                                                    <img src={ image?.image_path?.url } className="d-block img-fluid object-fit-cover border-radius-35" style={{ width: '225px', height: '250px' }} alt="..." />
                                                                </div>
                                                            )
                                                        }))} 
                                                    </div> 
                                                }

                                                <div>
                                                    <button className="carousel-control-prev position-absolute left-0 ps-1" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                            </svg>
                                                        </span>
                                                        <span className="visually-hidden">Previous</span>
                                                    </button>
                                                    <button className="carousel-control-next position-absolute right-0 pe-1" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
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
                                    <div className="col-sm-12 col-md-7">
                                        <div className="card-body d-flex flex-column gap-0">
                                            <h4 className="card-title fs-4 text-capitalize word-wrap">{ productArticle?.data?.title }</h4>
                                            {/* <span className="card-text">
                                                <small>Options: <span className="fw-semibold">7 sizes</span>
                                                </small>
                                            </span> */}
                                            { (productArticle?.data?.order_count>0) &&
                                                <span className="card-text">{ formatNumber(Number(productArticle?.data?.order_count))} bought</span>
                                            }
                                            <span className="card-text">
                                                { (Number(productArticle?.data?.initial_retail_price)>0) &&
                                                    <small>
                                                        <s>${ Number(productArticle?.data?.initial_retail_price) }</s>&nbsp;
                                                    </small> 
                                                }
                                                <span className="fw-semibold fs-1">
                                                    ${ Number(productArticle?.data?.retail_price) || Number(productArticle?.data?.price) }
                                                </span>
                                            </span>
                                            { (productArticle?.data?.deal) && (
                                                <span className="card-text">
                                                    <small>
                                                        {/* <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">Save $15.00</span>&nbsp;with coupon */}
                                                        <span className="bg-success border-radius-35 px-2 py-1 text-white fw-semibold">Save&nbsp;
                                                            { productArticle?.data?.deal?.value + (productArticle?.data?.deal?.unit)?.toUpperCase() }
                                                        </span>&nbsp;with coupon
                                                    </small>
                                                </span>
                                            ) }
                                            { (productArticle?.data?.delivery_timeframe_min && productArticle?.data?.delivery_timeframe_max) && (
                                                <span className="card-text">Delivery&nbsp;
                                                    <span className="fw-semibold">usually takes&nbsp;
                                                        { productArticle?.data?.delivery_timeframe_min } 
                                                        { (productArticle?.data?.delivery_timeframe_max && (productArticle?.data?.delivery_timeframe_max>productArticle?.data?.delivery_timeframe_min)) ? (
                                                            <span>{' - ' + productArticle?.data?.delivery_timeframe_max + ' days'}</span>
                                                        ) : <span>day</span>}
                                                        </span>
                                                </span>
                                            )}
                                            
                                            {/* <span>
                                                <small>More Buying Choices:</small>
                                                <small className="fw-semibold">$400.98(46 used & new offers)</small>
                                            </span> */}
                                            <div className="pt-2 d-flex gap-3">
                                                <span 
                                                    type="button" 
                                                    onClick={ async () => {
                                                                await createFavorite(productArticle?.data?._id); 
                                                                await getFavorites();
                                                            } }
                                                    className="cursor-pointer">
                                                        { (favorites?.data?.length > 0) && favorites?.data?.find(foundFavorite => foundFavorite?.product?.asin == productArticle?.data?.asin) 
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
                                                    { (cartItems?.length > 0) && cartItems?.find(item => item?.id == productArticle?.data?.asin) ? 
                                                        <svg 
                                                            type="button"
                                                            onClick={ () => removeFromCart(productArticle?.data?.asin) }
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
                                                            onClick={ () => {addToCart(productArticle?.data?._id, 
                                                                                        productArticle?.data?.asin, 
                                                                                        productArticle?.data?.images?.[0]?.image_path?.url, 
                                                                                        productArticle?.data?.title, 
                                                                                        productArticle?.data?.descriptions[0]?.content, 
                                                                                        productArticle?.data?.initial_retail_price, 
                                                                                        productArticle?.data?.retail_price
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
                            </a>
                        </article>
                    </section>

                    <section>
                        <h4 className="fw-semibold fs-5 border-bottom pb-2">About this item</h4> 

                        <div>
                            <ul>
                                {
                                    (productArticle?.data?.descriptions?.length > 0) && 
                                    productArticle?.data?.descriptions.map((description, index) => {
                                        return (
                                        <li 
                                            key={ description?._id } 
                                            className=""
                                            // style={{ marginLeft: index == 0 ? 'unset' : 'initial' }}>
                                            style={{ marginLeft: 'unset' }}>
                                            { description?.content } 
                                        </li>
                                        );
                                    })
                                }
                            </ul>
                        </div> 

                        <div className="pt-4">
                            <span>
                                <a href="#features" className="text-dark fw-semibold fs-6">View More Features</a>
                            </span>
                        </div>
                    </section>
                </div>

            </section> 

            <section className="features px-3 pt-5">
                <details>
                    <summary>
                        <h4 className="fw-semibold fs-5 border-bottom pb-2">Features</h4>
                    </summary> 

                    <div id="features" className="pt-3">
                        {
                            (productArticle?.data?.features?.length > 0) && 
                            productArticle?.data?.features.map((feature, index) => {
                                return (
                                    <li 
                                        key={ feature?._id } 
                                        className=""
                                        // style={{ marginLeft: index == 0 ? 'unset' : 'initial' }}>
                                        style={{ marginLeft: 'unset' }}>
                                            { feature?.content } 
                                    </li>
                                );
                            })
                        }
                    </div>

                    <div className="table-responsive col-md-9 pt-4">
                        <table className="table table-hover align-middle">
                            <tbody>
                                {
                                    (productArticle?.data?.info?.length > 0) && 
                                    productArticle?.data?.info.map((infoItem, index) => {
                                        return (
                                            <tr key={ infoItem?._id }>
                                                <th scope="row">{ infoItem?.dynamic_data[0] }</th>
                                                <td colSpan="2">{ infoItem?.dynamic_data[1] }</td>
                                            </tr>
                                        );
                                    })
                                }
                                {/* <tr>
                                    <th scope="row">Standing screen display size</th>
                                    <td colSpan="2">15.6 Inches</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </details>
            </section>
        </>
    )
}
