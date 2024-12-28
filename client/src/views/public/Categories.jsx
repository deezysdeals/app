import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useCategoriesExt } from '@/hooks/external/useFakeStoreCategories.jsx'; 
import { useCategories } from '@/hooks/useCategories.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
// import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
// import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
// import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Aside from '@/components/public/Aside.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 


export default function Categories() {
    const params = useParams(); 
    const source = params?.source || 'shop'; 

    const [categoryQuery, setCategoryQuery] = useState({
        page: 1, 
        limit: 100, 
    }); 

    const { categoriesExt, getCategoriesExt } = useCategoriesExt(); 
    console.log(categoriesExt); 
    const { categories, getCategories } = useCategories(categoryQuery); 
    console.log(categories); 

    let categoryList; 

    if (source == 'market') {
        categoryList = categoriesExt; 
        console.log(categoryList); 
    } else if (source == 'shop') {
        categoryList = categories; 
        console.log(categoryList); 
    } else {
        categoryList = categories; 
        console.log(categoryList); 
    }

    return ( 
        <Layout>
            <section className="grid grid-order-reverse pt-3 px-3"> 

                    <Aside />

                    <div className="main">

                        <section className="products pt-5 d-flex flex-wrap gap-4">
                            {(categoryList?.data?.length > 0) && (categoryList?.data?.map((category, index) => {
                                return (
                                    <article key={ index } className="card border-1 px-3 mb-5">
                                        <Link to={ route('categories.show', { id: (category?._id || category[index]) }) } className="text-decoration-none text-dark">
                                            <div className="card-body gap-0">
                                                <span className="card-title fs-4 text-capitalize">{ (category?.name || category[index]) }</span>
                                            </div>
                                        </Link>
                                    </article>
                                )
                            }))}
                        </section> 
                    
                        {/* <PaginationLinks />  */}
                        { (categoryList?.data?.length > 0) && 
                            <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let previousPage = ((categoryList?.meta?.current_page >= 1) ? (categoryList?.meta?.current_page - 1) : 1)
                                        setCategoryQuery(prevState => ({
                                            ...prevState, 
                                            page: previousPage
                                        })); 
                                        if (source == 'market') {
                                            await getCategoriesExt(categoryQuery); 
                                        } else if (source == 'market') {
                                            await getCategories(categoryQuery); 
                                        }
                                    } }>
                                        <Previous /> 
                                </span> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let nextPage = ((categoryList?.meta?.current_page < categoryList?.meta?.total_pages) ? (categoryList?.meta?.current_page + 1) : categoryList?.meta?.total_pages)
                                        setCategoryQuery(prevState => ({
                                            ...prevState, 
                                            page: nextPage
                                        })); 
                                        if (source == 'market') {
                                            await getCategoriesExt(categoryQuery); 
                                        } else if (source == 'market') {
                                            await getCategories(categoryQuery); 
                                        }
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
