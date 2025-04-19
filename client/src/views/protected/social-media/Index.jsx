import { useEffect, useState } from 'react'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useSocials } from '../../../hooks/social-media/useSocials.jsx';
import { useTwitterX } from '../../../hooks/social-media/useTwitterX.jsx';
import Layout from '@/components/protected/Layout.jsx'; 
import PaginationMeter from '@/components/protected/nested-components/PaginationMeter.jsx'; 
import PaginationLinks from '@/components/protected/nested-components/PaginationLinks.jsx';


export default function Index() {
    const [mediaFields, setMediaFields] = useState({
        field_1: true, 
        field_2: false, 
        field_3: false,
    }); 

    const [media, setMedia] = useState({});

    const handleMediaClick = (index) => {
        document.getElementById(`media-upload-input-${index}`).click(); 
    };

    const handleMediaChange = (index, e) => {
        const file = e.target.files[0]; 

        if (file) {
            const reader = new FileReader();
            // reader.onload = () => {
            reader.onloadend = () => {
                let newIndex = `media${index}`;
                setMedia(prevMedia => ({
                    ...prevMedia,
                    [newIndex]: reader.result, 
                })); 
            };
            reader.readAsDataURL(file);
        }
    }; 

    const handleRemoveMedia = (index) => { 
        let newIndex = `media${index}`;
        // setImages(null); 
        setMedia(prevMedia => ({
            ...prevMedia,
            [newIndex]: '', 
        })); 
    }; 

    const [activeLink, setActiveLink] = useState('twitter-x');

    const [socialQuery, setSocialQuery] = useState({ 
        page: 1, 
        limit: 10, 
        network: activeLink
    }); 

    const { socials, getSocials } = useSocials(socialQuery); 
    console.log(socials)
    const { createTwitterX } = useTwitterX();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const message = formData.get('message');

        console.log(media)
        console.log(media?.media0)
        console.log(media?.['media0'])

        console.log(message);

        if (!message) {
            alert('Please enter a message');
            return;
        }

        if (activeLink == 'twitter-x') {
            const formData = new FormData();
            // formData.append('message', message);
            formData.append('message', e.target.message.value);
            // (media?.['media0']) && formData.append('media_1', media?.['media0']); 
            (media?.['media0']) && formData.append('media_1', e.target.media0.files[0]); 
            // (mediaFields?.field_2 && media?.['media1']) && formData.append('media_2', media?.['media1']); 
            (mediaFields?.field_2 && media?.['media1']) && formData.append('media_2', e.target.media1.files[0]); 
            // (mediaFields?.field_3 && media?.['media2']) && formData.append('media_3', media?.['media2']); 
            (mediaFields?.field_3 && media?.['media2']) && formData.append('media_3', e.target.media2.files[0]); 

            // const media_1 = media?.['media0']

            // await createTwitterX({ message, media_1 });
            await createTwitterX(formData);
        } else if (activeLink == 'tik-tok') {

        } else if (activeLink == 'instagram') {

        } else if (activeLink == 'facebook') {

        };

        e.target.message.value = '';
        // e.target.media0.files[0] = '';
        // e.target.media1.files[0] = '';
        // e.target.media2.files[0] = '';

        await getSocials(socialQuery);
    }

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">Social Media</h2> 

                    <section className="d-flex justify-content-end">
                        <button type="button" className="btn btn-sm btn-dark px-3 border-radius-35" data-bs-toggle="modal" data-bs-target="#allModal">
                            Post on all accounts
                        </button>

                        <div className="modal fade" id="allModal" tabIndex="-1" aria-labelledby="allModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header d-flex align-items-center justify-content-between">
                                        <h3 className="modal-title fs-5" id="allModalLabel">Post on all accounts</h3>
                                        <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <textarea className="form-control" placeholder="Write something ..." id="message" style={{ height: '50px' }}></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="border-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="py-4">
                        <section className="tabs">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'tik-tok') && 'active'}`}
                                        aria-current="page" 
                                        onClick={ () => setActiveLink('tik-tok') }>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-tiktok text-dark" viewBox="0 0 16 16">
                                                    <path
                                                        d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                                                </svg>
                                            </span>&nbsp;
                                            <span>Tik-Tok</span>
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button"
                                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'instagram') && 'active'}`}
                                        onClick={ () => setActiveLink('instagram') }>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-instagram text-dark" viewBox="0 0 16 16">
                                                    <path
                                                        d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                                                </svg>
                                            </span>&nbsp;
                                            <span>Instagram</span>
                                        </span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'facebook') && 'active'}`}
                                        onClick={ () => setActiveLink('facebook') }>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-facebook text-dark" viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                                                </svg>
                                            </span>&nbsp;
                                            <span>Facebook</span>
                                        </span>
                                </li>
                                <li className="nav-item">
                                    <span 
                                        type="button" 
                                        className={`nav-link fw-semibold d-flex align-items-center text-dark ${(activeLink == 'twitter-x') && 'active'}`}
                                        onClick={ () => setActiveLink('twitter-x') }>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-twitter-x text-dark" viewBox="0 0 16 16">
                                                    <path
                                                        d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                                                </svg>
                                            </span>&nbsp;
                                            <span>Twitter-X</span>
                                        </span>
                                </li>
                            </ul>
                        </section>

                        <section className="py-3"> 
                            <section className="d-flex justify-content-end pb-4">
                                <button type="button" className="btn btn-sm btn-dark px-3 border-radius-35" data-bs-toggle="modal" data-bs-target="#exactModal">
                                    Post on&nbsp;{ (activeLink == 'tik-tok') 
                                                ? 'Tik-Tok' 
                                                    : (activeLink == 'instagram') 
                                                    ? 'Instagram' 
                                                        : (activeLink == 'facebook') 
                                                        ? 'Facebook' 
                                                            : (activeLink == 'twitter-x') 
                                                            ? 'Twitter-X' 
                                                                : ''
                                            }
                                </button>

                                <div className="modal fade" id="exactModal" tabIndex="-1" aria-labelledby="exactModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <form onSubmit={ handleSubmit } encType="multipart/form-data" className="modal-content">
                                            <div className="modal-header d-flex align-items-center justify-content-between">
                                                <h4 className="modal-title fs-5" id="exactModalLabel">Post on&nbsp;
                                                    { (activeLink == 'tik-tok') 
                                                        ? 'Tik-Tok' 
                                                            : (activeLink == 'instagram') 
                                                            ? 'Instagram' 
                                                                : (activeLink == 'facebook') 
                                                                ? 'Facebook' 
                                                                    : (activeLink == 'twitter-x') 
                                                                    ? 'Twitter-X' 
                                                                        : ''
                                                    }
                                                </h4>
                                                <button type="button" className="border-0" data-bs-dismiss="modal" aria-label="Close">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <textarea 
                                                    id="message" 
                                                    name="message" 
                                                    className="form-control" 
                                                    placeholder="Write something ..." 
                                                    style={{ height: '50px' }}>
                                                </textarea>

                                                <section className="pt-3">
                                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                                        <label htmlFor="images" className="form-label fw-semibold fs-6">Add images/videos to your post</label> 
                                                        <div className="w-100 d-flex justify-content-end align-items-center flex-wrap gap-2">
                                                            <span 
                                                                onClick={ () => {
                                                                    if (mediaFields?.field_3) {
                                                                        setMediaFields(prevState => ({
                                                                            ...prevState,
                                                                            field_3: false, 
                                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 2))
                                                                        })); 
                                                                    } else if (mediaFields?.field_2) {
                                                                        setMediaFields(prevState => ({
                                                                            ...prevState,
                                                                            field_2: false, 
                                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 1))
                                                                        })); 
                                                                    }
                                                                } }
                                                                className={`btn btn-sm btn-dark py-0 border-left-radius-35 ${mediaFields?.field_2 == false && ` disabled`}`}>
                                                                    Less fields
                                                            </span>
                                                            <span 
                                                                onClick={ () => {
                                                                    if (mediaFields?.field_2 == false) {
                                                                        setMediaFields(prevState => ({
                                                                            ...prevState,
                                                                            field_2: true,
                                                                            ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`field_${i + 3}`, false]))
                                                                        })); 
                                                                    } else if (mediaFields?.field_3 == false) {
                                                                        setMediaFields(prevState => ({
                                                                            ...prevState,
                                                                            field_3: true, field_2: true, 
                                                                            ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`field_${i + 4}`, false]))
                                                                        })); 
                                                                    } 
                                                                } }
                                                                className={`btn btn-sm btn-dark py-0 border-right-radius-35 ${mediaFields?.field_3 && ` disabled`}`}>
                                                                    More fields
                                                            </span>
                                                        </div>
                                                    </div> 
                                                    <div className="d-flex flex-wrap gap-3">
                                                        <div className="mb-3 position-relative"> 
                                                            {/* Hidden file input for image */}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`media-upload-input-${0}`}
                                                                name="media0"
                                                                style={{ display: 'none' }} // Hide the file input
                                                                // onChange={(e) => handleImageChange(0, e)} 
                                                                onChange={ (e) => { handleMediaChange(0, e)} }
                                                            />
                                                            {/* End of Hidden file input for image */}

                                                            {/* Image preview as the clickable element */}
                                                            <div onClick={() => handleMediaClick(0)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                                { media?.['media0'] ? (
                                                                    <img src={media?.['media0']} alt={`Preview ${1}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                        </svg>
                                                                    </span>
                                                                )}
                                                            </div> 

                                                            {/* Remove button */}
                                                            {media?.['media0'] && (
                                                                <span 
                                                                    onClick={() => handleRemoveMedia(0)} 
                                                                    className="bg-transparent border-0"
                                                                    style={{
                                                                        position: 'absolute', 
                                                                        top: '0', 
                                                                        left: '190px', 
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    
                                                    { (mediaFields?.field_2) && 
                                                        <div className="mb-3 position-relative"> 
                                                            {/* Hidden file input for image */}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`media-upload-input-${1}`}
                                                                name="media1"
                                                                style={{ display: 'none' }} // Hide the file input
                                                                onChange={(e) => handleMediaChange(1, e)} 
                                                                // onChange={ (e) => { product.setData({
                                                                //                         ...product?.data,
                                                                //                         image_2: e.target.files[0],
                                                                //                     });
                                                                //                     handleImageChange(1, e)} }
                                                            />
                                                            {/* End of Hidden file input for image */}

                                                            {/* Media preview as the clickable element */}
                                                            <div onClick={() => handleMediaClick(1)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                                { media?.['media1'] ? (
                                                                    <img src={media?.['media1']} alt={`Preview ${2}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                        </svg>
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Remove button */}
                                                            {media?.['media1'] && (
                                                                <span 
                                                                    onClick={() => handleRemoveMedia(1)} 
                                                                    className="bg-transparent border-0"
                                                                    style={{
                                                                        position: 'absolute', 
                                                                        top: '0', 
                                                                        left: '190px', 
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    } 
                                                    { (mediaFields?.field_3) &&
                                                        <div className="mb-3 position-relative"> 
                                                            {/* Hidden file input for media */}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`media-upload-input-${2}`}
                                                                name="media2"
                                                                style={{ display: 'none' }} // Hide the file input
                                                                onChange={(e) => handleMediaChange(2, e)} 
                                                                // onChange={ (e) => { product.setData({
                                                                //                         ...product?.data,
                                                                //                         image_3: e.target.files[0],
                                                                //                     });
                                                                //                     handleImageChange(2, e)} }
                                                            />
                                                            {/* End of Hidden file input for image */}

                                                            {/* Image preview as the clickable element */}
                                                            <div onClick={() => handleMediaClick(2)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                                { media?.['media2'] ? (
                                                                    <img src={media?.['media2']} alt={`Preview ${3}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                        </svg>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Remove button */}
                                                            {media?.['media2'] && (
                                                                <span 
                                                                    onClick={() => handleRemoveMedia(2)} 
                                                                    className="bg-transparent border-0"
                                                                    style={{
                                                                        position: 'absolute', 
                                                                        top: '0', 
                                                                        left: '190px', 
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                    </svg>
                                                                </span>
                                                            )}
                                                        </div>
                                                    } 

                                                    </div>
                                                </section> 


                                            </div>
                                            <div className="modal-footer">
                                                <button type="submit" className="border-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </section>

                            <div className="d-flex justify-content-between flex-wrap pb-4">
                                { (socials?.data?.length > 0) && <span className="border-bottom fw-semibold pb-1">Previous Posts</span> }
                                { (socials?.data?.length > 0) 
                                    && <PaginationMeter 
                                            current_page={ socials?.meta?.current_page } 
                                            limit={ socials?.meta?.limit } 
                                            total_pages={ socials?.meta?.total_pages } 
                                            total_results={ socials?.meta?.total_results } /> } 
                            </div> 

                            { (socials?.data?.length > 0) ? (
                                <ul className="list-unstyled d-flex flex-column gap-3">
                                    { (socials?.data?.map((social, index) => {
                                        return (
                                            <li key={ index } className="box-shadow-1 border-radius-25 py-3 px-4 cursor-pointer">
                                                <p className="fw-semibold">{ social?.message }</p> 
                                                <p className="text-end"><small className="text-secondary">published by&nbsp;</small>{ social?.user?.first_name } { social?.user?.last_name },&nbsp;<small>{ dayjs.utc(social?.created_at).fromNow() }</small></p>
                                            </li>
                                            )
                                    })) }
                                </ul>
                            ) : (
                                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                                    <p className="text-center">No posts available</p>
                                    <p className="text-center">Create your first post!</p>
                                </div>
                            ) }
                        </section>
                    </div> 
                </div> 

                { (socials?.data?.length > 0) 
                    && <PaginationLinks 
                            items={ socials } 
                            getItems={ getSocials } 
                            query={ socialQuery } 
                            setQuery={ setSocialQuery } /> } 
            </div>
        </Layout>
    )
}
