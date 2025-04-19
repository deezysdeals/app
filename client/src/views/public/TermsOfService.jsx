import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function TermsOfService() {
    return (
        <Layout>
            { scrollToTop() }

            <section className="grid grid-order-reverse pt-3 px-3">

                <Aside />

                <div className="main">
                    <h2 className="border-bottom d-inline-flex mb-4">Terms of Service</h2>

                    <div className="">
                        <section className="introduction">
                            <h3>Introduction</h3>
                            <p>Welcome to www.deezysdeals.com. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service. If you do not agree with these terms, please refrain from using our site.</p>
                        </section>

                        <section className="use-of-the-website">
                            <h3>Use of the Website</h3>
                            <p>You agree to use our website only for lawful purposes and in accordance with these Terms. Prohibited activities include, but are not limited to:</p>
                            <ul>
                                <li>Violating any applicable laws or regulations.</li>
                                <li>Infringing upon intellectual property rights.</li>
                                <li>Transmitting harmful or malicious content.</li>
                            </ul>
                        </section>

                        <section className="product-information-and-availability">
                            <h3>Product Information and Availability</h3>
                            <p>We strive to provide accurate product descriptions and availability. However, we do not guarantee that all information is error-free. Prices and availability are subject to change without notice.</p>
                        </section>

                        <section className="orders-and-payments">
                            <h3>Orders and Payments</h3>
                            <p>By placing an order, you make an offer to purchase the selected items. We reserve the right to accept or decline any order. Payment must be made in full at the time of purchase or paid on delivery of the purchased item(s).</p>
                        </section>

                        <section className="shipping-and-delivery">
                            <h3>Shipping and Delivery</h3>
                            <p>We aim to process and ship orders promptly. Delivery times may vary based on location and shipping method. Any shipping delays will be communicated to you.</p>
                        </section>

                        <section className="returns-and-refunds">
                            <h3>Returns and Refunds</h3>
                            <p>Please refer to our&nbsp;<Link to={ route('return-policy') }>Return Policy</Link>&nbsp;for detailed information on returns and refunds.</p>
                        </section>

                        <section className="limitation-of-liability">
                            <h3>Limitation of Liability</h3>
                            <p>Our liability is limited to the amount paid for the product or service. We are not responsible for indirect, incidental, or consequential damages.</p>
                        </section>

                        <section className="governing-law">
                            <h3>Governing Law</h3>
                            <p>These Terms are governed by the laws of the United States of America. Any disputes will be resolved in the competent courts of the United States of America.</p>
                        </section>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
