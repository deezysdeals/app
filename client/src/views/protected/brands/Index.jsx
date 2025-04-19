import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useBrands } from '@/hooks/useBrands.jsx'; 
import { useBrand } from '@/hooks/useBrand.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/PaginationLinks.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
    /** Voice-to-Text Search funtionality */ 
    const [searchKey, setSearchKey] = useState(''); 

    useEffect(() => {
        setBrandQuery(prev => ({
            ...prev,
            search: searchKey,
        }));
    }, [searchKey]);

    const { handleStartListening, 
            // handleStopListening, 
            voiceText, 
            setVoiceText,
            isListening, 
            setIsListening } = useVoiceToText();
    /** End of Voice-to-Text search functionality */ 

    const [brandQuery, setBrandQuery] = useState({ 
        page: 1, 
        limit: 10, 
        search: searchKey
    }); 
    const { brands, getBrands } = useBrands(brandQuery); 
    // console.log(brands);
    const { deleteBrand } = useBrand(); 
    // console.log(brands); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <section className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                        <h2 className="fs-4">Brands</h2> 

                        <div className="">
                            <Link to={ route('home.brands.create') } className="btn btn-sm btn-dark px-3 border-radius-35">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </Link>
                        </div>
                    </section>

                    <section className="d-flex justify-content-between flex-wrap gap-2"> 
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
                                    placeholder="Search brand ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ async () => {
                                        setSearchKey(voiceText); 
                                        scrollToTop(); 
                                        // await getBrands(1); 
                                        let firstPage = 1
                                        setBrandQuery(prevState => ({
                                            ...prevState, 
                                            page: firstPage, 
                                            search: searchKey
                                        })); 
                                        await getBrands(brandQuery); 
                                        setIsListening(false); 
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
                        { (brands?.data?.length > 0) 
                            && <PaginationMeter 
                                    current_page={ brands?.meta?.current_page } 
                                    limit={ brands?.meta?.limit } 
                                    total_pages={ brands?.meta?.total_pages } 
                                    total_results={ brands?.meta?.total_results } /> } 
                    </section>

                    <section className="pt-5 pb-3"> 
                        { ((brands?.data?.length > 0)) ?
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                { (brands?.data?.length > 0) && brands?.data?.map((brandItem, index) => {
                                    return ( 
                                        <li key={ brandItem?._id } className="card border-radius-25 box-shadow-1 mb-3 p-3">
                                            <div className="d-flex justify-content-end align-items-center gap-3 px-3 pb-3"> 
                                                <span className="btn btn-sm btn-dark border-radius-35 py-0">
                                                    <Link to={ route('home.brands.show', { id: brandItem?._id })} 
                                                        className="text-decoration-none text-white fw-semibold">
                                                            View
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
                                                            <Link to={ route('home.brands.edit', { id: brandItem?._id }) } className="dropdown-item d-flex align-items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-vector-pen" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                                                    <path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                                                                </svg>
                                                                <span className="fw-semibold">Update</span>
                                                            </Link>
                                                        </li> 
                                                        <li 
                                                            onClick={ () => {
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
                                                                        deleteBrand(brandItem?._id); 
                                                                        getBrands();
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
                                                to={ route('home.brands.show', { id: brandItem?._id }) } 
                                                className="text-decoration-none text-dark">
                                                    <div className="row g-0"> 
                                                        <div className="col-md-8">
                                                            <div className="card-body">
                                                                <h5 className="card-title" style={{ textTransform: 'capitalize' }}>{ brandItem?.name }</h5>
                                                                <p className="card-text">{ brandItem?.description }</p> 
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            { brandItem?.logo_path?.url 
                                                                ?   <img 
                                                                        src={ brandItem?.logo_path?.url } 
                                                                        className="img-fluid object-fit-cover border-radius-15" 
                                                                        style={{ width: '100%', height: '100%', maxWidth: '250px', maxHeight: '250px' }} 
                                                                        alt={ brandItem?.name } /> 
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
                                })}
                            </ul>
                            : (
                                <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no brands yet.</span>
                                </div>
                            )}
                    </section>
                </div> 

                { (brands?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ brands } 
                            getItems={ getBrands } 
                            query={ brandQuery } 
                            setQuery={ setBrandQuery } /> }
            </div>
        </Layout>
    )
}
