import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDeals } from '@/hooks/useDeals.jsx'; 
import { useDeal } from '@/hooks/useDeal.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
    const [dealQuery, setDealQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 

    const { deals, getDeals } = useDeals(dealQuery); 
    const { deleteDeal } = useDeal(); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">Deals</h2> 

                    <section className="d-flex justify-content-end pb-4">
                        <Link to={ route('home.deals.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                            Add New Deal
                        </Link>
                    </section> 

                    <section className="py-4">
                        <div className="text-end pb-3">
                            <span>
                                { (deals?.data?.length > 0) 
                                    && <PaginationMeter 
                                            current_page={ deals?.meta?.current_page } 
                                            limit={ deals?.meta?.limit } 
                                            total_pages={ deals?.meta?.total_pages } 
                                            total_results={ deals?.meta?.total_results } /> } 
                            </span> 
                        </div> 

                        { (deals?.data?.length > 0) ? 
                            <ul className="list-unstyled d-flex flex-column gap-5">
                                { (deals?.data?.length > 0) && (deals?.data?.map((deal, index) => {
                                    return (
                                        <li key={ deal?._id } className="box-shadow-1 border-radius-25 py-4 px-2 cursor-pointer">
                                            <div className="text-dark px-3">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                                                    <span className="fw-semibold">#
                                                        { (deals?.meta?.current_page != 1) 
                                                            ? (((deals?.meta?.current_page - 1) * deals?.meta?.limit) + (index + 1))
                                                            : deals?.meta?.current_page * (index + 1) }
                                                    </span>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        <Link 
                                                            to={ route('home.deals.show', { id: deal?._id })}
                                                            className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                                                View Deal
                                                        </Link>
                                                        <Link to={ route('home.deals.edit', { id: deal?._id })}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                                                <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                                                            </svg>
                                                        </Link>
                                                        <div>
                                                            <span type="button" data-bs-toggle="modal" data-bs-target={ `#delete${deal?._id}Modal` }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" className="bi bi-trash2" viewBox="0 0 16 16">
                                                                    <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                                                                </svg>
                                                            </span> 

                                                            <div className="modal fade" id={ `delete${deal?._id}Modal` } tabIndex="-1" aria-labelledby={ `delete${deal?._id}ModalLabel` } aria-hidden="true">
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header d-flex justify-content-end">
                                                                            <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                        <div className="modal-body">
                                                                            Are you sure you want to delete&nbsp;<span className="fw-semibold fs-6">{ (deal?.code)?.toUpperCase() }</span>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="btn btn-sm btn-dark border-radius-35" data-bs-dismiss="modal">No</button>
                                                                            <button 
                                                                                type="button" 
                                                                                onClick={ async () => {
                                                                                    await deleteDeal(deal?._id); 
                                                                                    await getDeals(dealQuery); 
                                                                                }} 
                                                                                className="btn btn-sm btn-danger border-radius-35">Delete</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> 
                                                <div className="amount-and-client d-flex flex-column gap-2">
                                                    <h3 className="fw-semibold">{ deal?.title }</h3> 
                                                    <span className="fw-semibold fs-5"><small>added:&nbsp;{ dayjs.utc(deal?.created_at).fromNow() }</small></span>
                                                </div>
                                            </div> 
                                        </li> 
                                    )
                                }))}
                            </ul> 
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no deals yet.</span>
                                </div>
                            )}
                    </section>
                </div> 

                { (deals?.data?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let firstPage = 1
                                setDealQuery(prevState => ({
                                    ...prevState, 
                                    // role: dealQuery?.role, 
                                    page: firstPage
                                })); 
                                await getDeals(); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let previousPage = ((deals?.meta?.current_page >= 1) ? (deals?.meta?.current_page - 1) : 1)
                                setDealQuery(prevState => ({
                                    ...prevState, 
                                    // role: dealQuery?.role, 
                                    page: previousPage
                                })); 
                                await getDeals(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let nextPage = ((deals?.meta?.current_page < deals?.meta?.total_pages) ? (deals?.meta?.current_page + 1) : deals?.meta?.total_pages)
                                setDealQuery(prevState => ({
                                    ...prevState, 
                                    // role: dealQuery?.role, 
                                    page: nextPage
                                })); 
                                await getDeals(); 
                                // console.log('deal page', dealQuery?.page)
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let lastPage = deals?.meta?.total_pages
                                setDealQuery(prevState => ({
                                    ...prevState, 
                                    // role: dealQuery?.role, 
                                    page: lastPage
                                })); 
                                await getDeals(); 
                            } }>
                                <Last />
                        </span>
                    </section>
                }
            </div> 
        </Layout>
    )
}
