import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDeal } from '@/hooks/useDeal.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() { 
    const params = useParams(); 
    const { deal, getDeal } = useDeal(params?.id); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.deals.index') } className="text-dark">
                            Deals
                        </Link>&nbsp;
                        | <span className="fw-semibold">{ (deal?.data?.code)?.toUpperCase() }</span></h2>

                    <div className="py-3"> 

                        <section className="deal-details">
                            <div className="box-shadow-1 border-radius-25 py-4 px-4 d-flex flex-column">
                                <h3><span className="fw-normal fs-6">Code:</span>&nbsp;<span className="fw-semibold fs-5">{ (deal?.data?.code)?.toUpperCase() }</span></h3> 
                                <p>Title:&nbsp;<span className="fw-semibold fs-5">{ ((deal?.data?.title)?.slice(0,1)?.toUpperCase())+((deal?.data?.title)?.slice(1)) }</span></p> 
                                <p>Description:&nbsp;<span className="fw-semibold fs-5">{ deal?.data?.description }</span></p> 
                                <p>Value:&nbsp;<span className="fw-semibold fs-5">{ deal?.data?.value }&nbsp;{ (deal?.data?.value_unit) == 'usd' ? 'USD' : '%' }</span></p> 
                                <p>Added:&nbsp;<span className="fw-semibold fs-5">{ dayjs(deal?.order?.created_at).format('dddd, MMMM D, YYYY h:mm A') }</span></p> 
                            </div>
                        </section> 

                        <section className="products-associated-with-deal">
                            <h3 className="fw-semibold fs-6 border-bottom pb-2 pt-5 px-3">Products associated with Deal</h3>
                        </section>

                    </div> 
                </div> 
            </div>
        </Layout>
    )
}
