import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 
import {
    PayPalScriptProvider,
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalButtons,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
} from "@paypal/react-paypal-js";
// import { Link } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import Constants from '@/utils/Constants.jsx'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Pay() { 
    const { authTokens } = useContext(AuthContext); 
    const { cartItems, getTotalPrice } = useContext(CartContext); 
    console.log(cartItems); 
    const axiosInstance = useAxios(); 
    const navigate = useNavigate(); 

    const [paymentSource, setPaymentSource] = useState(''); 

    useEffect(() => {
        if (paymentSource) {
            console.log('search for:', paymentSource);
        }
    }, [paymentSource]);

    /** PayPal logic */
    const [isPaying, setIsPaying] = useState(false);
    const initialOptions = {
        "client-id": `${Constants?.paypalClientID}`,
            // "AYOeyCQvilLVKJGjslZfFSi_Nkl7A6OfXNarj5lS55iUcQXMhpp3AypVjAVkS_qvPcO5D415b9SnBFuN",
        "enable-funding": "venmo",
        "disable-funding": "paylater",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons,card-fields",
        "data-sdk-integration-source": "developer-studio",
    };

    const [billingAddress, setBillingAddress] =
        useState({
            addressLine1: "",
            addressLine2: "",
            adminArea1: "",
            adminArea2: "",
            countryCode: "",
            postalCode: "",
        });

    function handleBillingAddressChange(field, value) {
        setBillingAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
    } 
    async function createOrder() {

        try {
            const response = await axiosInstance.post(
                `orders/payments`, 
                {
                    cart: cartItems, // The request body
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json', 
                    }
                }
            );

            const orderData = response?.data; 
            console.log(orderData);

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            if (error?.stack.startsWith('InvalidTokenError: Invalid token specified: must be a string') || error?.name == 'InvalidTokenError') {
                navigate(route('sign-in')); 
                swal.fire({ 
                    text: `You must be signed in to proceed!`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                })
            } else if ((error?.response?.data?.message == 'You must have an address before you can pay') || (error?.response?.status == 409)) { 
                navigate(`${route('home.profile.index')}#addresses`);

                swal.fire({ 
                    text: `${ error?.response?.data?.message + ` Add one now and proceed back to your shopping cart for payment.` }.`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                })
            } else {
                return `Could not initiate PayPal Checkout...${error}`;
            }
        }

    }

    async function onApprove(data, actions) { 
        const details = await actions?.order?.capture();
        console.log('payment source client-side', details);
        console.log('payment source client-side', details?.payer?.payer_id); 

        let paymentInstrument; 
        if (details?.payer?.payer_id) {
            paymentInstrument = 'paypal';
        } else {
            paymentInstrument = 'card';
        }

        try {
            const response = await axiosInstance.post(
                // `orders/payments/${data?.orderID}/${paymentInstrument}/capture`,
                `orders/payments/${data?.orderID}/capture`,
                {}, // Empty body as it's a POST request without data payload 
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            );

            const orderData = response?.data;

            // Three cases to handle:
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // (2) Other non-recoverable errors -> Show a failure message
            // (3) Successful transaction -> Show confirmation or thank you message

            const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
            const errorDetail = orderData?.details?.[0];

            if (
                errorDetail ||
                !transaction ||
                transaction.status === "DECLINED"
            ) {
                // (2) Other non-recoverable errors -> Show a failure message
                let errorMessage;
                if (transaction) {
                    errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
                } else if (errorDetail) {
                    errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
                } else {
                    errorMessage = JSON.stringify(orderData);
                }

                throw new Error(errorMessage);
            } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );
                return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
            }
        } catch (error) {
            return `Sorry, your transaction could not be processed...${error}`;
        }

    }

    function onError(error) {
        // Do something with the error from the SDK
    }
    /** End of PayPal logic */ 

    const [isPayPalLoaded, setIsPayPalLoaded] = useState(false); 
    
    const { createOrderPayOnDelivery } = useOrder(); 

    return ( 
        <Layout> 
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main py-2 pb-4 z-1"> 

                    <h2 className="border-bottom pb-1 mb-4 pt-3 fs-4">Payment</h2> 

                    <section className="d-flex amount pb-4">
                        <span>Amount Payable:&nbsp;<span className="fw-semibold fs-3">${ getTotalPrice()?.toFixed(2) }</span></span> 
                    </section> 

                    <section className="d-flex flex-column justify-content-center align-items-start flex-wrap gap-4" style={{ maxWidth: '600px' }}> 

                        <div className="w-100">
                            <button 
                                onClick={ async () => {
                                    await createOrderPayOnDelivery(cartItems); 
                                }}
                                className="btn btn-dark border-radius-35 w-100 py-2">Pay Later On Delivery</button>
                        </div> 

                        { isPayPalLoaded && (
                            <div className="w-100 d-flex justify-content-center py-2">
                                <span className="fw-bold">OR</span>
                            </div> 
                        ) }

                        <PayPalScriptProvider options={initialOptions}>
                            
                            <div className="w-100">
                                <PayPalButtons
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={onError}
                                    style={{
                                        shape: "pill",
                                        layout: "vertical",
                                        color: "black",
                                        label: "pay",
                                    }} 
                                    onInit={() => {
                                        setIsPayPalLoaded(true); // Set state to show the OR text once PayPal is ready
                                    }} 
                                    onClick={() => setPaymentSource('paypal')}
                                />
                            </div>

                            { isPayPalLoaded && (
                                <div className="w-100 d-flex justify-content-center">
                                    <span className="fw-bold">OR</span>
                                </div>
                            ) } 

                            <div className="w-100 border-bottom">
                                <span>Pay with card</span>
                            </div>

                            <PayPalCardFieldsProvider
                                createOrder={createOrder}
                                onApprove={onApprove}
                                style={{
                                    input: { 
                                        "font": "inherit", 
                                        "font-size": "16px",
                                        "font-family": "Montserrat, sans-serif", 
                                        // "font-family": "courier, monospace",
                                        "font-weight": "lighter",
                                        color: "#000", 
                                        "border-radius": "35px", 
                                        "padding-left": "1.75rem", 
                                        "padding-right": "1.75rem", 
                                    },
                                    ".invalid": { color: "purple" },
                                }}
                            >
                                {/* <PayPalNameField
                                    style={{
                                        input: { color: "blue" },
                                        ".invalid": { color: "purple" },
                                    }}
                                /> */}
                                <PayPalNameField />
                                <PayPalNumberField />
                                <PayPalExpiryField />
                                <PayPalCVVField />
                                
                                
                                {/* Custom client component to handle card fields submission */}
                                <SubmitPayment
                                    isPaying={isPaying}
                                    setIsPaying={setIsPaying}
                                    billingAddress={
                                        billingAddress
                                    } 
                                />
                            </PayPalCardFieldsProvider>
                            
                        </PayPalScriptProvider>

                    </section>

                    <section className="ordered-items pt-5" style={{ maxWidth: '600px' }}> 
                        <h4 className="fw-semibold border-bottom pb-1 fs-6">Cart Items (Preview)</h4>
                        <ol className='list-unstyled d-flex flex-column gap-1'> 
                            {(cartItems?.length > 0) && (cartItems?.map((item, index) => {
                                return (
                                    <li key={ index } className="ordered-item row align-items-center gx-5 gy-1 py-1">
                                        <div className="col-md-2">
                                            <div id="carousel2ModalItem1Example" className="carousel slide">
                                                <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                    <div className="images"> 
                                                        <div className="carousel-item active">
                                                            <img src={ item?.img } className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                        </div>
                                                        <div className="carousel-item">
                                                            <img src="https://plus.unsplash.com/premium_photo-1680390327010-09e627ebd475?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                        </div>
                                                        <div className="carousel-item">
                                                            <img src="https://images.unsplash.com/photo-1527385352018-3c26dd6c3916?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                        </div>
                                                    </div> 

                                                    <div>
                                                        <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target="#carousel2ModalItem1Example" data-bs-slide="prev">
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                </svg>
                                                            </span>
                                                            <span className="visually-hidden">Previous</span>
                                                        </button>
                                                        <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target="#carousel2ModalItem1Example" data-bs-slide="next">
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


const SubmitPayment = ({ isPaying, setIsPaying, billingAddress }) => {
    const { cardFieldsForm, fields } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            const childErrorMessage =
                "Unable to find any child components in the <PayPalCardFieldsProvider />";

            throw new Error(childErrorMessage);
        }
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid");
        }
        setIsPaying(true); 
        setPaymentSource('card')

        cardFieldsForm.submit({ billingAddress }).catch((err) => {
            setIsPaying(false);
        });
    };

    return (
        <button
            className={isPaying ? "btn border-radius-35 mt-3 me-2 px-4" : "btn btn-dark border-radius-35 mt-3 me-2 px-4 fw-semibold"}
            style={{ float: "right" }}
            onClick={handleClick}
        >
            {isPaying ? <div className="spinner tiny" /> : "Pay Now"}
        </button>
    );
};
