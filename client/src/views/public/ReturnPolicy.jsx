import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function ReturnPolicy() {
    return (
        <Layout>
            { scrollToTop() }

            <section className="grid grid-order-reverse pt-3 px-3">

                <Aside />

                <div className="main">
                    <h2 className="border-bottom d-inline-flex mb-4">Return Policy</h2>

                    <div className="">
                        <section className="introduction">
                            <h3 className="fs-4">We want you to love your purchase — but if something’s not right, we’ve got you covered.</h3>
                            <p>At <span className="fw-semibold">Deezy’s Deals</span>, your satisfaction is our top priority. If you’re not completely happy with your order, we offer easy returns and exchanges within 30 days of delivery.</p>
                        </section>

                        <section className="return-eligibility">
                            <h3 className="fs-5 mb-0">Return Eligibility</h3>
                            <p>You can return an item if:</p>
                            <ul>
                                <li>It was delivered within the last 30 days.</li>
                                <li>It’s in its original condition (unused, unwashed, and with original tags or packaging).</li>
                                <li>It is not a final sale or non-returnable item (see exclusions below).</li>
                            </ul>
                        </section>

                        <section className="non-returnable-items">
                            <h3 className="fs-5 mb-0">Non-Returnable Items</h3>
                            <p>The following items cannot be returned:</p>
                            <ul>
                                <li>Clearance or final sale items.</li>
                                <li>Opened personal care or hygiene products.</li>
                                <li>Digital downloads or gift cards.</li>
                                <li>Customized or personalized products.</li>
                            </ul>
                        </section>

                        <section className="exchanges">
                            <h3 className="fs-5 mb-0">Exchanges</h3>
                            <p>Need a different size or color? We offer free exchanges on eligible items. Just contact us and we’ll help you with the process.</p>
                        </section>

                        <section className="refunds">
                            <h3 className="fs-5 mb-0">Refunds</h3>
                            <p>Once your return is received and inspected, we’ll process your refund within 5–7 business days. Refunds are issued to your original payment method. You’ll receive a confirmation email once the refund is complete.</p>
                            <p>Please note: Shipping fees are non-refundable unless the return is due to a defect or error on our part.</p>
                        </section>

                        <section className="how-to-start-a-return">
                            <h3 className="fs-5 mb-0">How to Start a Return</h3>
                            <ul>
                                <li>Email us at&nbsp;<a href="mailto:returns@deezysdeals.com">returns@deezysdeals.com</a>&nbsp;with your order number and reason for return.</li>
                                <li>We'll respond with return instructions and a return shipping label (if applicable).</li>
                                <li>Pack your item securely and send it back using the provided label.</li>
                                <li>Wait for confirmation and your refund or exchange update.</li>
                            </ul>
                        </section>

                        <section className="customer-support">
                            <h4 className="fs-5 mb-0">Need Help?</h4>
                            <p className="mb-0">E-mail us:&nbsp;
                                <a href="mailto:support@deezysdeals.com">support@deezysdeals.com</a>
                            </p>
                            <p className='mb-0'>Call or text:&nbsp;
                                <a href="tel:+18048477875">+1 804-847-7875</a>
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
