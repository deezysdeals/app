import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function AboutUs() {
    return (
        <Layout>
            { scrollToTop() }

            <section className="grid grid-order-reverse pt-3 px-3">

                <Aside />

                <div className="main">
                    <h2 className="border-bottom d-inline-flex mb-4">About Us</h2>

                    <div className="brief-introduction">
                        <h3>Welcome to Deezy’s Deals – Where Smart Shopping Begins!</h3>
                        <p>At Deezy’s Deals, we’re more than just another online store—we’re a growing community of savvy shoppers who love finding unbeatable prices on products they love. Whether you’re looking for tech, fashion, home essentials, or unique finds, we’re here to help you save without compromising on quality.</p>
                    </div>
                    
                    <div>
                        <section className="our-story">
                            <h4>Our Story</h4>
                            <p>Deezy’s Deals was founded with a simple mission: make shopping easy, affordable, and fun. What started as a passion project quickly grew into a trusted e-commerce platform known for amazing deals and stellar customer service. We’re constantly adding new products and keeping our prices competitive, so you can shop confidently.</p>
                        </section>

                        <section className="why-choose-us">
                            <h4>Why Choose Us?</h4>
                            <ul>
                                <li>Curated selections with daily deals.</li>
                                <li>Fast, reliable shipping.</li>
                                <li>Responsive customer support when you are not satisfied with response from our AI Assistant.</li>
                                <li>Secure checkout and payment options.</li>
                                <li>Transparency and trust at every step.</li>
                            </ul>
                        </section>

                        <section className="community">
                            <h4>Join Our Community</h4>
                            <p>We’re not just a store; we’re a community. Follow us on social media for the latest deals, product launches, and shopping tips. Join our newsletter to get exclusive offers straight to your inbox!</p>
                        </section>
                    </div>

                    <div className="end-notes">
                        <h4 className="fs-5">Once again, Thank You for Choosing Deezy’s Deals!</h4>
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
