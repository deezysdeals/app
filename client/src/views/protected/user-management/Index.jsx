import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useUsers } from '@/hooks/useUsers.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import First from '@/components/protected/nested-components/pagination-links/First.jsx'; 
import Previous from '@/components/protected/nested-components/pagination-links/Previous.jsx'; 
import Next from '@/components/protected/nested-components/pagination-links/Next.jsx'; 
import Last from '@/components/protected/nested-components/pagination-links/Last.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
// import { voiceText, setVoiceText, isListening, handleStartListening } from '@/utils/VoiceToText.jsx';
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 


export default function Index() { 
    // Voice-to-Text Search funtionality
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
    // End of Voice-to-Text search functionality

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
                                className={`btn btn-sm ${(userQuery?.role == '') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
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
                                className={`btn btn-sm ${(userQuery?.role == 'admin') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
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
                                className={`btn btn-sm ${(userQuery?.role == 'dispatcher') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
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
                                className={`btn btn-sm ${(userQuery?.role == 'individual') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
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
                                className={`btn btn-sm ${(userQuery?.role == 'enterprise') ? 'btn-secondary' : 'btn-outline-secondary'} border-radius-35 py-0 fw-semibold`}>
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
                            { ((users?.meta?.current_page) > 1) 
                                ? (((users?.meta?.current_page - 1) * users?.meta?.limit) + 1) 
                                : users?.meta?.current_page }
                                    &nbsp;-&nbsp;
                                { ((users?.meta?.current_page * (users?.meta?.limit)) > users?.meta?.total_results) 
                                    ? (users?.meta?.total_results)
                                        : ((users?.meta?.current_page) != 1) 
                                        ? (users?.meta?.current_page * users?.meta?.limit) 
                                            : ((users?.meta?.current_page + (users?.meta?.limit - 1))) } 
                                    &nbsp;of&nbsp; 
                                { users?.meta?.total_results } 
                                &nbsp;(page { users?.meta?.current_page } of { users?.meta?.total_pages })
                        </span>
                    </div>

                    <section className="py-4">
                        <ul className="list-unstyled d-flex flex-column gap-5">
                            { (users?.data?.length > 0) && (users?.data?.map((user, index) => {
                                return (
                                    <li key={ user?._id } className="box-shadow-1 border-radius-25 py-4 px-2 cursor-pointer">
                                        <div className="text-dark px-3">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                                                <span className="fw-semibold">#
                                                    { (users?.meta?.current_page != 1) 
                                                        ? (((users?.meta?.current_page - 1) * users?.meta?.limit) + (index + 1))
                                                        : users?.meta?.current_page * (index + 1) }
                                                </span>
                                                <Link 
                                                    to={ route('home.users.show', { username: user?.username })}
                                                    className="btn btn-sm btn-secondary border-radius-35 py-0 fw-semibold">
                                                        View User
                                                </Link>
                                            </div> 
                                            <div className="amount-and-client d-flex flex-column gap-2">
                                                <h3 className="fw-semibold">{ user?.first_name + ' ' + user?.last_name }</h3> 
                                                <span className="fw-semibold fs-5">@{ user?.username }</span>
                                                <span className="fw-semibold fs-5"><small>joined: { dayjs.utc(user?.created_at).fromNow() }</small></span>
                                            </div>
                                        </div> 
                                    </li> 
                                )
                            })) }
                        </ul>
                    </section>
                </div>

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
            </div>
        </Layout>
    )
}

