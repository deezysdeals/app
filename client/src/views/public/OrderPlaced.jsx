import { useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 
import OrderPlacedAnime from '../../assets/images/order-placed.gif';  


export default function OrderPlaced() { 
    // const scrollToTop = () => {
    //     window.scrollTo(0, 0); 
    // }; 

    // const scrollToTop = () => {
    //     window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //     });
    // }; 

    useEffect(() => {
        scrollToTop(); 
    }, []); 

    return (
        <Layout> 
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                {/* <div className="main py-2 pb-4 z-1">  */}
                <div className="main py-5 z-1"> 

                    {/* <div className="order-placed-container vh-100 d-flex flex-column align-items-center pt-5">
                        <h1>Thank you for choosing us!</h1>
                        <p>Your order has been successfully placed.</p>
                        <p>
                            <img src={ OrderPlacedAnime } alt="" />
                        </p>
                    </div>  */}

                    <section className="order-placed-container d-flex justify-content-center align-items-center flex-wrap gap-2">
                        <div className="d-flex flex-column align-items-center gap-2">
                            <h1 className="text-center">Thank you for choosing DeezysDeals!</h1>
                            <p className="text-center">Your order has been successfully placed.</p>
                            <p>
                                <img src={ OrderPlacedAnime } alt="" />
                            </p>
                            <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                <Link to={ route('products.index', { source: 'shop' }) } className="text-decoration-none ps-1 fw-semibold text-white d-flex align-items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                                    </svg>
                                    <span className="fw-semibold">Continue shopping</span>&nbsp;
                                </Link>
                            </span>
                        </div>
                    </section>

                </div> 
            </section> 
        </Layout>
    )
}
