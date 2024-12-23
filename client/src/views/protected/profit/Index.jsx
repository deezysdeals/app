import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useProfits } from '@/hooks/useProfits.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import ProductComponent1 from '@/components/protected/nested-components/ProductComponent1';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    /** Voice-to-Text Search funtionality */
    const [searchKey, setSearchKey] = useState(''); 

    useEffect(() => {
        if (searchKey) {
            console.log('search for:', searchKey);
        }
    }, [searchKey]);

    const { handleStartListening, 
            handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();
    /** End of Voice-to-Text Search funtionality */

    const [profitQuery, setProfitQuery] = useState({
        page: 1, 
        limit: 10, 
    }); 
    const { profits, getProfits } = useProfits(); 
    console.log(profits);

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1">
                        <h2 className="fs-4">Profit Margin</h2> 

                        <div className="">
                            <Link to={ route('home.products.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div>
                    </section> 

                    <section className="d-flex justify-content-between flex-wrap gap-2 pt-4"> 
                        <div className="search">
                            <div className="search-container border border-dark" style={{ maxWidth: '375px' }}>
                                { !isListening &&
                                    <span 
                                        type="button" 
                                        onClick={ handleStartListening }
                                        className="voice-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill"
                                            viewBox="0 0 16 16">
                                            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"></path>
                                            <path
                                                d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5">
                                            </path>
                                        </svg>
                                    </span> }
                                <input 
                                    type="text" 
                                    value={ voiceText } 
                                    onChange={ (e) => setVoiceText(e.target.value) }
                                    placeholder="Search product ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        
                                        scrollToTop(); 
                                        await getProfits(1); 
                                    } }
                                    className="search-icon">
                                        <svg width="16"
                                            height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                </span>
                            </div>
                        </div>
                        <span>
                            { (profits?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ profits?.meta?.current_page } 
                                        limit={ profits?.meta?.limit } 
                                        total_pages={ profits?.meta?.total_pages } 
                                        total_results={ profits?.meta?.total_results } /> } 
                        </span>
                    </section>

                    <section className="py-4">
                        { (profits?.data?.length > 0) 
                        ?   <ul className="list-unstyled d-flex flex-column gap-5">
                                { (profits?.data?.length > 0) && (profits?.data?.map((product, index) => {
                                    return (
                                        <li key={ product?._id } className="box-shadow-1 border-radius-25 py-4 px-2 cursor-pointer">
                                            <div className="text-dark px-3">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                                                    <span className="fw-semibold">
                                                        #{ (((profits?.meta?.current_page) > 1) 
                                                            ? (((profits?.meta?.current_page - 1) * profits?.meta?.limit) + 1) 
                                                                : profits?.meta?.current_page) + index }
                                                    </span>
                                                    <span 
                                                        type="button" 
                                                        data-bs-toggle="modal" data-bs-target={`#productImage${product?._id}Modal`}
                                                        className="btn btn-sm btn-dark border-radius-35 py-0 fw-semibold">
                                                            View Details
                                                    </span>
                                                </div> 
                                                <div className="amount-and-client">
                                                    <h3>Profit:&nbsp;
                                                        <span className="fw-semibold">
                                                            ${ (Number(product?.selling_price || 0) - Number(product?.product?.retail_price || 0))?.toFixed(2) }
                                                        </span>
                                                    </h3> 
                                                    <p>Bought by&nbsp;
                                                        <Link 
                                                            to={ route('home.users.show', { username: product?.user?.username }) } 
                                                            className="text-dark">
                                                                { product?.user?.first_name + ' ' + product?.user?.last_name }
                                                        </Link>
                                                        &nbsp;from { product?.order?.state_region },&nbsp;
                                                        <small className="text-secondary">{ dayjs.utc(product?.order?.created_at).fromNow() }</small></p>
                                                </div>
                                                <section className="ordered-items pt-0" style={{ maxWidth: '600px' }}> 
                                                    <article className="ordered-item row align-items-center g-3 py-1">
                                                        <div className="col-md-2">
                                                            <div id={ `carousel1${product?._id}` } className="carousel slide">
                                                                <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                                    <div className="images">
                                                                        { (product?.product?.images?.length > 0) && product?.product?.images?.map((image, index) => {
                                                                            return (
                                                                                <div key={ index } className={`carousel-item ${(index==0) && 'active'}`}>
                                                                                    <img src={ image } className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                                                </div>
                                                                            )
                                                                        })} 
                                                                    </div> 

                                                                    <div>
                                                                        <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={ `#carousel1${product?._id}` } data-bs-slide="prev">
                                                                            <span>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                                </svg>
                                                                            </span>
                                                                            <span className="visually-hidden">Previous</span>
                                                                        </button>
                                                                        <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={ `#carousel1${product?._id}` } data-bs-slide="next">
                                                                            <span>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                                                </svg>
                                                                            </span>
                                                                            <span className="visually-hidden">Next</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                                                <p className="fw-semibold" style={{ textTransform: 'capitalize' }}>
                                                                    { (product?.product?.title)?.slice(0,20) + ((product?.product?.title?.length > 20) && '...') }
                                                                </p>
                                                            </div>
                                                        </div> 
                                                    </article>
                                                </section>
                                            </div> 

                                            <div className="modal fade" id={`productImage${product?._id}Modal`} tabIndex="-1" aria-labelledby={`productImage${product?._id}ModalLabel`} aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header d-flex justify-content-end align-items-center gap-1">
                                                            <h3 className="modal-title fs-5 d-none" id={`productImage${product?._id}ModalLabel`}>{ product?.product?.title }</h3>
                                                            <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body d-flex flex-column"> 
                                                            <small>Order:&nbsp;
                                                                <Link 
                                                                    to={ route('home.orders.show', { id: product?.order?._id }) } 
                                                                    className="text-dark">
                                                                    <span className="fw-semibold">#{product?.order?.paypal_order_id}</span>
                                                                </Link>
                                                            </small>
                                                            <small>Ref:&nbsp;<small className="fw-semibold text-uppercase">#{product?.order?._id}</small></small>
                                                            <section className="amount-and-client d-flex flex-column gap-1">
                                                                <h3 className="fw-semibold pt-2">${ (Number(product?.selling_price) - Number(product?.product?.retail_price))?.toFixed(2) }</h3> 
                                                                <span>Sold at:&nbsp;<span className="fw-semibold">${ Number(product?.selling_price)?.toFixed(2) }</span></span> 
                                                                <span>Bought at:&nbsp;<span className="fw-semibold">${ Number(product?.product?.retail_price)?.toFixed(2) }</span></span> 
                                                                <span>Transportation cost:&nbsp;<span className="fw-semibold">$3.00</span></span> 
                                                                <span>VAT:&nbsp;
                                                                    <span className="fw-semibold">
                                                                        ${ (Number(product?.selling_price) + (Number(product?.selling_price)*(10/100)))?.toFixed(2) }
                                                                    </span>
                                                                </span> 
                                                                <span className="d-flex align-items-center">
                                                                    <span>Paid with&nbsp;</span>
                                                                    { (product?.order?.payment_mode == 'paypal') && 
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paypal" viewBox="0 0 16 16">
                                                                            <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/>
                                                                        </svg>
                                                                    }
                                                                    { (product?.order?.payment_mode == 'card') && 
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16">
                                                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                                                                            <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                                                                        </svg>
                                                                    }
                                                                    { (product?.order?.payment_mode == 'cash') && 
                                                                        <span className="fw-semibold">Cash</span>
                                                                    }
                                                                </span>
                                                                <span>Sold to&nbsp;
                                                                    <Link 
                                                                        to={ route('home.users.show', { username: product?.user?.username }) } 
                                                                        target="_blank"
                                                                        className="text-dark">
                                                                            { product?.user?.first_name + ' ' + product?.user?.last_name }
                                                                    </Link>
                                                                    &nbsp;from&nbsp;{ product?.order?.state_region }, <small>2 days ago</small>
                                                                </span>
                                                            </section> 

                                                            <section className="ordered-items pt-4" style={{ maxWidth: '600px' }}> 
                                                                <article className="ordered-item row align-items-center g-3 py-1">
                                                                    <div className="col-md-2">
                                                                        <div id={`carousel${product?._id}ModalImage`} className="carousel slide">
                                                                            <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                                                <div className="images"> 
                                                                                    { (product?.product?.images?.length > 0) && (product?.product?.images?.map((image, index) => {
                                                                                        return (
                                                                                            <div key={ 'carousel'+image } className={`carousel-item ${(index==0) && `active`}`}>
                                                                                                <img src={ image } className="d-block object-fit-cover rounded" style={{ width: '75px', height: '75px' }} alt="..." />
                                                                                            </div>
                                                                                        )
                                                                                    }))} 
                                                                                </div> 

                                                                                <div>
                                                                                    <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carousel${product?._id}ModalImage`} data-bs-slide="prev">
                                                                                        <span>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                                            </svg>
                                                                                        </span>
                                                                                        <span className="visually-hidden">Previous</span>
                                                                                    </button>
                                                                                    <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`#carousel${product?._id}ModalImage`} data-bs-slide="next">
                                                                                        <span>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                                                            </svg>
                                                                                        </span>
                                                                                        <span className="visually-hidden">Next</span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                                                                            <span className="fs-5" style={{ textTransform: 'capitalize' }}>{ product?.product?.title }</span> 
                                                                            <div className="d-flex justify-content-end px-4">
                                                                                <span className="btn btn-sm btn-dark border-radius-35 d-flex align-items-center">
                                                                                    <Link to={ route('products.show', {source: 'shop', id: product?.product?._id}) } target="_blank"  className="text-decoration-none ps-1 fw-semibold text-white">
                                                                                        <span className="fw-semibold">See item details</span>&nbsp;
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                            className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                                                            <path
                                                                                                d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                                                        </svg>
                                                                                    </Link>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div> 
                                                                </article>
                                                            </section>
                                                        </div>
                                                        <div className="modal-footer">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> 
                                    )
                                }))} 
                            </ul> 
                                : (
                                    <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                        <span className="py-4" style={{ flexGrow: '1' }}>There are no profits made yet.</span>
                                    </div>
                                ) }
                    </section>
                </div>

                { (profits?.data?.length > 0) &&
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                let firstPage = 1
                                setProfitQuery(prevState => ({
                                    ...prevState, 
                                    page: firstPage
                                })); 
                                await getProfits(profitQuery); 
                                scrollToTop(); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                let previousPage = ((profits?.meta?.current_page >= 1) ? (profits?.meta?.current_page - 1) : 1)
                                setProfitQuery(prevState => ({
                                    ...prevState, 
                                    // role: profitQuery?.role, 
                                    page: previousPage
                                })); 
                                await getProfits(profitQuery); 
                                scrollToTop(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let nextPage = ((profits?.meta?.current_page < profits?.meta?.total_pages) ? (profits?.meta?.current_page + 1) : profits?.meta?.total_pages)
                                setProfitQuery(prevState => ({
                                    ...prevState, 
                                    page: nextPage
                                })); 
                                await getProfits(profitQuery); 
                                scrollToTop(); 
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => {
                                let lastPage = profits?.meta?.total_pages
                                setProfitQuery(prevState => ({
                                    ...prevState, 
                                    page: lastPage
                                })); 
                                await getProfits(profitQuery); 
                                scrollToTop(); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}
