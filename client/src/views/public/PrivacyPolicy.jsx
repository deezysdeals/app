import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function PrivacyPolicy() {
    return (
        <Layout>
            { scrollToTop() }

            <section className="grid grid-order-reverse pt-3 px-3">

                <Aside />

                <div className="main">
                    <h2 className="border-bottom d-inline-flex mb-4">Privacy Policy</h2>

                    <div className="">
                        <section className="information-we-collect">
                            <h3 className="fs-5 mb-0">Information We Collect</h3>
                            <p>We collect personal information that you provide to us, such as:</p>
                            <ul>
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Shipping and billing addresses</li>
                            </ul>
                            <p>Additionally, we may collect data through cookies and similar technologies to enhance your browsing experience.</p>
                            <p>But we do not collect your payment information.</p>
                        </section>

                        <section className="use-of-information">
                            <h3 className="fs-5 mb-0">Use of Information</h3>
                            <p>Your information is used to:</p>
                            <ul>
                                <li>Process and fulfill orders.</li>
                                <li>Communicate with you regarding your orders.</li>
                                <li>Improve our website and services.</li>
                                <li>Send promotional materials (with your consent).</li>
                            </ul>
                            <p>Additionally, we may collect data through cookies and similar technologies to enhance your browsing experience.</p>
                            <p>But we do not collect your payment information.</p>
                        </section>

                        <section className="sharing-of-information">
                            <h3 className="fs-5 mb-0">Sharing of Information</h3>
                            <p>We do not sell or rent your personal information. However, we may share your data with trusted third parties for purposes such as:</p>
                            <ul>
                                <li>Payment processing</li>
                                <li>Shipping and delivery</li>
                                <li>Marketing and advertising</li>
                            </ul>
                            <p>These third parties are obligated to protect your information.</p>
                        </section>

                        <section className="data-security">
                            <h3 className="fs-5 mb-0">Data Security</h3>
                            <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                        </section>

                        <section className="your-rights">
                            <h3 className="fs-5 mb-0">Your Rights</h3>
                            <p>Depending on your location, you may have rights regarding your personal information, including:</p>
                            <ul>
                                <li>Accessing your data.</li>
                                <li>Correcting inaccuracies.</li>
                                <li>Deleting your data.</li>
                                <li>Opting out of marketing communications.</li>
                            </ul>
                            <p>Please contact us via options on our&nbsp;<Link to={ route('contact-us') }>Contact Us page</Link> to exercise these rights.</p>
                        </section>

                        <section className="cookies">
                            <h3 className="fs-5 mb-0">Cookies</h3>
                            <p>We use cookies to enhance your experience on our website. You can control cookie settings through your browser.</p>
                        </section>

                        <section className="changes-to-this-privacy-policy">
                            <h3 className="fs-5 mb-0">Changes to This Privacy Policy</h3>
                            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
                        </section>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
