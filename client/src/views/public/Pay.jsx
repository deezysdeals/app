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
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalButtons,
    PayPalNameField,
    PayPalNumberField,
    PayPalExpiryField,
    PayPalCVVField,
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

    /** PayPal logic */
    const [isPaying, setIsPaying] = useState(false);
    const initialOptions = {
        "client-id": `${Constants?.paypalClientID}`,
        // "enable-funding": "venmo",
        // "disable-funding": "paylater",
        // "buyer-country": "US",
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
        try {
            const response = await axiosInstance.post(
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
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    }); 
                } else if (errorDetail) {
                    errorMessage = `${errorDetail.description} (${orderData.debug_id})`; 
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else {
                    errorMessage = JSON.stringify(orderData); 
                    swal.fire({ 
                        text: errorMessage, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    }); 
                }

                throw new Error(errorMessage);
            } else {
                // (3) Successful transaction -> Show confirmation or thank you message 
                clearCart(); 
                navigate(route('order-placed'));  
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
        /** Do something with the error from the SDK */  
        // navigate(route('sign-in')); 
        swal.fire({ 
            text: `Error processing payment!`, 
            color: '#900000', 
            width: 325, 
            position: 'top', 
            showConfirmButton: false
        })

    }
    /** End of PayPal logic */ 

    const [isPayPalLoaded, setIsPayPalLoaded] = useState(false); 
    const [payWithCard, setPayWithCard] = useState(false); 
    const { order, createOrderPayOnDelivery } = useOrder(); 

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

                        { ((isPayPalLoaded) && (order?.loading == false)) && (
                            <div className="w-100 d-flex justify-content-center py-2">
                                <span className="fw-bold">OR</span>
                            </div> 
                        ) }

                        { (order?.loading == false) && (
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
                                    />
                                </div>

                                { (payWithCard) && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <span 
                                            type="button" 
                                            onClick={ () => setPayWithCard(false) }>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                            </svg>
                                        </span>
                                    </div>
                                ) } 

                                { (!payWithCard) && 
                                    <div className="w-100">
                                        <button 
                                            onClick={  () => {
                                                setPayWithCard(!payWithCard); 
                                            }}
                                            className="btn btn-dark border-radius-35 w-100 py-2">
                                                Pay with&nbsp;<span className="fw-bold fst-italic">Card</span> 
                                        </button>
                                    </div> 
                                }

                                { (payWithCard) && 
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
                                            // billingAddress={
                                            //     billingAddress
                                            // } 
                                        />
                                    </PayPalCardFieldsProvider> 
                                }

                            </PayPalScriptProvider> 
                        ) }

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


const SubmitPayment = ({ isPaying, setIsPaying, billingAddress }) => {
    const { cardFieldsForm, fields } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            const childErrorMessage = "Unable to find any child components in the <PayPalCardFieldsProvider />";

            throw new Error(childErrorMessage); 
        }
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid"); 
        }
        setIsPaying(true); 

        cardFieldsForm.submit({ billingAddress }).catch((err) => {
            setIsPaying(false);
        });
    };

    return (
        <button
            className={isPaying ? "btn border-radius-35 mt-3 me-2 px-4" : "btn btn-dark border-radius-35 mt-3 me-2 px-4 fw-semibold"}
            style={{ float: "right" }}
            onClick={ handleClick }
        >
            { isPaying ? <div className="spinner tiny" /> : "Pay Now" }
        </button>
    );
};
