import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useUser } from '@/hooks/useUser.jsx'; 
import { useProductReviews } from '@/hooks/user/useProductReviews.jsx'; 
import { useProductReview } from '@/hooks/useProductReview.jsx'; 
// import formatNumber from '@/utils/FormatNumber.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
import ProductReview from '@/components/protected/nested-components/ProductReview'; 


export default function ProductReviews() { 
    const params = useParams(); 
    const { retrievedUser } = useUser(params?.username); 
    // console.log(retrievedUser); 
    
    const [productReviewQuery, setProductReviewQuery] = useState({ 
        page: 1, 
        limit: 10, 
        stars: 'all', 
        username: params?.username
    }); 
    // console.log(productReviewQuery); 
    
    const { productReviews, getProductReviews } = useProductReviews(productReviewQuery); 
    // console.log(productReviews); 
    const { deleteProductReview } = useProductReview(); 

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
                                { retrievedUser?.data?.first_name + ' ' + retrievedUser?.data?.last_name }
                            </Link>&nbsp;|&nbsp;Reviews/Ratings</h2> 
                        <div>
                            <ul className="list-unstyled d-flex flex-wrap gap-1"> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 'all'
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 'all') ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            All
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 5
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 5) ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            5-stars
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 4
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 4) ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            4-stars
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 3
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 3) ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            3-stars
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 2
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 2) ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            2-stars
                                    </span>
                                </li> 
                                <li>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            let firstPage = 1; 
                                            setProductReviewQuery(prevState => ({
                                                ...prevState, 
                                                page: firstPage, 
                                                stars: 1
                                            })); 
                                            await getProductReviews(); 
                                            scrollToTop(); 
                                        }}
                                        className={`badge rounded-pill ${(productReviewQuery?.stars == 1) ? `text-bg-secondary` : `text-bg-dark`}`}>
                                            1-star
                                    </span>
                                </li> 
                            </ul>
                        </div>
                    </section>

                    <div className="py-3">
                        <div className="text-end pb-3">
                            <span>
                                { (productReviews?.data?.length > 0) 
                                    && <PaginationMeter 
                                            current_page={ productReviews?.meta?.current_page } 
                                            limit={ productReviews?.meta?.limit } 
                                            total_pages={ productReviews?.meta?.total_pages } 
                                            total_results={ productReviews?.meta?.total_results } /> } 
                            </span> 
                        </div> 

                        <section>
                            { (productReviews?.data?.length > 0) 
                                ?   <ul className="list-unstyled d-flex flex-column gap-3">
                                        { ((productReviews?.data?.length > 0) && productReviews?.data?.map(productReview => {
                                            return (
                                                <li key={ productReview?._id } className="d-flex flex-column box-shadow-1 border-radius-25 py-3 px-4"> 
                                                    <ProductReview 
                                                        productReview={ productReview } />
                                                </li> 
                                            )
                                        })) }
                                    </ul> 
                                        :   (
                                                <div className="h-100 w-100 py-4 d-flex justify-content-center align-items-center">
                                                    <span>User is yet to add reviews.</span>
                                                </div>
                                            ) } 
                        </section>
                    </div> 
                </div> 

                { (productReviews?.data?.length > 0) && 
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let firstPage = 1
                                setProductReviewQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getProductReviews(); 
                                } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let previousPage = ((productReviews?.meta?.current_page >= 1) ? (productReviews?.meta?.current_page - 1) : 1)
                                setProductReviewQuery(prevState => ({
                                    ...prevState, 
                                    page: previousPage
                                })); 
                                await getProductReviews(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let nextPage = ((productReviews?.meta?.current_page < productReviews?.meta?.total_pages) ? (productReviews?.meta?.current_page + 1) : productReviews?.meta?.total_pages)
                                setProductReviewQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getProductReviews(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let lastPage = productReviews?.meta?.total_pages
                                setProductReviewQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getProductReviews(); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}
