import { useEffect, useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useOrders } from '@/hooks/user/useOrders.jsx'; 
import { useOrder } from '@/hooks/useOrder.jsx'; 
import { useUser } from '@/hooks/useUser.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import OrderComponent1 from '@/components/protected/nested-components/OrderComponent1.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Orders() { 
    const params = useParams(); 
    const { retrievedUser } = useUser(params?.username); 
    // console.log(retrievedUser);

    /** Voice-to-Text Search funtionality */ 
    const [searchKey, setSearchKey] = useState(''); 

    useEffect(() => {
        if (searchKey) {
            console.log('search for:', searchKey);
        }
    }, [searchKey]);

    const { handleStartListening, 
            // handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();
    /** End of Voice-to-Text search functionality */ 

    const [orderQuery, setOrderQuery] = useState({
        page: 1, 
        limit: 10, 
        payment_status: 'all', 
        search_key: searchKey, 
        username: params?.username
    }); 
    const { orders, getOrders } = useOrders(orderQuery); 
    const { deleteOrder } = useOrder(); 
    // console.log(orders); 

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
                            </Link>&nbsp;|&nbsp;Orders</h2> 
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: 'all'
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'all') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            All
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: 'false'
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'false') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Unpaid
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setOrderQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                payment_status: 'true'
                                            })); 
                                            await getOrders(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(orderQuery?.payment_status == 'true') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            Paid
                                    </span>
                                </li> 
                            </ul>
                        </div>
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
                                    placeholder="Search by code ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        scrollToTop();  
                                        let firstPage = 1
                                        setOrderQuery(prevState => ({
                                            ...prevState, 
                                            page: firstPage, 
                                            search: searchKey
                                        })); 
                                        await getOrders(orderQuery); 
                                        setIsListening(false); 
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
                        <span className="text-end">
                            { (orders?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ orders?.meta?.current_page } 
                                        limit={ orders?.meta?.limit } 
                                        total_pages={ orders?.meta?.total_pages } 
                                        total_results={ orders?.meta?.total_results } /> } 
                        </span> 
                    </div>

                        
                    { (orders?.data?.length > 0) 
                        ?   <section className="py-3">
                                <ul className="list-unstyled d-flex flex-column gap-5">
                                    { (orders?.data?.length > 0) && (orders?.data?.map((order, index) => {
                                        return (
                                            <li key={order?._id} className="box-shadow-1 border-radius-25 py-4 px-2">
                                                <OrderComponent1 
                                                    order={order} 
                                                    index={index}
                                                    current_page={orders?.meta?.current_page} 
                                                    limit={orders?.meta?.limit} />
                                            </li> 
                                            
                                        )
                                    }))}
                                </ul> 
                            </section>
                                : (
                                    <div className="h-100 w-100 py-4 d-flex justify-content-center align-items-center">
                                        <span>You have no orders yet.</span>
                                    </div>
                                )}
                </div>

                { (orders?.data?.length > 0) && 
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let firstPage = 1
                                setOrderQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getOrders(); 
                                } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let previousPage = ((orders?.meta?.current_page >= 1) ? (orders?.meta?.current_page - 1) : 1)
                                setOrderQuery(prevState => ({
                                    ...prevState, 
                                    page: previousPage
                                })); 
                                await getOrders(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let nextPage = ((orders?.meta?.current_page < orders?.meta?.total_pages) ? (orders?.meta?.current_page + 1) : orders?.meta?.total_pages)
                                setOrderQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getOrders(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let lastPage = orders?.meta?.total_pages
                                setOrderQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getOrders(); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}
