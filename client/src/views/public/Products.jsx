import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useProductsExt } from '@/hooks/external/useFakeStoreProducts.jsx'; 
import { useProducts } from '@/hooks/public/useProducts.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent2 from '@/components/public/nested-components/ProductComponent2.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Products() { 
    const params = useParams(); 
    const source = params?.source || 'shop'; 

    const [productQuery, setProductQuery] = useState({
        page: 1, 
        limit: 100, 
    }); 

    const { productsExt, getProductsExt } = useProductsExt(); 
    console.log(productsExt); 
    const { products, getProducts } = useProducts(productQuery); 
    console.log(products); 

    let productsList;

    if (source == 'market') {
        productsList = productsExt; 
        console.log(productsList); 
    } else if (source == 'shop') {
        productsList = products; 
        console.log(productsList); 
    } else {
        productsList = products; 
        console.log(productsList); 
    }
    
    // const first_page = 1; 
    // const pageNumberForward = (posts?.meta?.current_page + 1 > posts?.meta?.last_page) ? posts?.meta?.last_page : posts?.meta?.current_page + 1; 
    // const pageNumberBackward = (posts?.meta?.current_page - 1 < first_page) ? first_page : posts?.meta?.current_page - 1; 

    return ( 
        <Layout> 
            { scrollToTop() }
            { (productsList?.data?.length > 0) && 
                <div className="px-3 fs-6 d-flex justify-content-end align-items-center">
                    <span>{ productsList?.data?.length } item{ productsList?.data?.length > 0 && 's'}</span>
                </div> 
            }

            <section className="grid grid-order-reverse pt-3 px-3"> 

                <Aside />

                <div className="main"> 

                    <section className="products pt-3">
                        {(productsList?.data?.length > 0) && (productsList?.data?.map((product, index) => {
                            return (
                                <article key={ product?._id } className="card border-0 mb-5">
                                    <ProductComponent2 
                                        // key = { product?.id } 
                                        itemId = { product?.id || product?._id } 
                                        asin = { product?.asin || product?.id } 
                                        imgSrc =  { product?.images ?? product?.image }
                                        title = { product?.title } 
                                        description = '' 
                                        oldPrice = { product?.initial_retail_price && product?.initial_retail_price } 
                                        currentPrice = { product?.retail_price || product?.price } 
                                        rating = { product?.rating?.rate } 
                                        orderCount = { product?.order_count } 
                                        salesCount = { product?.sale_count } 
                                        category = { product?.category } />
                                </article>
                            )
                        }))}
                    </section> 

                    {/* <PaginationLinks />  */}
                    { (productsList?.data?.length > 0) && 
                        <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    // await getProducts((products?.meta?.current_page >= 1) ? (products?.meta?.current_page - 1) : 1); 
                                    let previousPage = ((products?.meta?.current_page >= 1) ? (products?.meta?.current_page - 1) : 1)
                                    setProductQuery(prevState => ({
                                        ...prevState, 
                                        // role: productQuery?.role, 
                                        page: previousPage
                                    })); 
                                    await getProducts(productQuery); 
                                } }>
                                    <Previous /> 
                            </span> 
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    scrollToTop(); 
                                    // await getProducts((products?.meta?.current_page < products?.meta?.total_pages) ? (products?.meta?.current_page + 1) : products?.meta?.total_pages); 
                                    let nextPage = ((products?.meta?.current_page < products?.meta?.total_pages) ? (products?.meta?.current_page + 1) : products?.meta?.total_pages)
                                    setProductQuery(prevState => ({
                                        ...prevState, 
                                        // role: productQuery?.role, 
                                        page: nextPage
                                    })); 
                                    await getProducts(productQuery); 
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
