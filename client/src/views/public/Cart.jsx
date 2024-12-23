import { useContext, useState } from 'react'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import CartItem from '@/components/public/nested-components/CartItem.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Cart() { 
    const { cartItems, removeFromCart, getTotalQuantity, getTotalPrice, applyDiscount, getTotalPriceWithDiscount, discount, clearCart } = useContext(CartContext); 
    const [discountCode, setDiscountCode] = useState(''); 
    const [cartToggle, setCartToggle] = useState(false); 

    return (
        <Layout> 
            <div className="w-100 d-flex justify-content-between align-items-center pb-2 px-3 gap-2 border-bottom z-3">
                <div className="d-flex align-items-center gap-1">
                    <h2 className="fs-3 fw-semibold mb-0">Cart Items</h2>
                    <span className="mb-0 badge rounded-pill text-bg-success" style={{ marginTop: '-16px' }}>{ getTotalQuantity() }</span>
                </div> 
                { (cartItems?.length > 0) && 
                    <span>
                        { !(location?.pathname == route('pay')) && 
                                <Link 
                                to={ route('pay') }
                                className="cursor-pointer d-flex align-items-center gap-2 text-bg-dark rounded py-2 px-2 mb-0 text-decoration-none">
                                <span className="fw-bold">${ getTotalPrice()?.toFixed(2)?.toLocaleString('en') }</span>
                                {/* <span className="fw-bold">{getTotalPrice() ? `${getTotalPrice()?.toFixed(2)}` : ''}</span> */}
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                        className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                    </svg>
                                </span>
                            </Link> 
                        }
                    </span>
                }
            </div>

            <div className="px-3 pt-3 fs-6 d-flex justify-content-end align-items-center">
                <span>You have&nbsp;
                <span className="fw-semibold">{ getTotalQuantity() } item{ (getTotalQuantity() > 1) && 's' }&nbsp;</span>in your cart</span>
            </div>


            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main"> 

                    <div className="products cart-items pt-4"> 

                        { (cartItems?.length === 0) ? (
                            <div className="d-flex align-items-center justify-content-center py-5">
                                <span>Cart is empty.</span> 
                                <Link 
                                    to={ route('products.index') }
                                    className="shop-now ms-2 text-decoration-none">
                                    <span className="btn btn-sm btn-dark border-radius-35 d-flex gap-1">
                                        <span>Shop Now</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                className="bi bi-arrow-right-circle-fill text-white" viewBox="0 0 16 16">
                                                <path
                                                    d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                            </svg>
                                        </span>
                                    </span>
                                </Link> 
                            </div>
                        ) : (
                            <section>
                                { (cartItems?.map((item, index) => ( 
                                    <CartItem 
                                        key= {index} 
                                        itemId = { item?.id } 
                                        asin = { item?.id }
                                        imgSrc = { item?.img }
                                        title = { item?.title } 
                                        description = '' 
                                        oldPrice = ''
                                        currentPrice = { Number(item?.currentPrice) } 
                                        rating = '' 
                                        quantity = { Number(item?.quantity) } 
                                    /> 
                                )))}
                            </section>
                        )}

                    </div>

                </div> 

            </section> 

        </Layout>
    )
}
