import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function ContactUs() {
    return (
        <Layout>
            { scrollToTop() }

            <section className="grid grid-order-reverse pt-3 px-3">

                <Aside />

                <div className="main">
                    <h2 className="border-bottom d-inline-flex mb-4">Contact Us</h2>

                    <div className="brief-introduction">
                        <h3>We’d love to hear from you!</h3>
                        <p>Whether you have a question about your order, need help with a product, or just want to say hi, we’re here to help.</p>
                    </div>
                    
                    <div>
                        <section className="e-mail">
                            <h4>📬 Email Us</h4>
                            <p className="mb-0">
                                <a href="mailto:support@deezysdeals.com">support@deezysdeals.com</a>
                            </p>
                            <p>We aim to respond within 3 hours.</p>
                        </section>

                        <section className="customer-support">
                            <h4>📞 Customer Support</h4>
                            <p className='mb-0'>Call or text:&nbsp;
                                <a href="tel:+18048477875">+1 804-847-7875</a>
                            </p>
                            {/* <p>Available: Mon–Fri, 9am – 5pm (EST)</p> */}
                            <p>Available: 24/7</p>
                        </section>

                        <section className="mailing-address">
                            <h4>📍 Mailing Address</h4>
                            <p className="d-flex flex-column">
                                <span>Deezy’s Deals</span>
                                <span>702 E Broadway, Virginia</span>
                                <span>Hopewell, VA</span>
                                <span>United States</span>
                            </p>
                        </section>
                    </div>

                    <div className="end-notes">
                        <h4 className="fs-5">Thank You for Choosing Deezy’s Deals!</h4>
                        <p>Your support means the world to us. We’re committed to providing you with the best shopping experience possible and to keep bringing you new deals and a smooth shopping experience, every time.</p>
                    </div>

                    <div className="end-salutation pt-4">
                        <p className="fw-semibold">Happy Shopping!</p>
                        <p className="fw-bold">– The Deezy’s Deals Team</p>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
