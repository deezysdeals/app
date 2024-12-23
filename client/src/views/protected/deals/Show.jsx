import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDeal } from '@/hooks/useDeal.jsx'; 
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
    const { deal, getDeal } = useDeal(params?.id); 
    console.log(deal); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.deals.index') } className="text-dark">
                            Deals
                        </Link>&nbsp;
                        | <span className="fw-semibold">{ (deal?.data?.data?.code)?.toUpperCase() }</span></h2>

                    <section className="py-4">
                        <div className="title-socials-logo d-flex justify-content-between align-items-center flex-wrap">
                            <div className="title-socials">
                                <h3 className="pb-2">{ deal?.data?.data?.code }</h3> 
                                <p className="" style={{ textTransform: 'capitalize' }}>{ ((deal?.data?.data?.title)?.slice(0,1)?.toUpperCase())+((deal?.data?.data?.title)?.slice(1)) }</p> 
                                {/* <p className="">{ deal?.data?.value } { (deal?.data?.value_unit)?.toUpperCase() }</p>  */}
                                <p className="">{ Number(deal?.data?.data?.value) }&nbsp;{ (deal?.data?.data?.value_unit) == 'usd' ? 'USD' : '%' }&nbsp;value</p> 
                                <p className="text-secondary"><small>added&nbsp;{ dayjs(deal?.data?.order?.created_at).format('dddd, MMMM D, YYYY h:mm A') }</small></p> 
                            </div> 
                            <div className="logo pt-3" style={{ maxWidth: '200px' }}>
                                { deal?.data?.data?.image_path?.url 
                                    ?   <img 
                                            src={ deal?.data?.data?.image_path?.url } 
                                            className="img-fluid object-fit-cover border-radius-15" 
                                            style={{ width: '100%', height: '100%' }} 
                                            alt={ deal?.data?.data?.title } /> 
                                    :   <span className="w-100 d-flex justify-content-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                            </svg>
                                        </span> }
                            </div>
                        </div>

                        <div className="pt-4">
                            <p>{ deal?.data?.data?.description }</p> 
                        </div>
                    </section> 

                    <section className="products">
                        <h3 className="border-bottom pb-1 fs-5 w-100">Products associated with&nbsp;<span style={{ textTransform: 'capitalize' }}>{ deal?.data?.title }</span></h3>

                        <section>
                            { (deal?.data?.data?.products?.length > 0) ? 
                                <>
                                    <div className="text-end p-3">
                                        <PaginationMeter 
                                            current_page={ deal?.data?.meta?.current_page } 
                                            limit={ deal?.data?.meta?.limit } 
                                            total_pages={ deal?.data?.meta?.total_pages } 
                                            total_results={ deal?.data?.meta?.total_results } />
                                    </div>

                                    <ul className="list-unstyled">
                                        { (deal?.data?.data?.products?.length > 0) && deal?.data?.data?.products?.map((product, index) => {
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
                                                            index={ (((deal?.data?.meta?.current_page) > 1) 
                                                                        ? (((deal?.data?.meta?.current_page - 1) * 10) + 1) 
                                                                            : deal?.data?.meta?.current_page) + index } 
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
                                            <span>There are no products associated with the&nbsp;<span style={{ textTransform: 'capitalize' }}>{ deal?.data?.data?.name }</span>&nbsp;deal.</span>
                                        </div>
                                    ) } 
                            
                            { (deal?.data?.data?.products?.length > 0) && 
                                <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let firstPage = 1; 
                                            await getDeal(params?.id, firstPage, 10); 
                                        } }>
                                            <First /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let previousPage = ((deal?.data?.meta?.current_page >= 1) ? (deal?.data?.meta?.current_page - 1) : 1); 
                                            await getDeal(params?.id, previousPage, 10); 
                                        } }>
                                            <Previous /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let nextPage = ((deal?.data?.meta?.current_page < deal?.data?.meta?.total_pages) ? (deal?.data?.meta?.current_page + 1) : deal?.data?.meta?.total_pages);
                                            await getDeal(params?.id, nextPage, 10); 
                                        } }>
                                        <Next /> 
                                    </span> 
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            scrollToTop(); 
                                            let lastPage = deal?.data?.meta?.total_pages; 
                                            await getDeal(params?.id, lastPage, 10); 
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
