import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import { route } from '@/routes';
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
// import { useProductsExt } from '@/hooks/external/useFakeStoreProducts.jsx'; 
// import { useProducts } from '@/hooks/external/useProducts.jsx';
// import { useProducts } from '@/hooks/useProducts.jsx';
import { useSearchProducts } from '@/hooks/external/useSearchProducts.jsx';
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Search() {
    const navigate = useNavigate();
    const params = useParams();
    // const [productsResult, setProductsResult] = useState([]);
    const [searchKey, setSearchKey] = useState(params?.search_key ?? '');
    console.log(searchKey);
    const [pageToVisit, setPageToVisit] = useState(1);
    console.log(pageToVisit);

    const [productQuery, setProductQuery] = useState({
        page: pageToVisit, 
        search_key: params?.search_key ?? '',
    }); 

    // const { products, getProducts } = useProducts(productQuery);
    // console.log(products);

    const { products, getProducts } = useSearchProducts(productQuery);
    console.log(products);

    useEffect(() => {
        setProductQuery(prev => ({
            ...prev,
            page: pageToVisit,
            search_key: searchKey,
        }));
    }, [pageToVisit, searchKey]);

    const handleSearchProducts = e => {
        e.preventDefault();

        if (searchKey || searchKey != '') {
            navigate(route('home.market.search.index', { search_key: voiceText?.trim() ?? searchKey?.trim()}));
        };

        window.location.reload();
    };

    const { handleStartListening, 
            // handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.market.index') } className="text-dark" style={{ textTransform: 'capitalize' }}>
                            Market
                        </Link>&nbsp;
                        | Search results for: "<span className="fw-bold">{ params?.search_key }"</span></h2> 

                    <div className="d-flex justify-content-between flex-wrap gap-2 pt-4"> 
                        <form className="search" onSubmit={ handleSearchProducts }>
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
                                    id="search_key"
                                    name="search_key"
                                    onChange={ (e) => {
                                        setVoiceText(e.target.value);
                                        setSearchKey(e.target.value);
                                    } }
                                    placeholder="Search product ..." 
                                    className="" />

                                <button 
                                    type="submit"
                                    className="search-icon border-0 bg-transparent">
                                    <svg width="16"
                                        height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                            stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                            </div>
                        </form>
                        <span>
                            { (products?.data?.results?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ products?.data?.current_page } 
                                        limit={ products?.data?.results?.length } 
                                        total_pages={ products?.data?.num_pages } 
                                        total_results={ products?.data?.num_pages * products?.data?.results?.length } /> } 
                        </span>
                    </div>

                    <section className="py-4">
                        <ul className="list-unstyled d-flex flex-column gap-5">
                            { (products?.data?.results?.length > 0) && (products?.data?.results?.map((product, index) => {
                                return (
                                    <li 
                                        key={ product?.link } 
                                        className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                            <ProductComponent1 
                                                index={ (((products?.data?.current_page) > 1) 
                                                            ? (((products?.data?.current_page - 1) * products?.data?.results?.length) + 1) 
                                                                : products?.data?.current_page) + index } 
                                                itemId={ product?.link } 
                                                productId={ product?.link } 
                                                asin={ product?.asin }
                                                imgsSrc={ [product?.images] }
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

                { (products?.data?.results?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                setPageToVisit(1);
                                setProductQuery(prevState => ({
                                    ...prevState,
                                    page: pageToVisit,
                                })); 
                                await getProducts(productQuery); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                setPageToVisit((products?.data?.current_page >= 1) ? (products?.data?.current_page - 1) : 1);
                                setProductQuery(prevState => ({
                                    ...prevState,
                                    page: pageToVisit,
                                })); 
                                await getProducts(productQuery);
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                setPageToVisit((products?.data?.current_page < products?.data?.num_pages) ? (products?.data?.current_page + 1) : products?.data?.num_pages);
                                setProductQuery(prevState => ({
                                    ...prevState,
                                    page: pageToVisit,
                                })); 
                                await getProducts(productQuery); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                scrollToTop(); 
                                setPageToVisit(products?.data?.num_pages)
                                setProductQuery(prevState => ({
                                    ...prevState,
                                    page: pageToVisit,
                                })); 
                                await getProducts(productQuery); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}
