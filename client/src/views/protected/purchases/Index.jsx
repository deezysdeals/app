import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime); 
dayjs.extend(utc); 
import { usePurchases } from '@/hooks/usePurchases.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [purchaseQuery, setPurchaseQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 
    const { purchases, getPurchases } = usePurchases(purchaseQuery); 
    // console.log(purchases); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                        <h2 className="fs-4">Purchases for Re-Sale</h2> 

                        <div className="">
                            <Link to={ route('home.products.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div>
                    </section>

                    <section className="d-flex justify-content-end flex-wrap gap-2"> 
                        <div>
                            { (purchases?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ purchases?.meta?.current_page } 
                                        limit={ purchases?.meta?.limit } 
                                        total_pages={ purchases?.meta?.total_pages } 
                                        total_results={ purchases?.meta?.total_results } /> } 
                        </div>
                    </section>

                    <section className="py-4">
                        { (purchases?.data?.length > 0) ?
                            <ul className="list-unstyled d-flex flex-column gap-5">
                                { (purchases?.data?.length > 0) && (purchases?.data?.map((product, index) => {
                                    return (
                                        <li 
                                            key={ product?._id } 
                                            className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                                <ProductComponent1 
                                                    index={ (((purchases?.meta?.current_page) > 1) 
                                                                ? (((purchases?.meta?.current_page - 1) * purchases?.meta?.limit) + 1) 
                                                                    : purchases?.meta?.current_page) + index } 
                                                    itemId={ product?._id } 
                                                    productId={ product?._id } 
                                                    asin={ product?.asin }
                                                    imgsSrc={ product?.images }
                                                    title={ product?.title } 
                                                    description='' 
                                                    oldPrice='' 
                                                    currentPrice={ product?.purchase_price } 
                                                    rating={ product?.rating?.rate } 
                                                    category={ product?.category } />
                                        </li>
                                    )
                                })) }
                            </ul> 
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no purchased products yet.</span>
                                </div>
                            ) }
                    </section>
                </div>

                { (purchases?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ purchases } 
                            getItems={ getPurchases } 
                            query={ purchaseQuery } 
                            setQuery={ setPurchaseQuery } /> } 
            </div>
        </Layout>
    )
}
