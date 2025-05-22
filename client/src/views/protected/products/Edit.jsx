import { useEffect, useState } from 'react'; 
import { Form, Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useImageHandler from '@/utils/useImageHandler.jsx';
import { useBrands } from '@/hooks/useBrands.jsx'; 
import { useCategories } from '@/hooks/useCategories.jsx'; 
import { useDeals } from '@/hooks/useDeals.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import { useProductImage } from '@/hooks/useProductImage.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() { 
    const { brands, getBrands } = useBrands(); 
    const { categories, getCategories } = useCategories(); 
    const { deals, getDeals } = useDeals(); 
    const params = useParams(); 
    const { product, getProduct, updateProduct } = useProduct(params?.id); 
    console.log(product?.data); 
    console.log(product?.data?.images); 
    // console.log(product?.data?.images?.created_at == '2024-12-08T19:20:48.594Z'); 
    // console.log(product?.data?.images?.find(product => product?.created_at == '2024-12-08T19:20:48.594Z')); 
    const { createProductImage, deleteProductImage } = useProductImage();

    const [newImage, setNewImage] = useState();
    const [imagesArray, setImagesArray] = useState([]); 
    const [imageUrlsArray, setImageUrlsArray] = useState([]); 

    const [infoTitle, setInfoTitle] = useState(); 
    const [infoValue, setInfoValue] = useState(); 
    const [infoArray, setInfoArray] = useState([]); 

    const [newDescription, setNewDescription] = useState(); 
    const [descriptionsArray, setDescriptionsArray] = useState([]); 

    const [newFeature, setNewFeature] = useState(); 
    const [featuresArray, setFeaturesArray] = useState([]); 

    const [newCategory, setNewCategory] = useState(); 
    const [categoriesArray, setCategoriesArray] = useState([]); 

    useEffect(() => {
        console.log('Updated images array:', imagesArray);
        console.log('Updated image URLs array:', imageUrlsArray);
        console.log('Updated info array:', infoArray);
        console.log('Updated description array:', descriptionsArray);
        console.log('Updated category array:', categoriesArray);
    }, [imagesArray, 
        imageUrlsArray, 
        infoTitle, 
        infoValue, 
        infoArray, 
        newDescription, 
        descriptionsArray, 
        newFeature, 
        featuresArray, 
        newCategory, 
        categoriesArray]);

    /** Handle image file input */
    const { image, imageFile, handleImageClick, handleImageChange } = useImageHandler();
    /** End of Handle image file input */

    async function submitProduct(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        formData.append('title', product.data.title); 
        product?.data?.asin && formData.append('asin', product.data.asin); 
        product?.data?.initial_retail_price 
            ? formData.append('initial_retail_price', product.data.initial_retail_price) 
            : formData.append('initial_retail_price', 0); 
        product?.data?.retail_price 
            ? formData.append('retail_price', product.data.retail_price) 
            : formData.append('retail_price', 0); 
        product?.data?.purchase_price 
            ? formData.append('purchase_price', product.data.purchase_price) 
            : formData.append('purchase_price', 0); 
        // product.data.brand && formData.append('brand', product.data.brand); 
        product.data.deal && formData.append('deal', product.data.deal); 

        // if (imagesArray?.length > 0) {
        //     imagesArray.forEach((img, index) => {
        //     if (img.file) {
        //         formData.append('images', img.file);
        //     } else if (img instanceof File) {
        //         formData.append('images', img);
        //     }
        //     });
        // }

        (imagesArray?.length > 0) && imagesArray.forEach(file => formData.append('images', file));
        (infoArray?.length > 0) && formData.append('info', JSON.stringify(infoArray));
        (descriptionsArray?.length > 0) && formData.append('descriptions', JSON.stringify(descriptionsArray));
        (featuresArray?.length > 0) && formData.append('features', JSON.stringify(featuresArray));
        (categoriesArray?.length > 0) && formData.append('categories', JSON.stringify(categoriesArray));

        await updateProduct(formData); 
    }
    
    return (
        <Layout>
            <div className="main">
                <div className="dashboard-content pt-3">
                    <h2 className="border-bottom pb-1 fs-4">
                        <Link to={ route('home.products.index') } className="text-dark">
                            Products
                        </Link>&nbsp;
                        | Edit</h2> 

                    <section className="py-4">
                        <form onSubmit={ submitProduct } encType="multipart/form-data" id="create-edit-form" className="create-edit-form"> 
                            <div className="fields"> 
                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="mb-3">
                                            {/* <label htmlFor="basic-url" className="form-label">Title of Product</label> */}
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold form-field-required">Title</span>
                                                <input 
                                                    type="text" 
                                                    value={ product?.data?.title ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        title: event.target.value,
                                                    }) }
                                                    placeholder="e.g. Nike Pro 5 Shoe" 
                                                    id="title" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product Title" 
                                                    aria-describedby="product title" 
                                                    required />
                                            </div>
                                            <div className="form-text px-3"><small>The name of your product.</small></div>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div className="mb-3">
                                            {/* <label htmlFor="basic-url" className="form-label">Title of Product</label> */}
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">ASIN</span>
                                                <input 
                                                    type="text" 
                                                    value={ product?.data?.asin ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        asin: event.target.value,
                                                    }) }
                                                    placeholder="e.g. B06Y1YD5W7" 
                                                    id="asin" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product ASIN" 
                                                    aria-describedby="product asin" />
                                            </div>
                                            <div className="form-text px-3"><small>The Amazon Standard Identification Number. Leave vacant if you do not have it.</small></div>
                                        </div>
                                    </div>
                                </div> 
                                
                                <section className="pricing">
                                    <div className="row g-2">
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold">Old Retail Price</span>
                                                    <input 
                                                        type="number" 
                                                        value={ product?.data?.initial_retail_price ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            initial_retail_price: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 12000" 
                                                        id="initial_retail_price" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Initial_retail_price" 
                                                        aria-describedby="product initial_retail_price"  />
                                                </div>
                                                <div className="form-text px-3"><small>The previous retail price (in USD) of your product (if available).</small></div>
                                            </div>
                                        </div>
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold form-field-required">Retail Price</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.retail_price ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            retail_price: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 12000" 
                                                        id="retail_price" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product retail_price" 
                                                        aria-describedby="product retail_price" 
                                                        required />
                                                </div>
                                                <div className="form-text px-3"><small>The current retail price (in USD) of your product.</small></div>
                                            </div>
                                        </div>
                                    </div> 
                                
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold">Purchase Price</span>
                                                    <input 
                                                        type="number" 
                                                        value={ product?.data?.purchase_price ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            purchase_price: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 12000" 
                                                        id="purchase_price" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product purchase_price" 
                                                        aria-describedby="product purchase_price" />
                                                </div>
                                                <div className="form-text px-3"><small>The price (USD) product was bought at.</small></div>
                                            </div>
                                        </div>
                                    </div> 
                                </section> 

                                <div className="row g-2">
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold">Brand</span>
                                                {/* <select 
                                                    value={ product?.data?.brand?.name ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        brand: event.target.value,
                                                    })} 
                                                    id="brand" 
                                                    className="form-select border-radius-35">
                                                        <option>Choose brand...</option>
                                                        { (brands?.data?.length > 0) && brands?.data?.map(brand => {
                                                            return (
                                                                <option 
                                                                    key={ brand?._id } 
                                                                    value={ brand?._id } 
                                                                    id="brand" 
                                                                    aria-label="Product Brand" 
                                                                    aria-describedby="product brand">
                                                                        { brand?.name }
                                                                </option>
                                                        )
                                                    })}
                                                </select> */}
                                                <input 
                                                    value={ product?.data?.brand?.name ?? '' } 
                                                    id="brand" 
                                                    className="form-control border-radius-35" 
                                                    disabled />
                                            </div>
                                            <div className="form-text px-3"><small>The brand of your product.</small></div>
                                        </div>
                                    </div>
                                    <div className="col-md">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">Deal</span>
                                                <select 
                                                    value={ product?.data?.deal ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        deal: event.target.value,
                                                    })} 
                                                    className="form-select border-radius-35" 
                                                    id="deal">
                                                        <option>Choose deal...</option>
                                                        { (deals?.data?.length > 0) && deals?.data?.map(deal => {
                                                            return (
                                                                <option 
                                                                    key={ deal?._id } 
                                                                    // value={ deal?._id } 
                                                                    id="deal" 
                                                                    aria-label="Product Deal" 
                                                                    aria-describedby="product deal">
                                                                        { deal?.code } - { deal?.title }
                                                                </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-text px-3"><small>Default deal for product.</small></div>
                                        </div>
                                    </div>
                                </div> 





                                {/* Images */}
                                <section className="images group-fields mt-5">
                                    <h3 className="fw-bold fs-6 border-bottom pb-2 mt-5 mb-3">Product Images Section</h3>

                                    <div className="d-flex flex-wrap gap-3">
                                        <div className="mb-3 position-relative d-md-flex align-items-md-end gap-md-3">
                                            {/* Hidden file input for image */}
                                            <div className="image row g-2">
                                                <div className="mb-3 position-relative"> 
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id="image-upload-input"
                                                        name="image-upload-input"
                                                        style={{ display: 'none' }} 
                                                        onChange={ (e) => { handleImageChange(e)} }
                                                    />

                                                    <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                        { (image) ? (
                                                            <img src={image} alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div> 
                                                </div> 
                                            </div> 
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <button 
                                                // type="submit" 
                                                type="button" 
                                                onClick={ e => { 
                                                    setImagesArray(prevItems => [...prevItems, imageFile]);
                                                    setImageUrlsArray(prevItems => [...prevItems, { file: imageFile, url: URL.createObjectURL(imageFile) }]);
                                                } }
                                                className="border-0 bg-transparent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                    </svg>
                                            </button> 
                                            {/* { console.log('images array', imagesArray) } */}
                                        </div>
                                    </div>

                                    { (imagesArray?.length > 0) && (
                                        <>
                                            <h4 className="fs-6 d-flex justify-content-end border-bottom">Images to be Added</h4>

                                            <section className="d-flex flex-wrap gap-5 mt-3">
                                                {imageUrlsArray.map((img, index) => (
                                                    <article className="position-relative">
                                                        <img
                                                            key={index}
                                                            src={img?.url}
                                                            alt={`Uploaded ${index}`}
                                                            style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '10px' }}
                                                        />
                                                        <span 
                                                            onClick={ async () => {
                                                                setImagesArray(prevImages => prevImages.filter(image => image != img?.file));
                                                                setImageUrlsArray(prevImages => prevImages.filter(image => image !== img));
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                left: '145px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </article>
                                                ))}
                                            </section>
                                        </>
                                    ) }
                                    
                                    { product?.data?.images?.length && (
                                        <h4 className="fs-6 d-flex justify-content-end border-bottom">Previous Images</h4>
                                    ) }
                                    { product?.data?.images?.length && (
                                        <div className="d-flex flex-wrap gap-3">
                                            { product?.data?.images?.map((image, index) => {
                                                return (
                                                    <div key={ image?._id } className="mb-3 position-relative">
                                                        <img src={ image?.image_path?.[0]?.hi_res?.url } alt={`Preview ${1}`} className="border-radius-15" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0', objectFit: 'cover' }} />
                                                        <span 
                                                            // onClick={() => handleRemoveImage(0)} 
                                                            onClick={ async () => {
                                                                await deleteProductImage(image?._id);
                                                                await getProduct(params?.id);
                                                            }} 
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
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) }
                                        
                                </section>
                                {/* End of Images */}





                                {/* Infos */}
                                <section className="info group-fields mt-5">
                                    <h3 className="fw-bold fs-6 border-bottom pb-2 mt-5 mb-3">Product Info Section</h3>
                                    
                                    <div className="pt-0 pb-3"><small>*List out all the specific infos specific to the product. For every info title, give a corresponding value.</small></div>
                                    <div className="row g-x-2 g-y-0">
                                        <div className="col-md mb-1">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">Info</span>
                                                <input 
                                                    type="text" 
                                                    onChange={ (e) => { setInfoTitle(e.target.value)} } 
                                                    placeholder="e.g. Series" 
                                                    id="info_title" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product info" 
                                                    aria-describedby="product info" /> 
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                <input 
                                                    type="text"  
                                                    onChange={ (e) => { setInfoValue(e.target.value)} } 
                                                    placeholder="e.g. V15" 
                                                    id="info_value" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product info_value" 
                                                    aria-describedby="product info_value" />
                                            </div> 
                                            <div className="form-text px-3" id="info-1"><small>Info of Product.</small></div>
                                        </div>
                                        <div className="col-md d-flex flex-row align-items-end align-items-md-start">
                                            <button 
                                                type="button" 
                                                onClick={ () => { (infoTitle && infoValue) && setInfoArray(prevItems => [...prevItems, { index: infoArray?.length, title: infoTitle, value: infoValue }]) } }
                                                className="border-0 bg-transparent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                    </svg>
                                            </button> 
                                        </div>
                                    </div>

                                    { (infoArray?.length > 0) && (
                                        <>
                                            <h4 className="fs-6 d-flex justify-content-end border-bottom">Info to be Added</h4>

                                            <section className="d-flex flex-wrap gap-5 mt-3">
                                                {infoArray.map((info, index) => (
                                                    <article className="position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ info?.title + ': ' + info?.value }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                infoArray.find(infoInArray => infoInArray.title === info?.title) && setInfoArray(prevInfos => prevInfos.filter(previousInfo => previousInfo?.title !== info?.title));
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </article>
                                                ))}
                                            </section>
                                        </>
                                    ) }
                                    
                                    { (product?.data?.info?.length > 0) && (
                                        <h4 className="fs-6 d-flex justify-content-end border-bottom">Previous Info</h4>
                                    ) }
                                    { (product?.data?.info?.length > 0) && (
                                        <div className="d-flex flex-wrap gap-3">
                                            { product?.data?.info?.map((info, index) => {
                                                return (
                                                    <div key={ info?._id } className="mb-3 position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            {/* <span className="">{ info?.dynamic_data[0] }</span> */}
                                                            { info?.dynamic_data
                                                                && Object.entries(info?.dynamic_data).map(([key, value], index) => (
                                                                    <div key={index}>
                                                                        <span><strong>{key}</strong></span>:&nbsp;
                                                                        <span>{value}</span>
                                                                    </div>
                                                                )) }
                                                        </div>
                                                        <span 
                                                            // onClick={() => handleRemoveImage(0)} 
                                                            onClick={ async () => {
                                                                await deleteProductInfo(info?._id);
                                                                await getProduct(params?.id);
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-15px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) }
                                </section>
                                {/* End of Infos */}





                                {/* Descriptions */}
                                <section className="Descriptions group-fields mt-5">
                                    <h3 className="fw-bold fs-6 border-bottom pb-2 mt-5 mb-3">Product Descriptions Section</h3>

                                    <div className="row g-x-2 g-y-0">
                                        <div className="col-md mb-1">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6 form-field">New Description</span>
                                                <textarea 
                                                    onChange={ e => setNewDescription(e.target.value) } 
                                                    placeholder="e.g. Size: Medium." 
                                                    id="description" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product Description" 
                                                    aria-describedby="product description"></textarea>
                                            </div> 
                                            <div className="form-text px-3" id="feature-1"><small>Description of Product.</small></div>
                                        </div>
                                        <div className="col-md d-flex flex-row align-items-end align-items-md-start">
                                            <button 
                                                type="button" 
                                                onClick={ () => { newDescription && setDescriptionsArray(prevItems => [...prevItems, newDescription]) } }
                                                className="border-0 bg-transparent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                    </svg>
                                            </button> 
                                        </div>
                                    </div>

                                    { (descriptionsArray?.length > 0) && (
                                        <>
                                            <h4 className="fs-6 d-flex justify-content-end border-bottom">Description{(descriptionsArray?.length > 1)&&'s'} to be Added</h4>

                                            <section className="d-flex flex-wrap gap-5 mt-3">
                                                {descriptionsArray.map((description, index) => (
                                                    <article className="position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ description }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                descriptionsArray.find(descriptionInArray => descriptionInArray === description) && setDescriptionsArray(prevDescriptions => prevDescriptions.filter(previousDescription => previousDescription !== description));
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </article>
                                                ))}
                                            </section>
                                        </>
                                    ) }
                                    
                                    { (product?.data?.descriptions?.length > 0) && (
                                        <h4 className="fs-6 d-flex justify-content-end border-bottom">Previous Descriptions</h4>
                                    ) }
                                    { (product?.data?.descriptions?.length > 0) && (
                                        <div className="d-flex flex-wrap gap-3">
                                            { product?.data?.descriptions?.map((description, index) => {
                                                return (
                                                    <div key={ description?._id } className="mb-3 position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ description?.content }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                await deleteProductDescription(description?._id);
                                                                await getProduct(params?.id);
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) }
                                </section> 
                                {/* End of Features */} 





                                {/* Features */}
                                <section className="features group-fields mt-3">
                                    <h3 className="fw-bold fs-6 border-bottom pb-2 mt-5 mb-3">Product Features Section</h3>

                                    <div className="row g-x-2 g-y-0">
                                        <div className="col-md mb-1">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6 form-field">New Feature</span>
                                                <textarea 
                                                    onChange={ (e) => { setNewFeature(e.target.value)} } 
                                                    placeholder="e.g. 7-IN-1 APPLIANCES: electric pressure cooker, rice cooker ..." 
                                                    id="feature" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product Feature 1" 
                                                    aria-describedby="product feature"></textarea>
                                            </div> 
                                            <div className="form-text px-3" id="feature-1"><small>Feature of Product.</small></div>
                                        </div>
                                        <div className="col-md d-flex flex-row align-items-end align-items-md-start">
                                            <button 
                                                type="button" 
                                                onClick={ () => { newFeature && setFeaturesArray(prevItems => [...prevItems, newFeature]) } }
                                                className="border-0 bg-transparent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                    </svg>
                                            </button> 
                                        </div>
                                    </div>

                                    { (featuresArray?.length > 0) && (
                                        <>
                                            <h4 className="fs-6 d-flex justify-content-end border-bottom">Feature{(featuresArray?.length > 1)&&'s'} to be Added</h4>

                                            <section className="d-flex flex-wrap gap-5 mt-3">
                                                {featuresArray.map((feature, index) => (
                                                    <article className="position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ feature }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                featuresArray.find(featureInArray => featureInArray === feature) && setFeaturesArray(prevFeatures => prevFeatures.filter(previousFeature => previousFeature !== feature));
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </article>
                                                ))}
                                            </section>
                                        </>
                                    ) }
                                    
                                    { (product?.data?.features?.length > 0) && (
                                        <h4 className="fs-6 d-flex justify-content-end border-bottom">Previous Features</h4>
                                    ) }
                                    { (product?.data?.features?.length > 0) && (
                                        <div className="d-flex flex-wrap gap-3">
                                            { product?.data?.features?.map((feature, index) => {
                                                return (
                                                    <div key={ feature?._id } className="mb-3 position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ feature?.content }</span>
                                                        </div>
                                                        <span 
                                                            // onClick={() => handleRemoveImage(0)} 
                                                            onClick={ async () => {
                                                                await deleteProductFeature(feature?._id);
                                                                await getProduct(params?.id);
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) }
                                </section> 
                                {/* End of Features */} 





                                {/* Categories */}
                                <section className="category group-fields mt-5">
                                    <h3 className="fw-bold fs-6 border-bottom pb-2 mt-5 mb-3">Product Category Section</h3>

                                    <div className="row g-2">
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold">New Category</span>
                                                    <select 
                                                        onChange={ e => {
                                                            setNewCategory(e.target.value); 
                                                            console.log(newCategory)
                                                            console.log(e.target.value)
                                                            categoriesArray.find(categoryInArray => categoryInArray === e.target.value) && setCategoriesArray(prevCategories => prevCategories.filter(previousCategory => previousCategory !== e.target.value));
                                                            setCategoriesArray(prevCategories => [...prevCategories, e.target.value]);
                                                        } } 
                                                        id="new-category"
                                                        className="form-select border-radius-35"> 
                                                        <option>Select category...</option>
                                                        { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                            return (
                                                                <option 
                                                                    key={ category?._id } 
                                                                    id="category" 
                                                                    aria-label="Product Category" 
                                                                    aria-describedby="product category">
                                                                        { category?.name }
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="form-text px-3"><small>The category of your product.</small></div>
                                            </div>
                                        </div> 
                                    </div>

                                    { (categoriesArray?.length > 0) && (
                                        <>
                                            <h4 className="fs-6 d-flex justify-content-end border-bottom">Categor{(categoriesArray?.length > 1)?'ies':'y'} to be Added</h4>

                                            <section className="d-flex flex-wrap gap-4 mt-3">
                                                {categoriesArray.map((category, index) => (
                                                    <article className="position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ category }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                categoriesArray.find(categoryInArray => categoryInArray === category) && setCategoriesArray(prevCategories => prevCategories.filter(previousCategory => previousCategory !== category));
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </article>
                                                ))}
                                            </section>
                                        </>
                                    ) }
                                    
                                    { (product?.data?.categories?.length > 0) && (
                                        <h4 className="fs-6 d-flex justify-content-end border-bottom">Previous Categories</h4>
                                    ) }
                                    { (product?.data?.categories?.length > 0) && (
                                        <div className="d-flex flex-wrap gap-3">
                                            { product?.data?.categories?.map((category, index) => {
                                                return (
                                                    <div key={ category?._id } className="mb-3 position-relative">
                                                        <div className="bg-secondary border-radius-25 px-3 py-2 text-white">
                                                            <span className="">{ category?.category?.name }</span>
                                                        </div>
                                                        <span 
                                                            onClick={ async () => {
                                                                await deleteCategory(category?._id);
                                                                await getProduct(params?.id);
                                                            }} 
                                                            className="bg-transparent border-0"
                                                            style={{
                                                                position: 'absolute', 
                                                                top: '0', 
                                                                right: '-12.5px', 
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) }
                                </section>
                                {/* End of Categories */}





                            </div>

                            <div className="pt-5 mt-3 d-flex justify-content-end">
                                <button type="submit" className={`btn btn-dark px-3 border-radius-35 ${product?.loading == true && `disabled`}`}>
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
