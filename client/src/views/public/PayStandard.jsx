import { useContext, useState } from "react";
import AuthContext from '@/context/AuthContext.jsx'; 
import { CartContext } from '@/context/CartContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Constants from '@/utils/Constants.jsx';
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
    return <p>{content}</p>;
}

export default function PayStandard() {
    const { authTokens } = useContext(AuthContext); 
    const { cartItems, getTotalPrice, clearCart } = useContext(CartContext); 

    const navigate = useNavigate(); 

    const initialOptions = {
        "client-id": `${Constants?.paypalClientID}`,
        // "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    const [message, setMessage] = useState("");

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
                                    className="btn btn-dark border-radius-35 w-100 py-2 mb-3">Pay Later&nbsp;
                                        <span className="fw-bold fst-italic">On Delivery</span>
                                </button>
                            ) }

                            <PayPalScriptProvider options={initialOptions}>
                                <PayPalButtons
                                style={{
                                        shape: "pill",
                                        layout: "vertical",
                                        color: "black",
                                        label: "pay",
                                    }}
                                createOrder={async () => {
                                        try {
                                            const response = await fetch(`http://localhost:5001/api/v1/paypal/payments`, {
                                                method: "POST",
                                                headers: {
                                                    'Authorization': `Bearer ${authTokens?.access}`,
                                                    "Content-Type": "application/json",
                                                },
                                                // use the "body" param to optionally pass additional order information
                                                // like product ids and quantities
                                                body: JSON.stringify({
                                                    cart: cartItems,
                                                }),
                                                credentials: 'include'
                                            });

                                            const orderData = await response.json();

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
                                            setMessage(
                                                `Could not initiate PayPal Checkout...${error}`
                                            );
                                        }
                                    }}
                                onApprove={async (data, actions) => {
                                        try {
                                            const response = await fetch(`http://localhost:5001/api/v1/paypal/payments/${data.orderID}/capture`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                }
                                            );

                                            const orderData = await response.json();
                                            // Three cases to handle:
                                            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                            //   (2) Other non-recoverable errors -> Show a failure message
                                            //   (3) Successful transaction -> Show confirmation or thank you message

                                            const errorDetail = orderData?.details?.[0];

                                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                                                return actions.restart();
                                            } else if (errorDetail) {
                                                // (2) Other non-recoverable errors -> Show a failure message
                                                throw new Error(
                                                    `${errorDetail.description} (${orderData.debug_id})`
                                                );
                                            } else {
                                                // (3) Successful transaction -> Show confirmation or thank you message
                                                // Or go to another URL:  actions.redirect('thank_you.html');
                                                const transaction =
                                                    orderData.purchase_units[0].payments
                                                        .captures[0];
                                                setMessage(
                                                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                                                );
                                                console.log(
                                                    "Capture result",
                                                    orderData,
                                                    JSON.stringify(orderData, null, 2)
                                                );
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            setMessage(
                                                `Sorry, your transaction could not be processed...${error}`
                                            );
                                        }
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </section>
                </div>
            </section>

            <Message content={message} />
        </Layout>
    );
};