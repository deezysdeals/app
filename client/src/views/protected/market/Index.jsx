import { useState, useEffect } from 'react'; 
// import { Link } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
// import { useProductsExt } from '@/hooks/external/useFakeStoreProducts.jsx'; 
import { useProducts } from '@/hooks/external/useProducts.jsx';
import { useSearchProducts } from '@/hooks/external/useSearchProducts.jsx';
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [productsResult, setProductsResult] = useState([]);
    const [searchKey, setSearchKey] = useState(''); 

    const [productQuery, setProductQuery] = useState({
        page: 1, 
        limit: 10, 
        keywords: ''
    }); 

    const { products, getProducts } = useProducts();
    console.log(products);

    const { searchProducts, getSearchProducts } = useSearchProducts(productQuery);
    console.log(searchProducts);

    // useEffect to update productsResult when products or searchProducts change
    useEffect(() => {
        if (!searchKey?.length) {
            setProductsResult(products);
        } else {
            setProductsResult(searchProducts);
        }
    }, [products, searchProducts]); 

    /** Voice-to-Text Search funtionality */ 

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

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">Market</h2>

                    <div className="d-flex justify-content-between flex-wrap gap-2 pt-4"> 
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
                                        searchKey?.length>0
                                            ? await getSearchProducts(1)
                                            : await getProducts(1);
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
                            { (productsResult?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ productsResult?.data?.current_page } 
                                        limit={ 50 } 
                                        total_pages={ productsResult?.data?.num_pages } 
                                        total_results={ productsResult?.data?.num_pages * 50 } /> } 
                        </span>
                    </div>

                    <section className="py-4">
                        <ul className="list-unstyled d-flex flex-column gap-5">
                            { (productsResult?.data?.results?.length > 0) && (productsResult?.data?.results?.map((product, index) => {
                                return (
                                    <li 
                                        key={ product?.link } 
                                        className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                            <ProductComponent1 
                                                index={ index + 1 } 
                                                itemId={ product?.link } 
                                                productId={ product?.link } 
                                                asin={ product?.asin }
                                                imgsSrc={ [product?.image] }
                                                title={ product?.title } 
                                                description='' 
                                                oldPrice='' 
                                                currentPrice='' 
                                                rating='' 
                                                category='' />
                                    </li>
                                )
                            })) }
                        </ul>
                    </section>
                </div> 

                { (productsResult?.data?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                searchKey?.length>0
                                    ? await getSearchProducts(1)
                                    : await getProducts(1);
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                searchKey?.length>0
                                    ? await getSearchProducts((productsResult?.data?.current_page >= 1) ? (productsResult?.data?.current_page - 1) : 1) 
                                    : await getProducts((productsResult?.data?.current_page >= 1) ? (productsResult?.data?.current_page - 1) : 1) 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                searchKey?.length>0
                                    ? await getSearchProducts((productsResult?.data?.current_page < productsResult?.data?.num_pages) ? (productsResult?.data?.current_page + 1) : productsResult?.data?.num_pages)
                                    : await getProducts((productsResult?.data?.current_page < productsResult?.data?.num_pages) ? (productsResult?.data?.current_page + 1) : productsResult?.data?.num_pages);
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                searchKey?.length>0
                                    ? await getSearchProducts(productsResult?.data?.num_pages) 
                                    : await getProducts(productsResult?.data?.num_pages) 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}
