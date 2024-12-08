import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useFavorites } from '@/hooks/useFavorites.jsx'; 
import { useFavorite } from '@/hooks/useFavorite.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import ProductComponent1 from '../../../components/protected/nested-components/ProductComponent1';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
    // Voice-to-Text Search funtionality
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
    // End of Voice-to-Text search functionality

    const [favoriteQuery, setFavoriteQuery] = useState({ 
        page: 1, 
        limit: 10, 
        search: searchKey
    }); 
    const { favorites, getFavorites } = useFavorites(favoriteQuery); 
    const { deleteFavorite } = useFavorite(); 
    // console.log(favorites); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">Favorites</h2> 

                    <div className="d-flex justify-content-between flex-wrap gap-2"> 
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
                                    placeholder="Search favorite ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        
                                        scrollToTop(); 
                                        // await getFavorites(1); 
                                        let firstPage = 1
                                        setFavoriteQuery(prevState => ({
                                            ...prevState, 
                                            page: firstPage, 
                                            search: searchKey
                                        })); 
                                        await getFavorites(favoriteQuery); 

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
                        <span>
                            { ((favorites?.meta?.current_page) > 1) 
                                ? (((favorites?.meta?.current_page - 1) * favorites?.meta?.limit) + 1) 
                                : favorites?.meta?.current_page }
                                    &nbsp;-&nbsp;
                                { ((favorites?.meta?.current_page * (favorites?.meta?.limit)) > favorites?.meta?.total_results) 
                                    ? (favorites?.meta?.total_results)
                                        : ((favorites?.meta?.current_page) != 1) 
                                        ? (favorites?.meta?.current_page * favorites?.meta?.limit) 
                                            : ((favorites?.meta?.current_page + (favorites?.meta?.limit - 1))) } 
                                    &nbsp;of&nbsp; 
                                { favorites?.meta?.total_results } 
                                &nbsp;(page { favorites?.meta?.current_page } of { favorites?.meta?.total_pages })
                        </span> 
                    </div>

                    <section className="py-4">
                        <ul className="list-unstyled d-flex flex-column gap-5">
                            { (favorites?.data?.length > 0) && favorites?.data?.map((favorite, index) => { 
                                // {console.log(favorite)}
                                return ( 
                                    <li 
                                        key={ favorite?._id } 
                                        className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                            <ProductComponent1 
                                                // key={ favorite?._id } 
                                                index={ (((favorites?.meta?.current_page) > 1) 
                                                            ? (((favorites?.meta?.current_page - 1) * favorites?.meta?.limit) + 1) 
                                                                : favorites?.meta?.current_page) + index } 
                                                itemId={ favorite?._id } 
                                                productId={ favorite?.product?._id } 
                                                asin={ favorite?.product?.asin }
                                                imgsSrc={ favorite?.product?.images }
                                                title={ favorite?.product?.title } 
                                                description='' 
                                                oldPrice='' 
                                                currentPrice={ favorite?.product?.retail_price } 
                                                rating={ favorite?.product?.rating?.rate } 
                                                category={ favorite?.product?.category } />
                                    </li>
                                )
                            }) }
                        </ul>
                    </section>
                </div>

                <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            // await getFavorites(1); 
                            let firstPage = 1
                                setFavoriteQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getFavorites(); 
                            } }>
                            <First /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            // await getFavorites((favorites?.meta?.current_page >= 1) ? (favorites?.meta?.current_page - 1) : 1); 
                            let previousPage = ((favorites?.meta?.current_page >= 1) ? (favorites?.meta?.current_page - 1) : 1)
                            setFavoriteQuery(prevState => ({
                                ...prevState, 
                                // role: favoriteQuery?.role, 
                                page: previousPage
                            })); 
                            await getFavorites(); 
                        } }>
                            <Previous /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            // await getFavorites((favorites?.meta?.current_page < favorites?.meta?.total_pages) ? (favorites?.meta?.current_page + 1) : favorites?.meta?.total_pages); 
                            let nextPage = ((favorites?.meta?.current_page < favorites?.meta?.total_pages) ? (favorites?.meta?.current_page + 1) : favorites?.meta?.total_pages)
                            setFavoriteQuery(prevState => ({
                                ...prevState, 
                                // role: favoriteQuery?.role, 
                                page: nextPage
                            })); 
                            await getFavorites(); 
                        } }>
                        <Next /> 
                    </span> 
                    <span 
                        type="button" 
                        onClick={ async () => { 
                            scrollToTop(); 
                            // await getFavorites(favorites?.meta?.total_pages); 
                            let lastPage = favorites?.meta?.total_pages
                            setFavoriteQuery(prevState => ({
                                ...prevState, 
                                // role: favoriteQuery?.role, 
                                page: lastPage
                            })); 
                            await getFavorites(); 
                        } }>
                            <Last />
                    </span>
                </section>
            </div>
        </Layout>
    )
}

