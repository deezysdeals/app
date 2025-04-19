import { useState, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useOrderedItems } from '@/hooks/user/useOrderedItems.jsx'; 
import { useUser } from '@/hooks/useUser.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function OrderedItems() { 
    const params = useParams(); 
    const { retrievedUser } = useUser(params?.username); 
    const { orderedItems, getOrderedItems } = useOrderedItems(params?.username);  
    // console.log(orderedItems); 

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
    /** End of Voice-to-Text search functionality */ 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center gap-3 flex-wrap border-bottom pb-1"> 
                        <h2 className="fs-4">
                            <Link to={ route('home.users.index') } className="text-dark">
                                Users
                            </Link>&nbsp;|&nbsp;
                            <Link to={ route('home.users.show', { username: params?.username }) } className="text-dark">
                                { (retrievedUser?.data?.first_name + ' ' + retrievedUser?.data?.last_name) }
                            </Link>&nbsp;|&nbsp;Ordered Items</h2> 
                    </section>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3"> 
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
                                        await getOrderedItems(1); 
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
                        { (orderedItems?.data?.length > 0) 
                            && <PaginationMeter 
                                    current_page={ orderedItems?.meta?.current_page } 
                                    limit={ orderedItems?.meta?.limit } 
                                    total_pages={ orderedItems?.meta?.total_pages } 
                                    total_results={ orderedItems?.meta?.total_results } /> } 
                    </div>

                    <section className="py-4">
                        <ul className="list-unstyled d-flex flex-column gap-5"> 
                            { (orderedItems?.data?.length > 0) && (orderedItems?.data?.map((orderItem, index) => {
                                return ( 
                                    <li 
                                        key={ orderItem?._id } 
                                        className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                            <ProductComponent1 
                                                index={ (((orderedItems?.meta?.current_page) > 1) 
                                                            ? (((orderedItems?.meta?.current_page - 1) * orderedItems?.meta?.limit) + 1) 
                                                                : orderedItems?.meta?.current_page) + index } 
                                                itemId={ orderItem?._id } 
                                                productId={ orderItem?.product?._id } 
                                                asin={ orderItem?.product?.asin }
                                                imgsSrc={ orderItem?.product?.images }
                                                title={ orderItem?.product?.title } 
                                                description='' 
                                                oldPrice='' 
                                                currentPrice={ orderItem?.product?.retail_price } 
                                                rating={ orderItem?.product?.rating?.rate } 
                                                category={ orderItem?.product?.category } 
                                                orderId={ orderItem?.order?._id } />
                                                {/* orderId={ (orderItem?.order?._id)?.toUpperCase() } /> */}
                                    </li>
                                )
                            })) }
                            
                        </ul>
                    </section>
                </div>

                { (orderedItems?.data?.length > 0) && (
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                await getOrderedItems(1); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                await getOrderedItems((orderedItems?.meta?.current_page >= 1) ? (orderedItems?.meta?.current_page - 1) : 1); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                await getOrderedItems((orderedItems?.meta?.current_page < orderedItems?.meta?.total_pages) ? (orderedItems?.meta?.current_page + 1) : orderedItems?.meta?.total_pages); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                await getOrderedItems(orderedItems?.meta?.total_pages); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                ) }
            </div>
        </Layout>
    )
}
