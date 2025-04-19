import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useCategoryExt } from '@/hooks/external/useFakeStoreCategory.jsx'; 
import { useCategory } from '@/hooks/useCategory.jsx'; 
import { useCategoryProducts } from '@/hooks/public/useCategoryProducts.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
// import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
// import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
// import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent2 from '@/components/public/nested-components/ProductComponent2.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 

export default function Category() { 
    const params = useParams(); 
    const source = params?.source || 'shop'; 
    const { categoryExt, getCategoryExt } = useCategoryExt(params?.id); 
    console.log(categoryExt); 
    const { category, getCategory } = useCategory(params?.id); 
    console.log(category); 

    let categoryProper; 

    if (source == 'market') {
        categoryProper = categoryExt; 
        console.log(categoryProper);
    } else if (source == 'shop') {
        categoryProper = category?.data; 
        console.log(categoryProper); 
    } else {
        categoryProper = category?.data; 
        console.log(categoryProper); 
    }

    const [categoryProductQuery, setCategoryProductQuery] = useState({
        page: 1, 
        limit: 100,
        category: params?.id
    }); 
    const { categoryProducts, getCategoryProducts } = useCategoryProducts(categoryProductQuery); 
    console.log(categoryProducts);

    return (
        <Layout> 
            <h2 className="px-3 fw-semibold border-bottom pb-2 fs-3 text-capitalize">{ categoryProper?.data?.name || categoryProper?.data?.title }</h2>

            {/* <div className="px-3 fs-6 d-flex justify-content-end align-items-center">
                <span>1-16 of over { categoryExt?.length } result{ categoryExt?.length > 0 && 's'} for</span>&nbsp;
                <span className="fw-semibold">"{params?.id}"</span>
            </div> */}
            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main"> 
                    <section className="products pt-3"> 
                        {(categoryProducts?.data?.length > 0) ? (categoryProducts?.data?.map((product, index) => {
                            // const ratingCalculated = (Number(product?.product?.total_rating_value) / Number(product?.product?.total_rating_count)) || 5; 
                            return (
                                <article key={ product?.product?._id } className="card border-0 mb-5">
                                    <ProductComponent2 
                                        // key = { product?.product?.id } 
                                        itemId = { product?.id || product?.product?._id } 
                                        asin = { product?.product?.asin || product?.product?.id } 
                                        imgSrc =  { product?.image || product?.product?.images }
                                        title = { product?.product?.title } 
                                        description = '' 
                                        oldPrice = { product?.product?.initial_retail_price && product?.product?.initial_retail_price } 
                                        currentPrice = { product?.product?.retail_price || product?.price } 
                                        rating = { product?.product?.rating || product?.rating?.rate } 
                                        orderCount = { product?.product?.order_count } 
                                        salesCount = { product?.product?.sale_count } 
                                        category = { product?.product?.category } />
                                </article>
                            )
                        })) : (
                            <div className="py-5 d-flex justify-content-center align-items-center">
                                <span>No products yet associated with category.</span>
                            </div>
                        )}
                    </section>

                    {/* <PaginationLinks />  */}
                    { (categoryProducts?.data?.length > 0) && 
                        <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    let previousPage = ((categoryProducts?.meta?.current_page >= 1) ? (categoryProducts?.meta?.current_page - 1) : 1)
                                    setCategoryProductQuery(prevState => ({
                                        ...prevState, 
                                        page: previousPage
                                    })); 
                                    await getCategoryProducts(categoryProductQuery); 
                                } }>
                                    <Previous /> 
                            </span> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    let nextPage = ((categoryProducts?.meta?.current_page < categoryProducts?.meta?.total_pages) ? (categoryProducts?.meta?.current_page + 1) : categoryProducts?.meta?.total_pages)
                                    setCategoryProductQuery(prevState => ({
                                        ...prevState, 
                                        page: nextPage
                                    })); 
                                    await getCategoryProducts(brandCategoryQuery); 
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
