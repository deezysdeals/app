import { useState, useEffect } from 'react'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { usePayments } from '@/hooks/usePayments.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const location = useLocation(); 

    /** Voice-to-Text Search funtionality */
    const [searchKey, setSearchKey] = useState(''); 

    useEffect(() => {
        if (searchKey) {
            console.log('search for:', searchKey);
        }
    }, [searchKey]);

    const { handleStartListening, 
            handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();
    /** End of Voice-to-Text Search funtionality */

    const [paymentQuery, setPaymentQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 
    const { payments, getPayments } = usePayments(); 
    console.log(payments); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1">
                        <h2 className="fs-4">
                            { (location?.pathname == route('home.payments.index')) && 'Payments' } 
                            { (location?.pathname == route('home.invoices.index')) && 'Invoices for Payments' } 
                        </h2> 

                        <div className="">

                        </div>
                    </section>

                    <section className="d-flex justify-content-between flex-wrap gap-2 pt-4"> 
                        <div className="search">
                            {/* <div className="search-container border border-dark" style={{ maxWidth: '375px' }}>
                                { !isListening &&
                                    <span 
                                        type="button" 
                                        onClick={ handleStartListening }
                                        className="voice-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill"
                                            viewBox="0 0 16 16">
                                            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"></path>
                                            <path
                                                d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5">
                                            </path>
                                        </svg>
                                    </span> }
                                <input 
                                    type="text" 
                                    value={ voiceText } 
                                    onChange={ (e) => setVoiceText(e.target.value) }
                                    placeholder={`Search ...`} 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        
                                        scrollToTop(); 
                                        await getPayments(1); 
                                    } }
                                    className="search-icon">
                                        <svg width="16"
                                            height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                </span>
                            </div> */}
                        </div>
                        <span>
                            { (payments?.data?.length > 0) 
                                && <PaginationMeter 
                                    current_page={ payments?.meta?.current_page } 
                                    limit={ payments?.meta?.limit } 
                                    total_pages={ payments?.meta?.total_pages } 
                                    total_results={ payments?.meta?.total_results } /> } 
                        </span>
                    </section>

                    <section className="py-4">
                        { (payments?.data?.length > 0) 
                            ?   <ul className="list-unstyled d-flex flex-column gap-5">
                                    { (payments?.data?.length > 0) && (payments?.data?.map((payment, index) => {
                                        return (
                                            <li key={ payment?._id } className="box-shadow-1 border-radius-25 py-4 px-2 cursor-pointer">
                                                <div className="text-dark px-3">
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                                                        <span className="fw-semibold">
                                                            #{ (((payments?.meta?.current_page) > 1) 
                                                                ? (((payments?.meta?.current_page - 1) * payments?.meta?.limit) + 1) 
                                                                    : payments?.meta?.current_page) + index }
                                                        </span>
                                                        { (location?.pathname == route('home.payments.index')) && (
                                                            <Link 
                                                                to={ route('home.orders.show', { id: payment?._id }) }
                                                                className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                                                    View Order
                                                            </Link> 
                                                        ) }

                                                        { (location?.pathname == route('home.invoices.index')) && (
                                                            <Link 
                                                                to={ route('home.invoices.show', { id: payment?._id }) }
                                                                className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                                                    Get Invoice
                                                            </Link> 
                                                        ) }
                                                    </div> 
                                                    <div className="amount-and-client d-flex flex-column gap-2">
                                                        <h3 className="fw-semibold">${ (payment?.total_to_be_paid)?.toFixed(2) || 0 }</h3> 
                                                        <div>
                                                            <span>Paid with&nbsp;</span>
                                                            { (payment?.payment_mode == 'paypal') && 
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paypal" viewBox="0 0 16 16">
                                                                    <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/>
                                                                </svg>
                                                            }
                                                            { (payment?.payment_mode == 'card') && 
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16">
                                                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                                                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                                                </svg>
                                                            }
                                                            { (payment?.payment_mode == 'cash') && 
                                                                <span className="fw-semibold">Cash</span>
                                                            }
                                                        </div>
                                                        <p>By&nbsp;
                                                            <Link 
                                                                to={ route('home.users.show', { username: payment?.user?.username }) } 
                                                                className="text-dark">
                                                                    { payment?.user?.first_name + ' ' + payment?.user?.last_name }
                                                            </Link>
                                                            &nbsp;{ payment?.state_region },&nbsp;<small className="text-secondary">{ dayjs.utc(payment?.created_at).fromNow() }</small></p>
                                                    </div>
                                                </div> 
                                            </li> 
                                        )
                                    }))}
                                    
                                </ul> 
                                : (
                                    <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                        <span className="py-4" style={{ flexGrow: '1' }}>There are no payments made yet.</span>
                                    </div>
                                ) }
                    </section>
                </div>

                { (payments?.data?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                let firstPage = 1
                                setPaymentQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getPayments(paymentQuery); 
                                scrollToTop(); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                let previousPage = ((payments?.meta?.current_page >= 1) ? (payments?.meta?.current_page - 1) : 1)
                                setPaymentQuery(prevState => ({
                                    ...prevState, 
                                    // role: paymentQuery?.role, 
                                    page: previousPage
                                })); 
                                await getPayments(paymentQuery); 
                                scrollToTop(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let nextPage = ((payments?.meta?.current_page < payments?.meta?.total_pages) ? (payments?.meta?.current_page + 1) : payments?.meta?.total_pages)
                                setPaymentQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getPayments(paymentQuery); 
                                scrollToTop(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let lastPage = payments?.meta?.total_pages
                                setPaymentQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getPayments(paymentQuery); 
                                scrollToTop(); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}

