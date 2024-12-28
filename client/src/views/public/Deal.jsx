import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useDeal } from '@/hooks/useDeal.jsx'; 
import { useDealProducts } from '@/hooks/public/useDealProducts.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
// import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
// import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
// import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent2 from '@/components/public/nested-components/ProductComponent2.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Deal() {
    const params = useParams(); 
    const { deal, getDeal } = useDeal(params?.id); 
    // console.log(deal);

    const [dealProductQuery, setDealProductQuery] = useState({
        page: 1, 
        limit: 100,
        deal: params?.id
    }); 
    const { dealProducts, getDealProducts } = useDealProducts(dealProductQuery); 
    // console.log(dealProducts); 

    return (
        <Layout> 
            <div className="px-3 border-bottom pb-2 d-flex flex-column">
                <h2 className="fw-semibold fs-3">{ deal?.data?.data?.title }</h2>

                <div className="d-flex flex-column gap-2">
                    <span>{ deal?.data?.data?.description }</span>
                    <span>
                        <small>Value: </small>
                        <span className="fw-bold">{ deal?.data?.data?.value }</span>
                        <span className="fw-bold">{ (deal?.data?.data?.value_unit == 'percentage') ? '%' : 'USD' }</span>
                    </span>
                    <span>
                        <small>Usable only once: </small>
                        <span className="fw-bold">{ (deal?.data?.data?.usable_once == true) ? 'Yes' : 'No' }</span>
                    </span>
                </div>
            </div>

            {/* <div className="px-3 fs-6 d-flex justify-content-end align-items-center">
                <span>1-16 of over 100,000 results</span>
            </div> */}
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main"> 
                    <section className="products pt-4">
                        {(dealProducts?.data?.length > 0) ? (dealProducts?.data?.map((product, index) => {
                            return (
                                <article key={ product?._id } className="card border-0 mb-5">
                                    <ProductComponent2 
                                        // key = { product?.id } 
                                        itemId = { product?.id || product?._id } 
                                        asin = { product?.asin || product?.id } 
                                        imgSrc =  { product?.image || product?.images }
                                        title = { product?.title } 
                                        description = '' 
                                        oldPrice = { product?.initial_retail_price && product?.initial_retail_price } 
                                        currentPrice = { product?.retail_price || product?.price } 
                                        rating = { product?.rating || product?.rating?.rate } 
                                        orderCount = { product?.order_count } 
                                        salesCount = { product?.sale_count } 
                                        category = { product?.category } />
                                </article>
                            )
                        })) : (
                            <div className="py-5 d-flex justify-content-center align-items-center">
                                <span>No products yet associated with deal.</span>
                            </div>
                        )}
                    </section> 

                    {/* <PaginationLinks />  */}
                    { (dealProducts?.data?.length > 0) && 
                        <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    let previousPage = ((dealProducts?.meta?.current_page >= 1) ? (dealProducts?.meta?.current_page - 1) : 1)
                                    setDealProductQuery(prevState => ({
                                        ...prevState, 
                                        page: previousPage
                                    })); 
                                    await getDealProducts(dealProductQuery); 
                                } }>
                                    <Previous /> 
                            </span> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    let nextPage = ((dealProducts?.meta?.current_page < dealProducts?.meta?.total_pages) ? (dealProducts?.meta?.current_page + 1) : dealProducts?.meta?.total_pages)
                                    setDealProductQuery(prevState => ({
                                        ...prevState, 
                                        page: nextPage
                                    })); 
                                    await getDealProducts(dealProductQuery); 
                                } }>
                                <Next /> 
                            </span> 
                            {/* <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    // await getProducts(products?.meta?.total_pages); 
                                    let lastPage = products?.meta?.total_pages
                                    setProductQuery(prevState => ({
                                        ...prevState, 
                                        // role: productQuery?.role, 
                                        page: lastPage
                                    })); 
                                    await getProducts(productQuery); 
                                } }>
                                    <Last />
                            </span> */}
                        </section> 
                    }
                </div> 

            </section> 
        </Layout>
    )
}
