import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useSiteConfiguration } from '@/hooks/useSiteConfiguration.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() { 
    const { siteConfiguration, updateSiteConfiguration, getSiteConfiguration } = useSiteConfiguration(); 
    console.log(siteConfiguration); 

    /** Handle image file input*/ 
    // const [heroImage, setHeroImage] = useState(null);
    // const [footerImage, setFooterImage] = useState(null); 
    const [images, setImages] = useState({});

    // Handle image click (trigger file input click)
    const handleImageClick = (index) => {
        document.getElementById(`image-upload-input-${index}`).click(); 
    };

    // Handle image file input change
    const handleImageChange = (index, e) => {
        const file = e.target.files[0]; 

        if (file) {
            const reader = new FileReader();
            // reader.onload = () => {
            reader.onloadend = () => {
                // Dynamically create the key using the index and update the images state
                let newIndex = `image${index}`;
                setImages(prevImages => ({
                    ...prevImages,
                    [newIndex]: reader.result, 
                })); 
            };
            reader.readAsDataURL(file);
        }
    }; 

    const handleRemoveImage = (index) => {
        let newIndex = `image${index}`;
        setImages(prevImages => ({
            ...prevImages,
            [newIndex]: null 
        })); 
    }; 
    /** End of Handle image file input*/ 

    async function submitSiteConfiguration(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        // formData.append('homepage_product_review_hero', siteConfiguration?.data?.homepage_product_review_hero); 
        siteConfiguration?.data?.homepage_hero_text_1_heading 
            && formData.append('homepage_hero_text_1_heading', siteConfiguration?.data?.homepage_hero_text_1_heading); 
        siteConfiguration?.data?.homepage_hero_text_1_content 
            && formData.append('homepage_hero_text_1_content', siteConfiguration?.data?.homepage_hero_text_1_content); 
        siteConfiguration?.data?.homepage_hero_text_2_heading 
            && formData.append('homepage_hero_text_2_heading', siteConfiguration?.data?.homepage_hero_text_2_heading); 
        siteConfiguration?.data?.homepage_hero_text_2_content 
            && formData.append('homepage_hero_text_2_content', siteConfiguration?.data?.homepage_hero_text_2_content); 
        siteConfiguration?.data?.homepage_hero_image_path 
            && formData.append('homepage_hero_image_path', siteConfiguration?.data?.homepage_hero_image_path); 
        // formData.append('homepage_product_review_footer_1', siteConfiguration?.data?.homepage_product_review_footer_1); 
        // formData.append('homepage_product_review_footer_2', siteConfiguration?.data?.homepage_product_review_footer_2); 
        // formData.append('homepage_product_review_footer_3', siteConfiguration?.data?.homepage_product_review_footer_3); 
        siteConfiguration?.data?.homepage_footer_image_path 
            && formData.append('homepage_footer_image_path', siteConfiguration?.data?.homepage_footer_image_path); 

        await updateSiteConfiguration(formData); 
    }

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">Site Updates</h2> 

                    <div className="py-3"> 
                        <section className="pb-3">
                            <h3 className="border-bottom pb-1 fs-5">1. Main Home Page</h3> 

                            <div className='py-3'>
                                <section className="main-home-hero">
                                    <h4 className="border-bottom pb-1 fs-6">a. Hero Image</h4>
                                    <form 
                                        onSubmit={ submitSiteConfiguration } 
                                        encType='multipart/form-data' 
                                        className="d-flex align-items-end gap-3 py-2">
                                            <div className="logo row g-2 ">
                                                <div className="mb-3 position-relative"> 
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`image-upload-input-${0}`}
                                                        style={{ display: 'none' }} 
                                                        onChange={ (e) => { siteConfiguration.setData({
                                                                                ...siteConfiguration?.data,
                                                                                homepage_hero_image_path: e.target.files[0], 
                                                                            });
                                                                            handleImageChange(0, e)} }
                                                    />

                                                    <div 
                                                        onClick={() => handleImageClick(0)} 
                                                        className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0' }}>
                                                        { images?.['image0'] ? (
                                                            <img src={images?.['image0']} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                                    {images?.['image0'] && (
                                                        <span 
                                                        onClick={() => handleRemoveImage(0)} 
                                                        className="bg-transparent border-0"
                                                        style={{
                                                            position: 'absolute', 
                                                            top: '0', 
                                                            left: '105px', 
                                                            cursor: 'pointer',
                                                        }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div> 
                                            </div> 


                                            {/* <span>
                                                <img src="https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?q=80&amp;w=1018&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="object-fit-cover border border-secondary border-2 border-radius-35 box-shadow-1" style={{ width: '300px', height: '150px' }} alt="" />
                                            </span>  */}
                                            <button type="submit" className="btn btn-dark border-radius-35 py-0 mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                            </button>
                                    </form>
                                </section> 

                                <section className="main-home-hero pt-3">
                                    <h4 className="border-bottom pb-1 fs-6">b. Footer Image</h4>
                                    {/* <div className="d-flex align-items-end gap-3 py-2">
                                        <span>
                                            <img src="https://images.unsplash.com/photo-1593351799227-75df2026356b?q=80&w=1390&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="object-fit-cover border border-secondary border-2 border-radius-35 box-shadow-1" style={{ width: '300px', height: '150px' }} alt="" />
                                        </span> 
                                        <span className="btn btn-dark border-radius-35 py-0 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                            </svg>
                                        </span>
                                    </div> */}
                                    <form 
                                        onSubmit={ submitSiteConfiguration } 
                                        encType='multipart/form-data' 
                                        className="d-flex align-items-end gap-3 py-2">
                                            <div className="logo row g-2 ">
                                                <div className="mb-3 position-relative"> 
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`image-upload-input-${1}`}
                                                        style={{ display: 'none' }} 
                                                        onChange={ (e) => { siteConfiguration.setData({
                                                                                ...siteConfiguration?.data,
                                                                                homepage_footer_image_path: e.target.files[0], 
                                                                            });
                                                                            handleImageChange(1, e)} }
                                                    />

                                                    <div 
                                                        onClick={() => handleImageClick(1)} 
                                                        className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0' }}>
                                                        { images?.['image1'] ? (
                                                            <img src={images?.['image1']} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                                    {images?.['image1'] && (
                                                        <span 
                                                        onClick={() => handleRemoveImage(1)} 
                                                        className="bg-transparent border-0"
                                                        style={{
                                                            position: 'absolute', 
                                                            top: '0', 
                                                            left: '105px', 
                                                            cursor: 'pointer',
                                                        }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div> 
                                            </div> 


                                            {/* <span>
                                                <img src="https://plus.unsplash.com/premium_photo-1682435561654-20d84cef00eb?q=80&amp;w=1018&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="object-fit-cover border border-secondary border-2 border-radius-35 box-shadow-1" style={{ width: '300px', height: '150px' }} alt="" />
                                            </span>  */}
                                            <button type="submit" className="btn btn-dark border-radius-35 py-0 mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                                                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
                                                </svg>
                                            </button>
                                    </form>
                                </section> 

                                <section className="main-home-hero pt-3">
                                    <h4 className="border-bottom pb-1 fs-6">c. Hero Texts</h4> 
                                    
                                    <div className="px-3"> 
                                        <h5 className='border-bottom fs-6'><small>Current Texts:</small></h5>
                                        <ol className="d-flex flex-column">
                                            <li>
                                                <h6>{ siteConfiguration?.data?.homepage_hero_text_1_heading }</h6> 
                                                <p>{ siteConfiguration?.data?.homepage_hero_text_1_content }</p>
                                            </li>
                                            <li>
                                                <h6>{ siteConfiguration?.data?.homepage_hero_text_2_heading }</h6> 
                                                <p>{ siteConfiguration?.data?.homepage_hero_text_2_content }</p>
                                            </li>
                                        </ol>
                                    </div>
                                    
                                    <form 
                                        onSubmit={ submitSiteConfiguration } 
                                        className="create-edit-form">
                                            <section className="group-fields mt-3">
                                                <div className="d-flex flex-column gap-1 border-bottom pb-2 my-3">
                                                    <label htmlFor="features" className="form-label fw-semibold fs-6">Homepage Hero 1</label> 
                                                    <div className="row g-2">
                                                        <div className="col-sm-12 col-md-6">
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <span className="input-group-text border-radius-35 fw-semibold">Heading</span>
                                                                    <input 
                                                                        type="text" 
                                                                        value={ siteConfiguration?.data?.homepage_hero_text_1_heading ?? '' } 
                                                                        onChange={ e => siteConfiguration.setData({
                                                                            ...siteConfiguration?.data,
                                                                            homepage_hero_text_1_heading: e.target.value,
                                                                        }) }
                                                                        placeholder="e.g. It's Christmas!" 
                                                                        id="homepage_hero_text_1_heading" 
                                                                        className="form-control border-radius-35" 
                                                                        aria-label="Site Configuration Homepage Hero Text 1 Heading" 
                                                                        aria-describedby="site configuration homepage hero text 1 heading" />
                                                                </div>
                                                                <div className="form-text px-3"><small>Maximum of 25 letters.</small></div>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                    <div className="row g-2">
                                                        <div className="col-sm-12 col-md-9">
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <span className="input-group-text border-radius-35 fw-semibold">Content</span>
                                                                    <input 
                                                                        type="text" 
                                                                        value={ siteConfiguration?.data?.homepage_hero_text_1_content ?? '' } 
                                                                        onChange={ e => siteConfiguration.setData({
                                                                            ...siteConfiguration?.data,
                                                                            homepage_hero_text_1_content: e.target.value,
                                                                        }) }
                                                                        placeholder="e.g. Get 25% off on your favorite high-quality products." 
                                                                        id="homepage_hero_text_1_content" 
                                                                        className="form-control border-radius-35" 
                                                                        aria-label="Site Configuration Homepage Hero Text 1 Content" 
                                                                        aria-describedby="site configuration homepage hero text 1 content" />
                                                                </div>
                                                                <div className="form-text px-3"><small>Maximum of 55 letters.</small></div>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 

                                                <div className="d-flex flex-column gap-1 border-bottom pb-2 my-3">
                                                    <label htmlFor="features" className="form-label fw-semibold fs-6">Homepage Hero 2</label> 
                                                    <div className="row g-2">
                                                        <div className="col-sm-12 col-md-6">
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <span className="input-group-text border-radius-35 fw-semibold">Heading</span>
                                                                    <input 
                                                                        type="text" 
                                                                        value={ siteConfiguration?.data?.homepage_hero_text_2_heading ?? '' } 
                                                                        onChange={ e => siteConfiguration.setData({
                                                                            ...siteConfiguration?.data,
                                                                            homepage_hero_text_2_heading: e.target.value,
                                                                        }) }
                                                                        placeholder="e.g. It's Christmas!" 
                                                                        id="homepage_hero_text_2_heading" 
                                                                        className="form-control border-radius-35" 
                                                                        aria-label="Site Configuration Homepage Hero Text 2 Heading" 
                                                                        aria-describedby="site configuration homepage hero text 2 heading" />
                                                                </div>
                                                                <div className="form-text px-3"><small>Maximum of 25 letters.</small></div>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                    <div className="row g-2">
                                                        <div className="col-sm-12 col-md-9">
                                                            <div className="mb-3">
                                                                <div className="input-group">
                                                                    <span className="input-group-text border-radius-35 fw-semibold">Content</span>
                                                                    <input 
                                                                        type="text" 
                                                                        value={ siteConfiguration?.data?.homepage_hero_text_2_content ?? '' } 
                                                                        onChange={ e => siteConfiguration.setData({
                                                                            ...siteConfiguration?.data,
                                                                            homepage_hero_text_2_content: e.target.value,
                                                                        }) }
                                                                        placeholder="e.g. Get 25% off on your favorite high-quality products." 
                                                                        id="homepage_hero_text_2_content" 
                                                                        className="form-control border-radius-35" 
                                                                        aria-label="Site Configuration Homepage Hero Text 2 Content" 
                                                                        aria-describedby="site configuration homepage hero text 2 content" />
                                                                </div>
                                                                <div className="form-text px-3"><small>Maximum of 55 letters.</small></div>
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                            </section>

                                            <div className="pt-3 d-flex justify-content-end">
                                                <button type="submit" className="btn btn-dark px-3 border-radius-35">
                                                    <span>Update</span>&nbsp;
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle"
                                                            viewBox="0 0 16 16">
                                                            <path fillRule="evenodd"
                                                                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div> 
                                    </form>


                                </section> 
                            </div>
                        </section>
                    </div>
                </div> 
            </div>
        </Layout>
    )
}
