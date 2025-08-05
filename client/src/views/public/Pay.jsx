import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
// import axios from 'axios'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 
import {
    PayPalScriptProvider,
    PayPalButtons
} from "@paypal/react-paypal-js";
import Constants from '@/utils/Constants.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Pay() { 
    const { authTokens } = useContext(AuthContext); 
    const { cartItems, getTotalPrice, clearCart } = useContext(CartContext); 
    // console.log(cartItems); 
    const axiosInstance = useAxios(); 
    const navigate = useNavigate(); 

    const { order, createOrderPayOnDelivery, createOrderAndPay } = useOrder(); 

    return ( 
        <Layout> 
            { scrollToTop() }
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main py-2 pb-4 z-1"> 

                    <h2 className="border-bottom pb-1 mb-4 pt-3 fs-4">Payment</h2> 

                    <section className="d-flex amount pb-4">
                        <span>Amount Payable:&nbsp;<span className="fw-semibold fs-3">${ getTotalPrice()?.toFixed(2) }</span></span> 
                    </section> 

                    <section className="d-flex flex-column justify-content-center align-items-start flex-wrap gap-4" style={{ maxWidth: '600px' }}> 

                        <div className="w-100"> 
                            { (order?.loading == false) && (
                                <button 
                                    onClick={ async () => { 
                                        let cart = cartItems; 
                                        console.log(cart)
                                        await createOrderPayOnDelivery(cart); 
                                    }}
                                    className="btn btn-dark border-radius-35 w-100 py-2">Pay Later&nbsp;
                                        <span className="fw-bold fst-italic">On Delivery</span>
                                </button>
                            ) }
                        </div> 

                        <div className="w-100"> 
                            { (order?.loading == false) && (
                                <button 
                                    onClick={ async () => { 
                                        let cart = cartItems; 
                                        console.log(cart)
                                        await createOrderAndPay(cart); 
                                    }}
                                    className="btn btn-dark border-radius-35 w-100 py-2">Pay Now
                                </button>
                            ) }
                        </div> 

                    </section>

                    <section className="ordered-items pt-5" style={{ maxWidth: '600px' }}> 
                        <h4 className="fw-semibold border-bottom pb-1 fs-6">Cart Items (Preview)</h4>
                        <ol className='list-unstyled d-flex flex-column gap-1'> 
                            {(cartItems?.length > 0) && (cartItems?.map((item, index) => {
                                // console.log(item); 
                                // console.log(item?.img); 
                                return (
                                    <li key={ index } className="ordered-item row align-items-center gx-5 gy-1 py-1">
                                        <div className="col-md-2">
                                            <div id={`carousel2ModalItem${index}`} className="carousel slide">
                                                <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                    <div className="images"> 
                                                        { (item?.img?.length > 0) && ([item?.img]?.map((image, index) => {
                                                            console.log(item)
                                                            return (
                                                                <div className={`carousel-item ${(index==0) && `active`}`}>
                                                                    <img src={image?.hi_res
                                                                                ? image?.hi_res
                                                                                : image?.large
                                                                                ? image?.large
                                                                                : image?.thumb
                                                                                ? image?.thumb
                                                                                : image} className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                                </div>
                                                            )
                                                        })) }
                                                    </div> 
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-10">
                                            <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                                <h5>{ (item?.title)?.slice(0, 20) }&nbsp;{ ((item?.title)?.length >= 20) && '...' }</h5>
                                                <div className=""><small className="quantity">{ item?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ Number(item?.currentPrice)?.toFixed(2) }</span></div>
                                            </div>
                                        </div> 
                                    </li>
                                )
                            }))} 
                        </ol> 

                        <div className="text-end border-top border-bottom py-1">
                            <span className="fw-semibold fs-5">${ getTotalPrice()?.toFixed(2) }</span>
                        </div>
                    </section> 
                    
                </div> 

            </section> 

        </Layout>
    )
} 
