import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { usePurchases } from '@/hooks/usePurchases.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
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

    const [purchaseQuery, setPurchaseQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 
    const { purchases, getPurchases } = usePurchases(); 
    // console.log(purchases); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                        <h2 className="fs-4">Purchases for Re-Sale</h2> 

                        <div className="">
                            <Link to={ route('home.products.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div>
                    </section>

                    <section className="d-flex justify-content-between flex-wrap gap-2"> 
                        <div className="search">
                            <div className="search-container border border-dark" style={{ maxWidth: '375px' }}>
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
                                    placeholder="Search product ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        
                                        scrollToTop(); 
                                        await getPurchases(1); 
                                    } }
                                    className="search-icon">
                                        <svg width="16"
                                            height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                </span>
                            </div>
                        </div>
                        <span>
                            { (purchases?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ purchases?.meta?.current_page } 
                                        limit={ purchases?.meta?.limit } 
                                        total_pages={ purchases?.meta?.total_pages } 
                                        total_results={ purchases?.meta?.total_results } /> } 
                        </span>
                    </section>

                    <section className="py-4">
                        { (purchases?.data?.length > 0) ?
                            <ul className="list-unstyled d-flex flex-column gap-5">
                                { (purchases?.data?.length > 0) && (purchases?.data?.map((product, index) => {
                                    return (
                                        <li 
                                            key={ product?._id } 
                                            className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                                <ProductComponent1 
                                                    index={ (((purchases?.meta?.current_page) > 1) 
                                                                ? (((purchases?.meta?.current_page - 1) * purchases?.meta?.limit) + 1) 
                                                                    : purchases?.meta?.current_page) + index } 
                                                    itemId={ product?._id } 
                                                    productId={ product?._id } 
                                                    asin={ product?.asin }
                                                    imgsSrc={ product?.images }
                                                    title={ product?.title } 
                                                    description='' 
                                                    oldPrice='' 
                                                    currentPrice={ product?.purchase_price } 
                                                    rating={ product?.rating?.rate } 
                                                    category={ product?.category } />
                                        </li>
                                    )
                                })) }
                            </ul> 
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no purchased products yet.</span>
                                </div>
                            ) }
                    </section>
                </div>

                { (purchases?.data?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                let firstPage = 1
                                setPurchaseQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getPurchases(purchaseQuery); 
                                scrollToTop(); 
                            } }>
                            <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let previousPage = ((purchases?.meta?.current_page >= 1) ? (purchases?.meta?.current_page - 1) : 1)
                                setPurchaseQuery(prevState => ({
                                    ...prevState, 
                                    // role: purchaseQuery?.role, 
                                    page: previousPage
                                })); 
                                await getPurchases(purchaseQuery); 
                                scrollToTop(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let nextPage = ((purchases?.meta?.current_page < purchases?.meta?.total_pages) ? (purchases?.meta?.current_page + 1) : purchases?.meta?.total_pages)
                                setPurchaseQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getPurchases(purchaseQuery); 
                                scrollToTop(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let lastPage = purchases?.meta?.total_pages
                                setPurchaseQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getPurchases(purchaseQuery); 
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
