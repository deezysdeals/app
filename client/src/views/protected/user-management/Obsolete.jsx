import React from 'react'

export default function Obsolete() {
    return (
        <section className="tabs">
            <ul className="nav nav-tabs" id="userTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'deliveries') && 'active'}`} 
                        id="deliveries-tab" 
                        data-bs-toggle="tab" 
                        data-bs-target="#deliveries-tab-pane" 
                        role="tab" 
                        aria-controls="deliveries-tab-pane" 
                        aria-selected={`${(activeLink == 'deliveries') ? 'true' : 'false'}`} 
                        aria-current="page" 
                        onClick={ async () => {
                            setActiveLink('deliveries'); 
                            getOrders();
                            } }>
                            <span>Deliveries (2)</span>
                    </span>
                </li> 
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'purchases') && 'active'}`} 
                        id="purchases-tab" 
                        data-bs-toggle="tab" 
                        data-bs-target="#purchases-tab-pane" 
                        role="tab" 
                        aria-controls="purchases-tab-pane" 
                        aria-selected={`${(activeLink == 'purchases') ? 'true' : 'false'}`} 
                        aria-current="page" 
                        onClick={ () => setActiveLink('purchases') }>
                            <span>Purchases (2)</span>
                        </span>
                </li>
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'responses-to-clients') && 'active'}`}
                        aria-current="page" 
                        onClick={ () => setActiveLink('responses-to-clients') }>
                            <span>Responses to Clients (14)</span>
                    </span>
                </li> 
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'pending-deliveries') && 'active'}`}
                        aria-current="page" 
                        onClick={ () => setActiveLink('pending-deliveries') }>
                            <span>Pending Deliveries (2)</span>
                    </span>
                </li> 
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'payments') && 'active'}`}
                        aria-current="page" 
                        onClick={ () => setActiveLink('payments') }>
                            <span>Payments (14)</span>
                    </span>
                </li> 
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'orders') && 'active'}`}
                        onClick={ () => setActiveLink('orders') }>
                            <span>Orders (2)</span>
                        </span>
                </li>
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'items-bought') && 'active'}`}
                        onClick={ () => setActiveLink('items-bought') }>
                            <span>Items Bought (50)</span>
                        </span>
                </li>
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'ratings') && 'active'}`}
                        onClick={ () => setActiveLink('ratings') }>
                            <span>Ratings/Reviews (5)</span>
                        </span>
                </li>
                <li className="nav-item">
                    <span 
                        type="button" 
                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'ratings') && 'active'}`}
                        onClick={ () => setActiveLink('ratings') }>
                            <span>Check-Ins (5)</span>
                        </span>
                </li>
            </ul>

            <section className="py-5"> 
                <div className="tab-content" id="userTabContent">
                    <div className="tab-pane fade show active" id="deliveries-tab-pane" role="tabpanel" aria-labelledby="deliveries-tab" tabIndex="0">
                        <section>
                            <div className="d-flex justify-content-between flex-wrap gap-2 pb-4 px-2">
                                <div className="fs-6 d-flex align-items-center gap-2">
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setOrderQuery(prevState => ({
                                                ...prevState,
                                                delivery_status: 'all',  
                                                page: 1
                                            })); 
                                            await getOrders(); 
                                        } }
                                        className={`btn btn-sm ${(orderQuery?.delivery_status == 'all') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
                                            All
                                    </span>
                                    <span 
                                        type="button" 
                                        onClick={ async () => {
                                            setOrderQuery(prevState => ({
                                                ...prevState,
                                                delivery_status: 'delivered',  
                                                page: 1
                                            })); 
                                            await getOrders(); 
                                        } }
                                        className={`btn btn-sm ${(orderQuery?.delivery_status == 'delivered') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
                                            Delivered
                                    </span>
                                    <span 
                                        type="button" 
                                        onClick={ async () => { 
                                            setOrderQuery(prevState => ({
                                                ...prevState,
                                                delivery_status: 'undelivered',  
                                                page: 1
                                            })); 
                                            await getOrders(); 
                                        } }
                                        className={`btn btn-sm ${(orderQuery?.delivery_status == 'undelivered') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
                                            Undelivered
                                    </span>
                                </div>
                                <span>
                                    { ((orders?.meta?.current_page) > 1) 
                                        ? (((orders?.meta?.current_page - 1) * orders?.meta?.limit) + 1) 
                                        : orders?.meta?.current_page }
                                            &nbsp;-&nbsp;
                                        { ((orders?.meta?.current_page * (orders?.meta?.limit)) > orders?.meta?.total_results) 
                                            ? (orders?.meta?.total_results)
                                                : ((orders?.meta?.current_page) != 1) 
                                                ? (orders?.meta?.current_page * orders?.meta?.limit) 
                                                    : ((orders?.meta?.current_page + (orders?.meta?.limit - 1))) } 
                                            &nbsp;of&nbsp; 
                                        { orders?.meta?.total_results } 
                                        &nbsp;(page { orders?.meta?.current_page } of { orders?.meta?.total_pages })
                                </span>
                            </div> 
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                { (orders?.data?.length > 0) ? (orders?.data?.map((order, index) => {
                                    return (
                                        <li key={order?._id} className="box-shadow-1 border-radius-25 py-4 px-2 cursor-pointer">
                                            <div className="text-dark px-3">
                                                <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                                                    <span className="fw-semibold">#
                                                        { (orders?.meta?.current_page != 1) 
                                                            ? (((orders?.meta?.current_page - 1) * orders?.meta?.limit) + (index + 1))
                                                            : orders?.meta?.current_page * (index + 1) }
                                                    </span>
                                                    <span 
                                                        type="button" 
                                                        data-bs-toggle="modal" data-bs-target={ `#order${order?._id}Modal` }
                                                        className="btn btn-sm btn-secondary border-radius-35 py-0 fw-semibold">
                                                            View Order Details
                                                    </span>
                                                </div> 
                                                <div className="amount-and-client">
                                                    <h3 className="fw-semibold">${ (order?.total_to_be_paid)?.toFixed(2) }</h3> 
                                                    <p>From { order?.state_region }, <small>{ dayjs.utc(order?.created_at).fromNow() }</small></p>
                                                </div>
                                                <section className="ordered-items pt-3" style={{ maxWidth: '600px' }}> 
                                                    <h4 className="fw-semibold border-bottom pb-1 fs-6">Ordered Items</h4>
                                                    <ol className='list-unstyled d-flex flex-column gap-1'> 
                                                        { (order?.order_items?.length > 0) && (order?.order_items?.slice(0,2)?.map((orderItem, index) => {
                                                            return (
                                                                <li key={ orderItem?._id } className="ordered-item row align-items-center g-3 py-1">
                                                                    <div className="col-md-2">
                                                                        <div id={`carousel${orderItem?._id}Image`} className="carousel slide">
                                                                            <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                                                <div className="images">
                                                                                    { (orderItem?.product?.images?.map((image, index) => {
                                                                                        return (
                                                                                            <div key={ index } className={`carousel-item ${ (index == 0) && `active`}`}>
                                                                                                <img src={ image } style={{ width: '75px', height: '75px' }} alt="..." />
                                                                                            </div>
                                                                                        )
                                                                                    })) }
                                                                                </div> 

                                                                                <div>
                                                                                    <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carousel${orderItem?._id}Image`} data-bs-slide="prev">
                                                                                        <span>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                                            </svg>
                                                                                        </span>
                                                                                        <span className="visually-hidden">Previous</span>
                                                                                    </button>
                                                                                    <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`#carousel${orderItem?._id}Image`} data-bs-slide="next">
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
                                                                            <h5>{ ((orderItem?.product?.title)?.length > 20) ? ((orderItem?.product?.title)?.slice(0,20) + ' ...') : orderItem?.product?.title }</h5>
                                                                            <div className=""><small className="quantity">{ orderItem?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ (orderItem?.product?.retail_price) }</span></div>
                                                                        </div>
                                                                    </div> 
                                                                </li>
                                                            )
                                                        })) }
                                                    </ol> 
                                                    { (order?.order_items?.length > 2) && 
                                                    (<span 
                                                        type="button" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-target={ `#order${order?._id}Modal` } 
                                                        className="text-decoration-underline pt-4">
                                                            <span className="fw-semibold">+{ order?.order_items?.length - 2 }</span>
                                                            &nbsp;other item{ ((order?.order_items?.length - 2) > 1) && 's' }
                                                    </span>) }
                                                </section>
                                            </div> 

                                            <div className="modal fade" id={ `order${order?._id}Modal` } tabIndex="-1" aria-labelledby={ `order${order?._id}ModalLabel` } aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header d-flex justify-content-end align-items-center gap-1">
                                                            <h3 className="modal-title fs-5 d-none" id={ `order${order?._id}ModalLabel` }>Item name</h3>
                                                            <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <section className="amount-and-client">
                                                                <span>Ref:&nbsp;<span className="fw-semibold">#{ (order?._id)?.toUpperCase() }</span></span>
                                                                <h3 className="fw-semibold">${ (order?.total_to_be_paid)?.toFixed(2) }</h3> 
                                                                <p className="d-flex align-items-center" style={{ marginTop: '-0.5rem' }}>
                                                                    <span>Paid with</span>
                                                                    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.vDMTOrQGXsCRn-XQj-IMuAHaCb%26pid%3DApi&f=1&ipt=b0a1976c6ae2a5d5b9c0b57c212a5d5de0cdff1be4f6eacacb44bf3d8c003d02&ipo=images" style={{ width: '50px' }} alt="" />
                                                                </p>
                                                                <p style={{ marginTop: '-0.5rem' }}>By&nbsp;
                                                                    <Link 
                                                                        to={ route('home.clients.show', { username: order?.user?.username }) } 
                                                                        className="text-dark">
                                                                            { order?.user?.first_name + ' ' + order?.user?.last_name }
                                                                    </Link>
                                                                    &nbsp;from { order?.state_region }, <small>{ dayjs.utc(order?.created_at).fromNow() }</small>
                                                                </p>
                                                            </section> 

                                                            <section className="ordered-items pt-1" style={{ maxWidth: '600px' }}> 
                                                                <h4 className="fw-semibold border-bottom pb-1 fs-6">Ordered Items</h4>
                                                                <ol className='list-unstyled d-flex flex-column gap-1'> 
                                                                    { (order?.order_items?.length > 0) && (order?.order_items?.map(orderItem => {
                                                                        return (
                                                                            <li key={ orderItem?._id } className="ordered-item row align-items-center g-3 py-1">
                                                                                <div className="col-md-2">
                                                                                    <div id={`carousel${orderItem?._id}ModalDetailImages`} className="carousel slide">
                                                                                        <div className="carousel-inner position-relative" style={{ width: '75px', height: '75px' }}>
                                                                                            <div className="images"> 
                                                                                                { (orderItem?.product?.images?.map((image, index) => {
                                                                                                    return (
                                                                                                        <div key={ index } className={`carousel-item ${ (index == 0) && `active`}`}>
                                                                                                            <img src={ image } style={{ width: '75px', height: '75px' }} alt="..." />
                                                                                                        </div>
                                                                                                    )
                                                                                                })) } 
                                                                                            </div> 

                                                                                            <div>
                                                                                                <button className="carousel-control-prev position-absolute left-0 ps-2" type="button" data-bs-target={`#carousel${orderItem?._id}ModalDetailImages`} data-bs-slide="prev">
                                                                                                    <span>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                                                                                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                    <span className="visually-hidden">Previous</span>
                                                                                                </button>
                                                                                                <button className="carousel-control-next position-absolute right-0 pe-2" type="button" data-bs-target={`carousel${orderItem?._id}ModalDetailImages`} data-bs-slide="next">
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
                                                                                        <h5>{ ((orderItem?.product?.title)?.length > 20) ? ((orderItem?.product?.title)?.slice(0,20) + ' ...') : orderItem?.product?.title }</h5>
                                                                                        <div className=""><small className="quantity">{ orderItem?.quantity }</small>&nbsp;x&nbsp;<span className="cost fw-semibold">${ (orderItem?.product?.retail_price) }</span></div>
                                                                                    </div>
                                                                                </div> 
                                                                            </li>
                                                                        )
                                                                    })) } 
                                                                </ol> 
                                                            </section>
                                                        </div>
                                                        <div className="modal-footer">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> 
                                    )
                                })) : (
                                        <div className="box-shadow-1 border-radius-25 py-5 px-4 text-center">
                                            <span>User has made no deliveries yet.</span>
                                        </div>
                                    )
                                } 
                            </ul>

                            <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let firstPage = 1
                                        setOrderQuery(prevState => ({
                                            ...prevState, 
                                            page: firstPage
                                        })); 
                                        await getOrders(); 
                                    } }>
                                        <First /> 
                                </span> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let previousPage = ((orders?.meta?.current_page >= 1) ? (orders?.meta?.current_page - 1) : 1)
                                        setOrderQuery(prevState => ({
                                            ...prevState, 
                                            page: previousPage
                                        })); 
                                        await getOrders(); 
                                    } }>
                                        <Previous /> 
                                </span> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let nextPage = ((orders?.meta?.current_page < orders?.meta?.total_pages) ? (orders?.meta?.current_page + 1) : orders?.meta?.total_pages)
                                        setOrderQuery(prevState => ({
                                            ...prevState, 
                                            page: nextPage
                                        })); 
                                        await getOrders(); 
                                    } }>
                                    <Next /> 
                                </span> 
                                <span 
                                    type="button" 
                                    onClick={ async () => { 
                                        scrollToTop(); 
                                        let lastPage = orders?.meta?.total_pages
                                        setOrderQuery(prevState => ({
                                            ...prevState, 
                                            page: lastPage
                                        })); 
                                        await getOrders(); 
                                    } }>
                                        <Last />
                                </span>
                            </section>
                        </section>
                    </div>
                    <div className="tab-pane fade" id="purchases-tab-pane" role="tabpanel" aria-labelledby="purchases-tab" tabIndex="0">
                        <section>
                            <div className="text-end pb-4">
                                <span>1 - 10 of 500 (page 1 of 20)</span>
                            </div> 
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                { (purchases?.data?.length > 0) ? (purchases?.data?.map(purchase => {
                                    return (
                                        <li key={ purchase?._id } className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                            This is the purchases tab.
                                        </li>
                                    )
                                })) : (
                                        <div className="box-shadow-1 border-radius-25 py-5 px-4 text-center">
                                            <span>User has made no purchases yet.</span>
                                        </div>
                                    )
                                } 
                            </ul>
                        </section>
                    </div>
                </div>
            </section>
        </section>
    )
}
