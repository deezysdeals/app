import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useProducts } from '@/hooks/useProducts.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const { user } = useContext(AuthContext); 

    /** Voice-to-Text Search funtionality */ 
    const [searchKey, setSearchKey] = useState(''); 

    useEffect(() => {
        setProductQuery(prev => ({
            ...prev,
            search_key: searchKey,
        }));
    }, [searchKey]);

    const { handleStartListening, 
            // handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();
    /** End of Voice-to-Text search functionality */ 

    const [productQuery, setProductQuery] = useState({
        page: 1, 
        limit: 10, 
        search_key: ''
    }); 
    const { products, getProducts } = useProducts(productQuery); 
    console.log(products); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1">
                        <h2 className="fs-4">Products</h2> 

                        <div className="">
                            { ((user?.user?.role == 'superadmin') || (user?.user?.role == 'admin')) &&
                                <Link to={ route('home.products.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>
                                </Link>
                            }
                        </div>
                    </section>

                    <section className="d-flex justify-content-between flex-wrap gap-2 py-3"> 
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
                                            // await getProducts(1); 
                                            let firstPage = 1
                                            setProductQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                search_key: searchKey
                                            })); 
                                            await getProducts(productQuery); 
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
                        <div>
                            { (products?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ products?.meta?.current_page } 
                                        limit={ products?.meta?.limit } 
                                        total_pages={ products?.meta?.total_pages } 
                                        total_results={ products?.meta?.total_results } /> } 
                        </div>
                    </section>

                    <section className="py-3"> 
                        { ((products?.data?.length > 0)) ?
                            <ul className="list-unstyled d-flex flex-column gap-5">
                                { (products?.data?.length > 0) && (products?.data?.map((product, index) => {
                                    return (
                                        <li 
                                            key={ product?._id } 
                                            className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                                <ProductComponent1 
                                                    index={ (((products?.meta?.current_page) > 1) 
                                                                ? (((products?.meta?.current_page - 1) * products?.meta?.limit) + 1) 
                                                                    : products?.meta?.current_page) + index } 
                                                    itemId={ product?._id } 
                                                    productId={ product?._id } 
                                                    asin={ product?.asin }
                                                    imgsSrc={ product?.images }
                                                    title={ product?.title } 
                                                    description='' 
                                                    oldPrice='' 
                                                    currentPrice={ product?.retail_price } 
                                                    rating={ product?.rating?.rate } 
                                                    category={ product?.category } />
                                        </li>
                                    )
                                })) }
                            </ul> 
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no products yet.</span>
                                </div>
                            ) }
                    </section>
                </div>

                { (products?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ products } 
                            getItems={ getProducts } 
                            query={ productQuery } 
                            setQuery={ setProductQuery } /> }
            </div>
        </Layout>
    )
}
