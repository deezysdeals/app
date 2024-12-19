import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
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
    // console.log(deals); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                        <h2 className="fs-4">Deals</h2> 

                        <div className="">
                            <Link to={ route('home.deals.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div>
                    </section> 

                    <section className="text-end pb-3">
                        <span>
                            { (deals?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ deals?.meta?.current_page } 
                                        limit={ deals?.meta?.limit } 
                                        total_pages={ deals?.meta?.total_pages } 
                                        total_results={ deals?.meta?.total_results } /> } 
                        </span> 
                    </section> 

                    <section className="py-3">
                        { (deals?.data?.length > 0) ? 
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                { (deals?.data?.length > 0) && (deals?.data?.map((deal, index) => {
                                    return (
                                        <li key={ deal?._id } className="card border-radius-25 box-shadow-1 mb-3 p-3">
                                            <div className="d-flex justify-content-end align-items-center gap-3 px-3 pb-3"> 
                                                <span className="btn btn-sm btn-dark border-radius-35 py-0">
                                                    <Link to={ route('home.deals.show', { id: deal?._id })} 
                                                        className="text-decoration-none text-white fw-semibold">
                                                            View Details
                                                    </Link>
                                                </span> 
                                                <div className="dropdown">
                                                    <span className="text-decoration-none text-dark" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        className="bi bi-three-dots" viewBox="0 0 16 16">
                                                            <path
                                                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                                        </svg> 
                                                    </span>

                                                    <ul className="dropdown-menu"> 
                                                        <li>
                                                            <Link to={ route('home.deals.edit', { id: deal?._id }) } className="dropdown-item d-flex align-items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                                                    <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                                                                </svg>
                                                                <span className="fw-semibold">Update</span>
                                                            </Link>
                                                        </li> 
                                                        <li 
                                                            onClick={ async () => {
                                                                swal.fire({
                                                                    text: "Are you sure you want to delete this?", 
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: "#FF0000",
                                                                    cancelButtonColor: "#414741",
                                                                    confirmButtonText: "Yes!", 
                                                                    cancelButtonText: "No!", 
                                                                    customClass: {
                                                                        confirmButton: 'swal2-button', 
                                                                        cancelButton: 'swal2-button'
                                                                    }, 
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        deleteDeal(deal?._id); 
                                                                        getDeals(dealQuery);
                                                                    }
                                                                });
                                                            }}>
                                                            <span className="dropdown-item d-flex align-items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF0000" className="bi bi-trash2" viewBox="0 0 16 16">
                                                                    <path d="M14 3a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2M3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5s-3.69-.311-4.785-.793"/>
                                                                </svg>
                                                                <span className="text-danger fw-semibold cursor-pointer">Delete</span>
                                                            </span> 
                                                        </li> 
                                                    </ul>
                                                </div>
                                            </div>
                                            <Link 
                                                to={ route('home.deals.show', { id: deal?._id }) } 
                                                className="text-decoration-none text-dark">
                                                    <div className="row g-0"> 
                                                        <div className="col-md-8">
                                                            <div className="card-body">
                                                                <h5 className="card-title" style={{ textTransform: 'capitalize' }}>{ deal?.code }</h5>
                                                                <p className="card-title" style={{ textTransform: 'capitalize' }}>{ deal?.title }</p>
                                                                <p className="card-text">{ deal?.description }</p> 
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            { deal?.image_path?.url 
                                                                ?   <img 
                                                                        src={ deal?.image_path?.url } 
                                                                        className="img-fluid object-fit-cover border-radius-15" 
                                                                        style={{ width: '100%', height: '100%' }} 
                                                                        alt={ deal?.title } /> 
                                                                :   <span className="w-100 d-flex justify-content-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                        </svg>
                                                                    </span> }
                                                        </div>
                                                    </div>
                                            </Link>
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
