import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useBrand } from '@/hooks/useBrand.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() { 
    const params = useParams(); 
    const { brand, updateBrand } = useBrand(params?.id); 
    // console.log(brand); 

    /** Handle image file */ 
    const [image, setImage] = useState(null);

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    }; 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result); 
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }; 
    /** End of Handle image file */

    /** Update Brand */
    async function submitBrand(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        formData.append('name', brand?.data?.name); 
        brand?.data?.description && formData.append('description', brand?.data?.description); 
        (image) && formData.append('logo_path', brand?.data?.logo_path); 
        brand?.data?.web_address && formData.append('web_address', brand?.data?.web_address); 
        brand?.data?.facebook && formData.append('facebook', brand?.data?.facebook); 
        brand?.data?.instagram && formData.append('instagram', brand?.data?.instagram); 
        brand?.data?.twitter_x && formData.append('twitter_x', brand?.data?.twitter_x); 
        brand?.data?.other_social && formData.append('other_social', brand?.data?.other_social); 
        brand?.data?.other_social_handle && formData.append('other_social_handle', brand?.data?.other_social_handle); 

        await updateBrand(formData); 
    }; 
    /** End of Update Brand */

    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3"> 
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.brands.index') } className="text-dark">
                            Brands
                        </Link>&nbsp;
                        | Edit</h2> 

                    <section className="py-4">
                        <form onSubmit={ submitBrand } encType="multipart/form-data" id="create-edit-form" className="create-edit-form"> 
                            <div className="fields"> 
                                <div className="name row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">Name</span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.name ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        name: e.target.value,
                                                    }) }
                                                    placeholder='e.g. Versace' 
                                                    id="name" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Name" 
                                                    aria-describedby="brand name" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Name.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="description row g-2">
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-radius-35 fw-semibold">Description</span>
                                            <textarea 
                                                value={ brand?.data?.description ?? '' } 
                                                onChange={ e => brand.setData({
                                                    ...brand?.data,
                                                    description: e.target.value,
                                                }) }
                                                placeholder='e.g. An Italian brand by Donatella Versace.' 
                                                id="description" 
                                                className="form-control border-radius-35" 
                                                aria-label="Brand Description" 
                                                aria-describedby="brand description"></textarea>
                                        </div> 
                                        <div className="form-text px-3" id="desription-1"><small>Brand Description.</small></div>
                                    </div>
                                </div> 
                                <div className="logo row g-2 ">
                                    <div className="mb-3 position-relative"> 
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="image-upload-input"
                                            style={{ display: 'none' }} 
                                            onChange={ (e) => { brand.setData({
                                                                    ...brand?.data,
                                                                    logo_path: e.target.files[0], 
                                                                });
                                                                handleImageChange(e)} }
                                        />

                                        <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                            { (image || brand?.data?.logo_path?.url) ? (
                                                <img src={image || brand?.data?.logo_path?.url} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                        {/* {brand?.data?.logo_path?.url && (
                                            <span 
                                            onClick={handleRemoveImage} 
                                            className="bg-transparent border-0"
                                            style={{
                                                position: 'absolute', 
                                                top: '0', 
                                                left: '205px', 
                                                cursor: 'pointer',
                                            }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                            </span>
                                        )} */}
                                    </div> 
                                </div> 
                                <div className="web row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe2" viewBox="0 0 16 16">
                                                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933 9 9 0 0 1-.481-1.079 8.4 8.4 0 0 0-1.198.49 7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521 8.4 8.4 0 0 0-1.197-.49 9 9 0 0 1-.481 1.078 7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49 7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/>
                                                    </svg>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.web_address ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        web_address: e.target.value,
                                                    }) }
                                                    placeholder='e.g. www.versace.com' 
                                                    id="web_address" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Web Address" 
                                                    aria-describedby="Brand web address" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Web Address.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="facebook row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                                    </svg>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.facebook ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        facebook: e.target.value,
                                                    }) }
                                                    placeholder='e.g. versace' 
                                                    id="facebook" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Facebook" 
                                                    aria-describedby="Brand facebook" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Facebook.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="instagram row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                                    </svg>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.instagram ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        instagram: e.target.value,
                                                    }) }
                                                    placeholder='e.g. versace' 
                                                    id="instagram" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Instagram" 
                                                    aria-describedby="Brand instagram" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Instagram.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="twitter-x row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                                    </svg>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.twitter_x ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        twitter_x: e.target.value,
                                                    }) }
                                                    placeholder='e.g. versace' 
                                                    id="twitter_x" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Twitter_X" 
                                                    aria-describedby="Brand twitter_x" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand X.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="other-social row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    Other Social
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.other_social ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        other_social: e.target.value,
                                                    }) }
                                                    placeholder='e.g. Truth Social' 
                                                    id="other_social" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Other Social" 
                                                    aria-describedby="Brand other social" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Other Social (Name of the social app).</small></div>
                                        </div>
                                    </div> 
                                </div> 
                                <div className="other-social-handle row g-2">
                                    <div className="col-md">
                                        <div className="mb-3"> 
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">
                                                    Other Social Handle
                                                </span>
                                                <input 
                                                    type="text" 
                                                    value={ brand?.data?.other_social_handle ?? '' } 
                                                    onChange={ e => brand.setData({
                                                        ...brand?.data,
                                                        other_social_handle: e.target.value,
                                                    }) }
                                                    placeholder='e.g. versace' 
                                                    id="other_social_handle" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Brand Other Social Handle" 
                                                    aria-describedby="Brand other social handle" />
                                            </div>
                                            <div className="form-text px-3" id="basic-addon4"><small>Brand Other Social.</small></div>
                                        </div>
                                    </div> 
                                </div> 
                            </div>
                            <div className="pt-3 d-flex justify-content-end">
                                <button type="submit" className={`btn btn-dark px-3 border-radius-35 ${brand?.loading == true && `disabled`}`}>
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
            </div>
        </Layout>
    )
}