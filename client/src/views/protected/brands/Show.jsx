import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useBrand } from '@/hooks/useBrand.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() { 
    const params = useParams(); 
    const { brand, getBrand, updateBrand } = useBrand(params?.id); 
    // console.log(brand); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4" style={{ textTransform: 'capitalize' }}>
                        <Link to={ route('home.brands.index') } className="text-dark">
                            Brands
                        </Link>&nbsp;
                        | { brand?.data?.data?.name }</h2> 

                    <section className="py-4">
                        <div className="title-socials-logo d-flex justify-content-between align-items-center flex-wrap">
                            <div className="title-socials">
                                <h3 className="pb-3" style={{ textTransform: 'capitalize' }}>{ brand?.data?.data?.name }</h3> 
                                <div className="socials d-flex align-items-center gap-3 flex-wrap">
                                    { brand?.data?.data?.web_address && 
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe2" viewBox="0 0 16 16">
                                                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                                                </svg>
                                            </span>
                                            <span>{ brand?.data?.data?.web_address }</span>
                                        </span> }
                                    { brand?.data?.data?.facebook && 
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                                </svg>
                                            </span>
                                            <span>{ brand?.data?.data?.facebook }</span>
                                        </span> }
                                    { brand?.data?.data?.instagram && 
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                                </svg>
                                            </span>
                                            <span>{ brand?.data?.data?.instagram }</span>
                                        </span> }
                                    { brand?.data?.data?.twitter_x && 
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                                    </svg>
                                            </span>
                                            <span>{ brand?.data?.data?.twitter_x }</span>
                                        </span> }
                                    { brand?.data?.data?.other_social && 
                                        <span className="d-flex align-items-center gap-1">
                                            <span>
                                                { brand?.data?.data?.other_social }:
                                            </span>
                                            <span style={{ textTransform: 'capitalize' }}>{ brand?.data?.data?.other_social_handle }</span>
                                        </span> }
                                </div>
                            </div> 
                            <div className="logo pt-3" style={{ maxWidth: '200px' }}>
                                { brand?.data?.data?.logo_path?.url 
                                    ?   <img 
                                            src={ brand?.data?.data?.logo_path?.url } 
                                            className="img-fluid object-fit-cover border-radius-15" 
                                            style={{ width: '100%', height: '100%' }} 
                                            alt={ brand?.data?.data?.name } /> 
                                    :   <span className="w-100 d-flex justify-content-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                            </svg>
                                        </span> }
                            </div>
                        </div>

                        <div className="pt-3">
                            <p>{ brand?.data?.data?.description }</p> 
                        </div>
                    </section> 

                    <section className="products">
                        <h3 className="border-bottom pb-1 fs-5 w-100">Products associated with&nbsp;<span style={{ textTransform: 'capitalize' }}>{ brand?.data?.data?.name }</span></h3>

                        <section>
                            { (brand?.data?.data?.products?.length > 0) ? 
                                <>
                                    <div className="text-end p-3">
                                        <PaginationMeter 
                                            current_page={ brand?.data?.meta?.current_page } 
                                            limit={ brand?.data?.meta?.limit } 
                                            total_pages={ brand?.data?.meta?.total_pages } 
                                            total_results={ brand?.data?.meta?.total_results } />
                                    </div>

                                    <ul className="list-unstyled">
                                        { (brand?.data?.data?.products?.length > 0) && brand?.data?.data?.products?.map((product, index) => {
                                            return ( 
                                                <li 
                                                    key={ product?._id } 
                                                    className="box-shadow-1 border-radius-25 mb-3 py-3 px-2 cursor-pointer">
                                                        <span className="d-flex justify-content-end px-3 pt-2">
                                                            <Link 
                                                                to={ route('products.show', { source: 'shop', id: product?._id }) } 
                                                                target="_blank" 
                                                                className="py-0 text-decoration-none btn btn-sm btn-dark fw-semibold border-radius-35">
                                                                    View Details
                                                            </Link>
                                                        </span>
                                                        <ProductComponent1 
                                                            index={ (((brand?.data?.meta?.current_page) > 1) 
                                                                        ? (((brand?.data?.meta?.current_page - 1) * 10) + 1) 
                                                                            : brand?.data?.meta?.current_page) + index } 
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
                                        })}
                                    </ul> 
                                </>
                                    : (
                                        <div className="h-100 w-100 py-4 d-flex justify-content-center align-items-center">
                                            <span>There are no products associated with the&nbsp;<span style={{ textTransform: 'capitalize' }}>{ brand?.data?.data?.name }</span>&nbsp;brand.</span>
                                        </div>
                                    ) } 
                            
                            { (brand?.data?.data?.products?.length > 0) && 
                                <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let firstPage = 1; 
                                            await getBrand(params?.id, firstPage, 10); 
                                        } }>
                                            <First /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let previousPage = ((brand?.data?.meta?.current_page >= 1) ? (brand?.data?.meta?.current_page - 1) : 1); 
                                            await getBrand(params?.id, previousPage, 10); 
                                        } }>
                                            <Previous /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let nextPage = ((brand?.data?.meta?.current_page < brand?.data?.meta?.total_pages) ? (brand?.data?.meta?.current_page + 1) : brand?.data?.meta?.total_pages);
                                            await getBrand(params?.id, nextPage, 10); 
                                        } }>
                                        <Next /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let lastPage = brand?.data?.meta?.total_pages; 
                                            await getBrand(params?.id, lastPage, 10); 
                                        } }>
                                            <Last />
                                    </span>
                                </section> 
                            }
                        </section>
                    </section>
                </div> 
            </div>
        </Layout>
    )
}