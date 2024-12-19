import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import { useUsers } from '@/hooks/useUsers.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
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
    /** End of Voice-to-Text search functionality */ 

    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        role: 'individual', 
        page: 1, 
        limit: 10, 
    }); 
    const { users, getUsers } = useUsers(userQuery); 
    // console.log(users); 

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4 d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                        <span>Users</span> 
                        <div className="fs-6 d-flex align-items-center gap-2 flex-wrap">
                            <span 
                                type="button" 
                                onClick={ async () => {
                                    await setUserQuery(prevState => ({
                                        ...prevState,
                                        role: 'all', 
                                        page: 1
                                    })); 
                                    await getUsers(userQuery?.role); 
                                } }
                                className={`btn btn-sm ${(userQuery?.role == 'all') ? 'btn-secondary' : 'btn-dark'} border-radius-35 py-0 fw-semibold`}>
                                    All
                            </span>
                            <span 
                                type="button" 
                                onClick={ async () => {
                                    await setUserQuery(prevState => ({
                                        ...prevState,
                                        role: 'admin', 
                                        page: 1
                                    })); 
                                    await getUsers(userQuery?.role); 
                                } }
                                className={`btn btn-sm ${(userQuery?.role == 'admin') ? 'btn-secondary' : 'btn-dark'} border-radius-35 py-0 fw-semibold`}>
                                    Admins
                            </span>
                            <span 
                                type="button" 
                                onClick={ async () => {
                                    await setUserQuery(prevState => ({
                                        ...prevState,
                                        role: 'dispatcher', 
                                        page: 1
                                    })); 
                                    await getUsers(userQuery?.role);
                                } }
                                className={`btn btn-sm ${(userQuery?.role == 'dispatcher') ? 'btn-secondary' : 'btn-dark'} border-radius-35 py-0 fw-semibold`}>
                                    Dispatchers
                            </span>
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    await setUserQuery(prevState => ({
                                        ...prevState,
                                        role: 'individual', 
                                        page: 1
                                    })); 
                                    await getUsers(userQuery?.role);
                                } }
                                className={`btn btn-sm ${(userQuery?.role == 'individual') ? 'btn-secondary' : 'btn-dark'} border-radius-35 py-0 fw-semibold`}>
                                    Individuals
                            </span>
                            <span 
                                type="button" 
                                onClick={ async () => { 
                                    await setUserQuery(prevState => ({
                                            ...prevState,
                                            role: 'enterprise', 
                                            page: 1
                                        })); 
                                    await getUsers(userQuery?.role);
                                } }
                                className={`btn btn-sm ${(userQuery?.role == 'enterprise') ? 'btn-secondary' : 'btn-dark'} border-radius-35 py-0 fw-semibold`}>
                                    Enterprises
                            </span>
                        </div>
                    </h2> 

                    <div className="d-flex justify-content-between flex-wrap gap-2"> 
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
                                    placeholder="Search user ..." 
                                    className="" />

                                <span 
                                    type="button" 
                                    onClick={ () => {
                                        setSearchKey(voiceText); 
                                        setIsListening(false); 
                                        // console.log('search', searchKey);
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
                            { (users?.data?.length > 0) 
                                && <PaginationMeter 
                                        current_page={ users?.meta?.current_page } 
                                        limit={ users?.meta?.limit } 
                                        total_pages={ users?.meta?.total_pages } 
                                        total_results={ users?.meta?.total_results } /> } 
                        </span>
                    </div>

                    <section className="pt-5 pb-3"> 
                        { ((users?.data?.length > 0)) ?
                            <ul className="list-unstyled d-flex flex-column gap-3">
                                { (users?.data?.length > 0) && users?.data?.map((user, index) => {
                                    return ( 
                                        <li key={ user?._id } className="card border-radius-25 box-shadow-1 mb-3 p-3">
                                            <div className="d-flex justify-content-end align-items-center gap-3 px-3 pb-3"> 
                                                <span className="btn btn-sm btn-dark border-radius-35 py-0">
                                                    <Link to={ route('home.users.show', { username: user?.username })} 
                                                        className="text-decoration-none text-white fw-semibold">
                                                            View User
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
                                                            <Link to={ route('home.users.edit', { username: user?.username }) } className="dropdown-item d-flex align-items-center gap-1">
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
                                                                        deleteBrand(user?.username); 
                                                                        getUsers();
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
                                                to={ route('home.users.show', { username: user?.username }) } 
                                                className="text-decoration-none text-dark">
                                                    <div className="row g-0"> 
                                                        <div className="col-md-8">
                                                            <div className="card-body">
                                                                <h5 className="card-title text-break" style={{ textTransform: 'capitalize' }}>{ user?.first_name + ' ' + user?.last_name }</h5>
                                                                <p className="card-text text-break my-0">@{ user?.username }</p> 
                                                                <p className="card-text text-break my-0">{ user?.email }</p> 
                                                                <p className="card-text text-break text-secondary my-0"><small>joined&nbsp;{ dayjs.utc(user?.created_at).fromNow() }</small></p> 
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            { user?.user_image_path?.url 
                                                                ?   <span className="w-100 d-flex justify-content-end">
                                                                        <img 
                                                                            src={ user?.user_image_path?.url } 
                                                                            className="object-fit-cover border-radius-15" 
                                                                            style={{ width: '150px', height: '150px' }} 
                                                                            alt={ user?.name } /> 
                                                                    </span>
                                                                :   <span className="w-100 d-flex justify-content-end">
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
                                    <span className="py-4" style={{ flexGrow: '1' }}>There are no users yet.</span>
                                </div>
                            )}
                    </section>
                </div>

                { ((users?.data?.length > 0)) && 
                    <section className="pagination-links py-5 d-flex justify-content-end gap-2 pe-2"> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let firstPage = 1
                                setUserQuery(prevState => ({
                                    ...prevState, 
                                    // role: userQuery?.role, 
                                    page: firstPage
                                })); 
                                await getUsers(); 
                            } }>
                                <First /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let previousPage = ((users?.meta?.current_page >= 1) ? (users?.meta?.current_page - 1) : 1)
                                setUserQuery(prevState => ({
                                    ...prevState, 
                                    // role: userQuery?.role, 
                                    page: previousPage
                                })); 
                                await getUsers(); 
                            } }>
                                <Previous /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let nextPage = ((users?.meta?.current_page < users?.meta?.total_pages) ? (users?.meta?.current_page + 1) : users?.meta?.total_pages)
                                setUserQuery(prevState => ({
                                    ...prevState, 
                                    // role: userQuery?.role, 
                                    page: nextPage
                                })); 
                                await getUsers(); 
                                // console.log('user page', userQuery?.page)
                            } }>
                            <Next /> 
                        </span> 
                        <span 
                            type="button" 
                            onClick={ async () => { 
                                scrollToTop(); 
                                let lastPage = users?.meta?.total_pages
                                setUserQuery(prevState => ({
                                    ...prevState, 
                                    // role: userQuery?.role, 
                                    page: lastPage
                                })); 
                                await getUsers(); 
                            } }>
                                <Last />
                        </span>
                    </section> 
                }
            </div>
        </Layout>
    )
}

