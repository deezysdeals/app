import { useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useSales } from '@/hooks/useSales.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [saleQuery, setSaleQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 
    const { sales, getSales } = useSales(saleQuery); 
    // console.log(sales); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1">
                        <h2 className="fs-4">Sales</h2> 

                        {/* <div className="">
                            <Link to={ route('home.products.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div> */}
                    </section>

                    <section className="d-flex justify-content-end flex-wrap gap-2 pt-4"> 
                        <div>
                            { (sales?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ sales?.meta?.current_page } 
                                        limit={ sales?.meta?.limit } 
                                        total_pages={ sales?.meta?.total_pages } 
                                        total_results={ sales?.meta?.total_results } /> } 
                        </div>
                    </section>

                    <section className="py-4">
                        { (sales?.data?.length > 0) 
                        ?   <ul className="list-unstyled d-flex flex-column gap-5">
                                { (sales?.data?.length > 0) && (sales?.data?.map((sale, index) => {
                                    return ( 
                                        <li 
                                            key={ sale?._id } 
                                            className="box-shadow-1 border-radius-25 py-3 px-2 cursor-pointer">
                                                <ProductComponent1 
                                                    index={ (((sales?.meta?.current_page) > 1) 
                                                                ? (((sales?.meta?.current_page - 1) * sales?.meta?.limit) + 1) 
                                                                    : sales?.meta?.current_page) + index } 
                                                    itemId={ sale?._id } 
                                                    productId={ sale?.product?._id } 
                                                    asin={ sale?.product?.asin }
                                                    imgsSrc={ sale?.product?.images }
                                                    title={ sale?.product?.title } 
                                                    description='' 
                                                    oldPrice='' 
                                                    currentPrice={ sale?.cost_price } 
                                                    sellingPrice={ sale?.selling_price }
                                                    rating={ sale?.product?.rating?.rate } 
                                                    category={ sale?.product?.category } 
                                                    orderId={ sale?.order?._id } 
                                                    orderPrice={ sale?.order?.total_to_be_paid } 
                                                    purchasePrice={ sale?.product?.purchase_price || sale?.cost_price || sale?.product?.retail_price } 
                                                    purchaseDate={ sale?.product?.created_at }
                                                    saleDate={ sale?.order?.paid_at } />
                                        </li>
                                    )
                                })) }
                            </ul> 
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no sales made yet.</span>
                                </div>
                            ) }
                    </section>
                </div>

                { (sales?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ sales } 
                            getItems={ getSales } 
                            query={ saleQuery } 
                            setQuery={ setSaleQuery } /> } 
            </div>
        </Layout>
    )
}
