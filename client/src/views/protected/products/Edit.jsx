import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useBrands } from '@/hooks/useBrands.jsx'; 
import { useCategories } from '@/hooks/useCategories.jsx'; 
import { useDeals } from '@/hooks/useDeals.jsx'; 
import { useProduct } from '@/hooks/useProduct.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() { 
    const { brands, getBrands } = useBrands(); 
    const { categories, getCategories } = useCategories(); 
    const { deals, getDeals } = useDeals(); 
    const params = useParams(); 
    const { product, updateProduct } = useProduct(params?.id); 
    console.log(product?.data); 
    console.log(product?.data?.images); 
    // console.log(product?.data?.images?.created_at == '2024-12-08T19:20:48.594Z'); 
    // console.log(product?.data?.images?.find(product => product?.created_at == '2024-12-08T19:20:48.594Z')); 

    /** Handle image file input */
    const [productImageFields, setProductImageFields] = useState({
        field_1: true, 
        field_2: true, 
        field_3: true, 
        field_4: true, 
        field_5: true, 
        field_6: true, 
    }); 

    const [images, setImages] = useState({});

    const handleImageClick = (index) => {
        document.getElementById(`image-upload-input-${index}`).click(); 
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0]; 

        if (file) {
            const reader = new FileReader();
            // reader.onload = () => {
            reader.onloadend = () => {
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
        // setImages(null); 
        setImages(prevImages => ({
            ...prevImages,
            [newIndex]: {}, 
        })); 
    }; 
    /** End of Handle image file input */

    const [productInfoFields, setProductInfoFields] = useState({
        field_1: true, 
        field_2: false, 
        field_3: false, 
        field_4: false, 
        field_5: false, 
        field_6: false, 
        field_7: false, 
        field_8: false, 
        field_9: false, 
        field_10: false, 
        field_11: false, 
        field_12: false, 
        field_13: false, 
        field_14: false, 
        field_15: false, 
        field_16: false, 
        field_17: false, 
        field_18: false, 
        field_19: false, 
        field_20: false, 
    }); 

    const [productDescriptionFields, setProductDescriptionFields] = useState({
        field_1: true, 
        field_2: false, 
        field_3: false, 
    }); 

    const [productFeatureFields, setProductFeatureFields] = useState({
        field_1: true, 
        field_2: false, 
        field_3: false, 
        field_4: false, 
        field_5: false, 
        field_6: false, 
        field_7: false, 
        field_8: false, 
        field_9: false, 
        field_10: false, 
    }); 

    const [productCategoryFields, setProductCategoryFields] = useState({
        field_1: true, 
        field_2: false, 
        field_3: false, 
        field_4: false, 
        field_5: false, 
        field_6: false, 
    }); 

    async function submitProduct(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        formData.append('title', product.data.title); 
        product?.data?.asin && formData.append('asin', product.data.asin); 
        product?.data?.initial_retail_price 
            ? formData.append('initial_retail_price', product.data.initial_retail_price) 
            : formData.append('initial_retail_price', 0); 
        product?.data?.initial_retail_price_cents 
            ? formData.append('initial_retail_price_cents', product.data.initial_retail_price_cents) 
            : formData.append('initial_retail_price_cents', 0); 
        product?.data?.retail_price 
            ? formData.append('retail_price', product.data.retail_price) 
            : formData.append('retail_price', 0); 
        product?.data?.retail_price_cents 
            ? formData.append('retail_price_cents', product.data.retail_price_cents)
            : formData.append('retail_price_cents', 0); 
        product?.data?.purchase_price 
            ? formData.append('purchase_price', product.data.purchase_price) 
            : formData.append('purchase_price', 0); 
        product?.data?.purchase_price_cents 
            ? formData.append('purchase_price_cents', product.data.purchase_price_cents) 
            : formData.append('purchase_price_cents', 0); 
        product.data.brand && formData.append('brand', product.data.brand); 
        product.data.deal && formData.append('deal', product.data.deal); 

        productImageFields?.field_1 && formData.append('image_1', product.data.image_1); 
        productImageFields?.field_2 && formData.append('image_2', product.data.image_2); 
        productImageFields?.field_3 && formData.append('image_3', product.data.image_3); 
        productImageFields?.field_4 && formData.append('image_4', product.data.image_4); 
        productImageFields?.field_5 && formData.append('image_5', product.data.image_5); 
        productImageFields?.field_6 && formData.append('image_6', product.data.image_6); 

        if (productInfoFields?.field_1) {
            formData.append('info_1', product.data.info_1 || ''); 
            formData.append('info_1_value', product.data.info_1_value || ''); 
        }
        if (productInfoFields?.field_2) {
            formData.append('info_2', product.data.info_2 || ''); 
            formData.append('info_2_value', product.data.info_2_value || ''); 
        }
        if (productInfoFields?.field_3) {
            formData.append('info_3', product.data.info_3 || ''); 
            formData.append('info_3_value', product.data.info_3_value || ''); 
        }
        if (productInfoFields?.field_4) {
            formData.append('info_4', product.data.info_4 || ''); 
            formData.append('info_4_value', product.data.info_4_value || ''); 
        }
        if (productInfoFields?.field_5) {
            formData.append('info_5', product.data.info_5 || ''); 
            formData.append('info_5_value', product.data.info_5_value || ''); 
        }
        if (productInfoFields?.field_6) {
            formData.append('info_6', product.data.info_6 || ''); 
            formData.append('info_6_value', product.data.info_6_value || ''); 
        }
        if (productInfoFields?.field_7) {
            formData.append('info_7', product.data.info_7 || ''); 
            formData.append('info_7_value', product.data.info_7_value || ''); 
        }
        if (productInfoFields?.field_8) {
            formData.append('info_8', product.data.info_8 || ''); 
            formData.append('info_8_value', product.data.info_8_value || ''); 
        }
        if (productInfoFields?.field_9) {
            formData.append('info_9', product.data.info_9 || ''); 
            formData.append('info_9_value', product.data.info_9_value || ''); 
        }
        if (productInfoFields?.field_10) {
            formData.append('info_10', product.data.info_10 || ''); 
            formData.append('info_10_value', product.data.info_10_value || ''); 
        }
        if (productInfoFields?.field_11) {
            formData.append('info_11', product.data.info_11 || ''); 
            formData.append('info_11_value', product.data.info_11_value || ''); 
        }
        if (productInfoFields?.field_12) {
            formData.append('info_12', product.data.info_12 || ''); 
            formData.append('info_12_value', product.data.info_12_value || ''); 
        }
        if (productInfoFields?.field_13) {
            formData.append('info_13', product.data.info_13 || ''); 
            formData.append('info_13_value', product.data.info_13_value || ''); 
        }
        if (productInfoFields?.field_14) {
            formData.append('info_14', product.data.info_14 || ''); 
            formData.append('info_14_value', product.data.info_14_value || ''); 
        }
        if (productInfoFields?.field_15) {
            formData.append('info_15', product.data.info_15 || ''); 
            formData.append('info_15_value', product.data.info_15_value || ''); 
        }
        if (productInfoFields?.field_16) {
            formData.append('info_16', product.data.info_16 || ''); 
            formData.append('info_16_value', product.data.info_16_value || ''); 
        }
        if (productInfoFields?.field_17) {
            formData.append('info_17', product.data.info_17 || ''); 
            formData.append('info_17_value', product.data.info_17_value || ''); 
        }
        if (productInfoFields?.field_18) {
            formData.append('info_18', product.data.info_18 || ''); 
            formData.append('info_18_value', product.data.info_18_value || ''); 
        }
        if (productInfoFields?.field_19) {
            formData.append('info_19', product.data.info_19 || ''); 
            formData.append('info_19_value', product.data.info_19_value || ''); 
        }
        if (productInfoFields?.field_20) {
            formData.append('info_20', product.data.info_20 || ''); 
            formData.append('info_20_value', product.data.info_20_value || ''); 
        }

        formData.append('description_1', product.data.description_1); 
        productDescriptionFields?.field_2 && formData.append('description_2', product.data.description_2); 
        productDescriptionFields?.field_3 && formData.append('description_3', product.data.description_3); 

        formData.append('feature_1', product.data.feature_1); 
        productFeatureFields?.field_2 && formData.append('feature_2', product.data.feature_2); 
        productFeatureFields?.field_3 && formData.append('feature_3', product.data.feature_3); 
        productFeatureFields?.field_4 && formData.append('feature_4', product.data.feature_4); 
        productFeatureFields?.field_5 && formData.append('feature_5', product.data.feature_5); 
        productFeatureFields?.field_6 && formData.append('feature_6', product.data.feature_6); 
        productFeatureFields?.field_7 && formData.append('feature_7', product.data.feature_7); 
        productFeatureFields?.field_8 && formData.append('feature_8', product.data.feature_8); 
        productFeatureFields?.field_9 && formData.append('feature_9', product.data.feature_9); 
        productFeatureFields?.field_10 && formData.append('feature_10', product.data.feature_10); 

        (productCategoryFields?.field_1 && product.data.category_1) && formData.append('category_1', product.data.category_1); 
        productCategoryFields?.field_2 && formData.append('category_2', product.data.category_2); 
        productCategoryFields?.field_3 && formData.append('category_3', product.data.category_3); 
        productCategoryFields?.field_4 && formData.append('category_4', product.data.category_4); 
        productCategoryFields?.field_5 && formData.append('category_5', product.data.category_5); 
        productCategoryFields?.field_6 && formData.append('category_6', product.data.category_6); 

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
                                            <div className="form-text px-3"><small>The product number from Amazon. Leave vacant if you do not have it.</small></div>
                                        </div>
                                    </div>
                                </div> 
                                
                                <section className="pricing">
                                    <div className="row g-2">
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold">Old Price</span>
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
                                                    <input 
                                                        type="number" 
                                                        min="00" max="99" 
                                                        value={ product?.data?.initial_retail_price_cents ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            initial_retail_price_cents: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 20" 
                                                        id="initial_retail_price_cents" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Initial_retail_price_cents" 
                                                        aria-describedby="product initial_retail_price_cents" />
                                                </div>
                                                <div className="form-text px-3"><small>The previous retail price (in USD) of your product (if available).</small></div>
                                            </div>
                                        </div>
                                        <div className="col-md">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold form-field-required">Price</span>
                                                    <input 
                                                        type="text"  
                                                        value={ Number(product?.data?.retail_price/100)?.toFixed() ?? '' } 
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
                                                    <input 
                                                        type="text" 
                                                        value={ Number(String(Number(product?.data?.retail_price))?.slice(-1,-3)) ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            retail_price_cents: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 20"
                                                        id="retail_price_cents" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product retail_price_cents" 
                                                        aria-describedby="product retail_price_cents" />
                                                </div>
                                                <div className="form-text px-3"><small>The current retail price (in USD) of your product.</small></div>
                                            </div>
                                        </div>
                                    </div> 
                                
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold form-field-required">Purchase Price</span>
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
                                                        aria-describedby="product purchase_price" 
                                                        required />
                                                    <input 
                                                        type="number" 
                                                        min="00" max="99"  
                                                        value={ product?.data?.purchase_price_cents ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            purchase_price_cents: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 20" 
                                                        id="purchase_price_cents" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product purchase_price_cents" 
                                                        aria-describedby="product purchase_price_cents" />
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
                                                <select 
                                                    value={ product?.data?.brand ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        brand: event.target.value,
                                                    })} 
                                                    id="brand" 
                                                    class="form-select border-radius-35">
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
                                                </select>
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
                                                    class="form-select border-radius-35" 
                                                    id="deal">
                                                        <option>Choose deal...</option>
                                                        { (deals?.data?.length > 0) && deals?.data?.map(deal => {
                                                            return (
                                                                <option 
                                                                    key={ deal?._id } 
                                                                    value={ deal?._id } 
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
                                <section className="images group-fields mt-3">
                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                        <label htmlFor="images" className="form-label fw-semibold fs-6">Product Images Section</label> 
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span 
                                                onClick={ () => {
                                                     if (productImageFields?.field_6) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_6: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 5))
                                                        })); 
                                                    } else if (productImageFields?.field_5) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_5: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 4))
                                                        })); 
                                                    } else if (productImageFields?.field_4) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_4: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 3))
                                                        })); 
                                                    } else if (productImageFields?.field_3) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_3: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 2))
                                                        })); 
                                                    } else if (productImageFields?.field_2) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_2: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 1))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-left-radius-35 ${productImageFields?.field_2 == false && ` disabled`}`}>
                                                    Less fields
                                            </span>
                                            <span 
                                                onClick={ () => {
                                                    if (productImageFields?.field_2 == false) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true,
                                                            ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`field_${i + 3}`, false]))
                                                        })); 
                                                    } else if (productImageFields?.field_3 == false) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`field_${i + 4}`, false]))
                                                        })); 
                                                    } else if (productImageFields?.field_4 == false) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            field_4: true, field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 2 }, (_, i) => [`field_${i + 5}`, false]))
                                                        })); 
                                                    } else if (productImageFields?.field_5 == false) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(5)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 6}`, false]))
                                                        })); 
                                                    } else if (productImageFields?.field_6 == false) {
                                                        setProductImageFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(6)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 0 }, (_, i) => [`field_${i + 7}`, false]))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-right-radius-35 ${productImageFields?.field_6 && ` disabled`}`}>
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
                                                id={`image-upload-input-${0}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(0, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data,
                                                                        image_1: e.target.files[0], 
                                                                    });
                                                                    handleImageChange(0, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(0)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                {/* { (images?.['image0'] || product?.data?.images?.image_index == 1) ? ( */}
                                                { (images?.['image0'] || product?.data?.images?.find(image => image?.image_index == 1)) ? (
                                                    <img src={images?.['image0'] || product?.data?.images?.find(image => image?.image_index == 1)?.image_path?.url} alt={`Preview ${1}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                            {/* {images?.['image0'] && (
                                                <span 
                                                    onClick={() => handleRemoveImage(0)} 
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
                                            )} */}
                                        </div>
                                    
                                    { (productImageFields?.field_2) && 
                                        <div className="mb-3"> 
                                            {/* Hidden file input for image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`image-upload-input-${1}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(1, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data,
                                                                        image_2: e.target.files[0],
                                                                    });
                                                                    handleImageChange(1, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(1)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                { (images?.['image1'] || product?.data?.images?.find(image => image?.image_index == 2))  ? (
                                                    <img src={images?.['image1'] || product?.data?.images?.find(image => image?.image_index == 2)?.image_path?.url} alt={`Preview ${2}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    } 
                                    { (productImageFields?.field_3) &&
                                        <div className="mb-3"> 
                                            {/* Hidden file input for image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`image-upload-input-${2}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(2, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data,
                                                                        image_3: e.target.files[0],
                                                                    });
                                                                    handleImageChange(2, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(2)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                { (images?.['image2'] || product?.data?.images?.find(image => image?.image_index == 3)) ? (
                                                    <img src={images?.['image2'] || product?.data?.images?.find(image => image?.image_index == 3)?.image_path?.url} alt={`Preview ${3}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    } 
                                    { (productImageFields?.field_4) &&
                                        <div className="mb-3"> 
                                            {/* Hidden file input for image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`image-upload-input-${3}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(3, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data,
                                                                        image_4: e.target.files[0], 
                                                                    });
                                                                    handleImageChange(3, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(3)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                { (images?.['image3'] || product?.data?.images?.find(image => image?.image_index == 4)) ? (
                                                    <img src={images?.['image3'] || product?.data?.images?.find(image => image?.image_index == 4)?.image_path?.url} alt={`Preview ${4}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    } 
                                    { (productImageFields?.field_5) &&
                                        <div className="mb-3"> 
                                            {/* Hidden file input for image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`image-upload-input-${4}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(4, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data, 
                                                                        image_5: e.target.files[0],
                                                                    });
                                                                    handleImageChange(4, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(4)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                { (images?.['image4'] || product?.data?.images?.find(image => image?.image_index == 5)) ? (
                                                    <img src={images?.['image4'] || product?.data?.images?.find(image => image?.image_index == 5)?.image_path?.url} alt={`Preview ${5}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    } 
                                    { (productImageFields?.field_6) &&
                                        <div className="mb-3"> 
                                            {/* Hidden file input for image */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`image-upload-input-${5}`}
                                                style={{ display: 'none' }} // Hide the file input
                                                // onChange={(e) => handleImageChange(5, e)} 
                                                onChange={ (e) => { product.setData({
                                                                        ...product?.data,
                                                                        image_6: e.target.files[0], 
                                                                    });
                                                                    handleImageChange(5, e)} }
                                            />
                                            {/* End of Hidden file input for image */}

                                            {/* Image preview as the clickable element */}
                                            <div onClick={() => handleImageClick(5)} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '200px', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                { (images?.['image5'] || product?.data?.images?.find(image => image?.image_index == 6)) ? (
                                                    <img src={images?.['image5'] || product?.data?.images?.find(image => image?.image_index == 6)?.image_path?.url} alt={`Preview ${6}`} className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    } 

                                    </div> 
                                </section>
                                {/* End of Images */}





                                {/* Infos */}
                                <section className="info group-fields mt-4">
                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                        <label htmlFor="info" className="form-label fw-semibold fs-6">Product Info Section</label> 
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span 
                                                onClick={ () => {
                                                    if (productInfoFields?.field_20) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState, 
                                                            field_20: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 19))
                                                        })); 
                                                    } else if (productInfoFields?.field_19) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_19: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 18))
                                                        })); 
                                                    } else if (productInfoFields?.field_18) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_18: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 17))
                                                        })); 
                                                    } else if (productInfoFields?.field_17) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_17: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 16))
                                                        })); 
                                                    } else if (productInfoFields?.field_16) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_16: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 15))
                                                        })); 
                                                    } else if (productInfoFields?.field_15) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_15: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 14))
                                                        })); 
                                                    } else if (productInfoFields?.field_14) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_14: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 13))
                                                        })); 
                                                    } else if (productInfoFields?.field_13) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_13: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 12))
                                                        })); 
                                                    } else if (productInfoFields?.field_12) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_12: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 11))
                                                        })); 
                                                    } else if (productInfoFields?.field_11) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_11: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 10))
                                                        })); 
                                                    } else if (productInfoFields?.field_10) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState, 
                                                            field_10: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 9))
                                                        })); 
                                                    } else if (productInfoFields?.field_9) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_9: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 8))
                                                        })); 
                                                    } else if (productInfoFields?.field_8) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_8: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 7))
                                                        })); 
                                                    } else if (productInfoFields?.field_7) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_7: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 6))
                                                        })); 
                                                    } else if (productInfoFields?.field_6) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_6: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 5))
                                                        })); 
                                                    } else if (productInfoFields?.field_5) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_5: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 4))
                                                        })); 
                                                    } else if (productInfoFields?.field_4) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_4: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 3))
                                                        })); 
                                                    } else if (productInfoFields?.field_3) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_3: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 2))
                                                        })); 
                                                    } else if (productInfoFields?.field_2) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_2: false, 
                                                            ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 1))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-left-radius-35 ${productInfoFields?.field_2 == false && ` disabled`}`}>
                                                    Less fields
                                            </span>
                                            <span 
                                                onClick={ () => {
                                                    if (productInfoFields?.field_2 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true,
                                                            ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`field_${i + 3}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_3 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`field_${i + 4}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_4 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            field_4: true, field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 5}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_5 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(5)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`field_${i + 6}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_6 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(6)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`field_${i + 7}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_7 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(7)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`field_${i + 8}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_8 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(8)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 2 }, (_, i) => [`field_${i + 9}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_9 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(9)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 10}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_10 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(10)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 11}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_11 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(11)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 12}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_12 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(12)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 13}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_13 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(13)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 14}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_14 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(14)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 15}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_15 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(15)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 16}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_16 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(16)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 17}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_17 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(17)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 18}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_18 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(18)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 19}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_19 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(19)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 20}`, false]))
                                                        })); 
                                                    } else if (productInfoFields?.field_20 == false) {
                                                        setProductInfoFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(20)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 21}`, false]))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-right-radius-35 ${productInfoFields?.field_20 && ` disabled`}`}>
                                                    More fields
                                            </span>
                                        </div>
                                    </div> 
                                    <div className="pt-0 pb-3"><small>*List out all the specific infos specific to the product. For every info title, give a corresponding value.</small></div>
                                    <div className="row g-2">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">#1.</span>
                                                <input 
                                                    type="text" 
                                                    value={ product?.data?.info_1 ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        info_1: event.target.value,
                                                    }) }
                                                    placeholder="e.g. Series" 
                                                    id="info_1" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product info_1" 
                                                    aria-describedby="product info_1" /> 
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                <input 
                                                    type="text"  
                                                    value={ product?.data?.info_1_value ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        info_1_value: event.target.value,
                                                    }) }
                                                    placeholder="e.g. V15" 
                                                    id="info_1_value" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product info_1_value" 
                                                    aria-describedby="product info_1_value" />
                                            </div> 
                                            <div className="form-text px-3" id="info-1"><small>Info 1 of Product.</small></div>
                                        </div>
                                    </div> 
                                    { (productInfoFields?.field_2) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#2.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_2 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_2: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Series" 
                                                        id="info_2" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_2" 
                                                        aria-describedby="product info_2" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_2_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_2_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. V15" 
                                                        id="info_2_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_2_value" 
                                                        aria-describedby="product info_2_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-2"><small>Info 2 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_3) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#3.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_3 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_3: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_3" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_3" 
                                                        aria-describedby="product info_3" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_3_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_3_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 45kg" 
                                                        id="info_3_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_3_value" 
                                                        aria-describedby="product info_3_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-3"><small>Info 3 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_4) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#4.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_4 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_4: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_4" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_4" 
                                                        aria-describedby="product info_4" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_4_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_4_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 45kg" 
                                                        id="info_4_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_4_value" 
                                                        aria-describedby="product info_4_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-4"><small>Info 4 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_5) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#5.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_5 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_5: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_5" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_5" 
                                                        aria-describedby="product info_5" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_5_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_5_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 45kg" 
                                                        id="info_5_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_5_value" 
                                                        aria-describedby="product info_5_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-5"><small>Info 5 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_6) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#6.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_6 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_6: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_6" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_6" 
                                                        aria-describedby="product info_6" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_6_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_6_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_6_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_6_value" 
                                                        aria-describedby="product info_6_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-6"><small>Info 6 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_7) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#7.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_7 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_7: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_7" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_7" 
                                                        aria-describedby="product info_7" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_7_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_7_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_7_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_7_value" 
                                                        aria-describedby="product info_7_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-7"><small>Info 7 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_8) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#8.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_8 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_8: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_8" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_8" 
                                                        aria-describedby="product info_8" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_8_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_8_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_8_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_8_value" 
                                                        aria-describedby="product info_8_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-8"><small>Info 8 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_9) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#9.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_9 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_9: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_9" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_9" 
                                                        aria-describedby="product info_9" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_9_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_9_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_9_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_9_value" 
                                                        aria-describedby="product info_9_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-9"><small>Info 9 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_10) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#10.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_10 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_10: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_10" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_10" 
                                                        aria-describedby="product info_10" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_10_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_10_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_10_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_10_value" 
                                                        aria-describedby="product info_10_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-10"><small>Info 10 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_11) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#11.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_11 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_11: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_11" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_11" 
                                                        aria-describedby="product info_11" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_11_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_11_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_11_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_11_value" 
                                                        aria-describedby="product info_11_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-11"><small>Info 11 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_12) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#12.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_12 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_12: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_12" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_12" 
                                                        aria-describedby="product info_12" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_12_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_12_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_12_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_12_value" 
                                                        aria-describedby="product info_12_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-12"><small>Info 12 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_13) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#13.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_13 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_13: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_13" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_13" 
                                                        aria-describedby="product info_13" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_13_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_13_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_13_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_13_value" 
                                                        aria-describedby="product info_13_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-13"><small>Info 13 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_14) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#14.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_14 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_14: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_14" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_14" 
                                                        aria-describedby="product info_14" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_14_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_14_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_14_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_14_value" 
                                                        aria-describedby="product info_14_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-14"><small>Info 14 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_15) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#15.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_15 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_15: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_15" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_15" 
                                                        aria-describedby="product info_15" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_15_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_15_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_15_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_15_value" 
                                                        aria-describedby="product info_15_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-15"><small>Info 15 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_16) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#16.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_16 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_16: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_16" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_16" 
                                                        aria-describedby="product info_16" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_16_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_16_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_16_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_16_value" 
                                                        aria-describedby="product info_16_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-16"><small>Info 16 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_17) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#17.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_17 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_17: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_17" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_17" 
                                                        aria-describedby="product info_17" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_17_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_17_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_17_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_17_value" 
                                                        aria-describedby="product info_17_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-17"><small>Info 17 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_18) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#18.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_18 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_18: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_18" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_18" 
                                                        aria-describedby="product info_18" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_18_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_18_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_18_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_18_value" 
                                                        aria-describedby="product info_18_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-18"><small>Info 18 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_19) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#19.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_19 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_19: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_19" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_19" 
                                                        aria-describedby="product info_19" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_19_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_19_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_19_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_19_value" 
                                                        aria-describedby="product info_19_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-19"><small>Info 19 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                    { (productInfoFields?.field_20) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">#20.</span>
                                                    <input 
                                                        type="text" 
                                                        value={ product?.data?.info_20 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_20: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Weight" 
                                                        id="info_20" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_20" 
                                                        aria-describedby="product info_20" /> 
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Value</span>
                                                    <input 
                                                        type="text"  
                                                        value={ product?.data?.info_20_value ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            info_20_value: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 55kg" 
                                                        id="info_20_value" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product info_20_value" 
                                                        aria-describedby="product info_20_value" />
                                                </div> 
                                                <div className="form-text px-3" id="info-20"><small>Info 20 of Product.</small></div>
                                            </div>
                                        </div>  
                                    } 
                                </section>
                                {/* End of Infos */}





                                {/* Descriptions */}
                                <section className="description group-fields mt-3">
                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                        <label htmlFor="description" className="form-label fw-semibold fs-6">Product Description Section</label> 
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span 
                                                onClick={ () => {
                                                    if (productDescriptionFields?.field_3) {
                                                        setProductDescriptionFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true, 
                                                            field_3: false, 
                                                        })); 
                                                    } else if (productDescriptionFields?.field_2) {
                                                        setProductDescriptionFields(prevState => ({
                                                            ...prevState,
                                                            field_2: false, 
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-left-radius-35 ${productDescriptionFields?.field_2 == false && ` disabled`}`}>
                                                    Less fields
                                            </span>
                                            <span 
                                                onClick={ () => {
                                                    if (productDescriptionFields?.field_2 == false) {
                                                        setProductDescriptionFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true
                                                        })); 
                                                    } else if (productDescriptionFields?.field_3 == false) {
                                                        setProductDescriptionFields(prevState => ({
                                                            ...prevState,
                                                            field_3: true
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-right-radius-35 ${productDescriptionFields?.field_3 && ` disabled`}`}>
                                                    More fields
                                            </span>
                                        </div>
                                    </div> 
                                    <div className="row g-2">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6 form-field-required">Description 1</span>
                                                <textarea 
                                                    value={ product?.data?.description_1 ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        description_1: event.target.value,
                                                    }) }
                                                    placeholder="e.g. Size: 3-QT" 
                                                    id="description_1" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product Description 1" 
                                                    aria-describedby="product description 1" 
                                                    required ></textarea>
                                            </div> 
                                            <div className="form-text px-3" id="desription-1"><small>Description 1 of Product.</small></div>
                                        </div>
                                    </div> 
                                    { (productDescriptionFields?.field_2) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Description 2</span>
                                                    <textarea 
                                                        value={ product?.data?.description_2 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            description_2: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Style: Duo" 
                                                        id="description_2" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Description 2" 
                                                        aria-describedby="product description 2" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="desription-2"><small>Product Description 2.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productDescriptionFields?.field_3) &&
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Description 3</span>
                                                    <textarea 
                                                        value={ product?.data?.description_3 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            description_3: event.target.value,
                                                        }) }
                                                        placeholder="e.g. Instant Pot Duo Mini is the ideal companion to the Duo 6 Quart, 7-in-1 programmable multi-cooker replaces 7 kitchen appliances, combines the functions of a Rice Cooker ..." 
                                                        id="description_3" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Description 3" 
                                                        aria-describedby="product description 3" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="desription-3"><small>Product Description 3.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                </section>
                                {/* End of Descriptions */}





                                {/* Features */}
                                <section className="features group-fields mt-3">
                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                        <label htmlFor="features" className="form-label fw-semibold fs-6">Product Features Section</label> 
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span 
                                                onClick={ () => {
                                                    if (productFeatureFields?.field_10) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState, 
                                                            field_10: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 9))
                                                        })); 
                                                    } else if (productFeatureFields?.field_9) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_9: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 8))
                                                        })); 
                                                    } else if (productFeatureFields?.field_8) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_8: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 7))
                                                        })); 
                                                    } else if (productFeatureFields?.field_7) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_7: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 6))
                                                        })); 
                                                    } else if (productFeatureFields?.field_6) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_6: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 5))
                                                        })); 
                                                    } else if (productFeatureFields?.field_5) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_5: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 4))
                                                        })); 
                                                    } else if (productFeatureFields?.field_4) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_4: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 3))
                                                        })); 
                                                    } else if (productFeatureFields?.field_3) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_3: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 2))
                                                        })); 
                                                    } else if (productFeatureFields?.field_2) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_2: false, 
                                                            ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 1))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-left-radius-35 ${productFeatureFields?.field_2 == false && ` disabled`}`}>
                                                    Less fields
                                            </span>
                                            <span 
                                                onClick={ () => {
                                                    if (productFeatureFields?.field_2 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true,
                                                            ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`field_${i + 3}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_3 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`field_${i + 4}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_4 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            field_4: true, field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 5}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_5 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(5)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [`field_${i + 6}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_6 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(6)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`field_${i + 7}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_7 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(7)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`field_${i + 8}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_8 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(8)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 2 }, (_, i) => [`field_${i + 9}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_9 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(9)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 10}`, false]))
                                                        })); 
                                                    } else if (productFeatureFields?.field_10 == false) {
                                                        setProductFeatureFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(10)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 11}`, false]))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-right-radius-35 ${productFeatureFields?.field_3 && ` disabled`}`}>
                                                    More fields
                                            </span>
                                        </div>
                                    </div> 
                                    <div className="row g-2">
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-radius-35 fw-semibold fs-6 form-field-required">Feature 1</span>
                                                <textarea 
                                                    value={ product?.data?.feature_1 ?? '' } 
                                                    onChange={ event => product.setData({
                                                        ...product?.data,
                                                        feature_1: event.target.value,
                                                    }) }
                                                    placeholder="e.g. 7-IN-1 APPLIANCES: electric pressure cooker, rice cooker, slow cooker, yogurt maker, steamer, sauté pan and food" 
                                                    id="feature_1" 
                                                    className="form-control border-radius-35" 
                                                    aria-label="Product Feature 1" 
                                                    aria-describedby="product feature 1" 
                                                    required ></textarea>
                                            </div> 
                                            <div className="form-text px-3" id="feature-1"><small>Feature 1 of Product.</small></div>
                                        </div>
                                    </div> 
                                    { (productFeatureFields?.field_2) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 2</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_2 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_2: event.target.value,
                                                        }) }
                                                        placeholder="e.g. QUICK ONE-TOUCH COOKING with 11 Smart Touch customizable programs for pressure cooking ribs, soups, beans, rice, poultry, yogurt, desserts and more on autopilot. Power: 700W, Power Supply: 120V-60Hz" 
                                                        id="feature_2" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 2" 
                                                        aria-describedby="product feature 2" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 2 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_3) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 3</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_3 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_3: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_3" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 3" 
                                                        aria-describedby="product feature 3" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 3 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_4) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 4</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_4 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_4: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_4" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 4" 
                                                        aria-describedby="product feature 4" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 4 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_5) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 5</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_5 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_5: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_5" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 5" 
                                                        aria-describedby="product feature 5" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 5 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_6) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 6</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_6 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_6: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_6" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 6" 
                                                        aria-describedby="product feature 6" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 6 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_7) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 7</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_7 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_7: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_7" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 7" 
                                                        aria-describedby="product feature 7" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 7 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_8) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 8</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_8 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_8: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_8" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 8" 
                                                        aria-describedby="product feature 8" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 8 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_9) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 9</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_9 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_9: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_9" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 9" 
                                                        aria-describedby="product feature 9" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 9 of Product.</small></div>
                                            </div>
                                        </div> 
                                    } 
                                    { (productFeatureFields?.field_10) && 
                                        <div className="row g-2">
                                            <div className="mb-3">
                                                <div className="input-group">
                                                    <span className="input-group-text border-radius-35 fw-semibold fs-6">Feature 10</span>
                                                    <textarea 
                                                        value={ product?.data?.feature_10 ?? '' } 
                                                        onChange={ event => product.setData({
                                                            ...product?.data,
                                                            feature_10: event.target.value,
                                                        }) }
                                                        placeholder="e.g. 10+ PROVEN SAFETY FEATURES including overheat protection and safe-locking lid" 
                                                        id="feature_10" 
                                                        className="form-control border-radius-35" 
                                                        aria-label="Product Feature 10" 
                                                        aria-describedby="product feature 10" ></textarea>
                                                </div> 
                                                <div className="form-text px-3" id="feature-1"><small>Feature 1 of Product0.</small></div>
                                            </div>
                                        </div> 
                                    }
                                </section> 
                                {/* End of Features */} 





                                {/* Categories */}
                                <section className="category group-fields mt-3">
                                    <div className="d-flex justify-content-between flex-wrap gap-1 border-bottom pb-2 my-3">
                                        <label htmlFor="category" className="form-label fw-semibold fs-6">Product Category Section</label> 
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span 
                                                onClick={ () => {
                                                     if (productCategoryFields?.field_6) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_6: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 5))
                                                        })); 
                                                    } else if (productCategoryFields?.field_5) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_5: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 4))
                                                        })); 
                                                    } else if (productCategoryFields?.field_4) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_4: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 3))
                                                        })); 
                                                    } else if (productCategoryFields?.field_3) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_3: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 2))
                                                        })); 
                                                    } else if (productCategoryFields?.field_2) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_2: false, 
                                                            ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`field_${i + 1}`, true]).slice(0, 1))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-left-radius-35 ${productCategoryFields?.field_2 == false && ` disabled`}`}>
                                                    Less fields
                                            </span>
                                            <span 
                                                onClick={ () => {
                                                    if (productCategoryFields?.field_2 == false) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_2: true,
                                                            ...Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`field_${i + 3}`, false]))
                                                        })); 
                                                    } else if (productCategoryFields?.field_3 == false) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 3 }, (_, i) => [`field_${i + 4}`, false]))
                                                        })); 
                                                    } else if (productCategoryFields?.field_4 == false) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            field_4: true, field_3: true, field_2: true, 
                                                            ...Object.fromEntries(Array.from({ length: 2 }, (_, i) => [`field_${i + 5}`, false]))
                                                        })); 
                                                    } else if (productCategoryFields?.field_5 == false) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(5)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 1 }, (_, i) => [`field_${i + 6}`, false]))
                                                        })); 
                                                    } else if (productCategoryFields?.field_6 == false) {
                                                        setProductCategoryFields(prevState => ({
                                                            ...prevState,
                                                            ...Object.fromEntries([...Array(6)].map((_, i) => [`field_${i + 2}`, true])),
                                                            ...Object.fromEntries(Array.from({ length: 0 }, (_, i) => [`field_${i + 7}`, false]))
                                                        })); 
                                                    }
                                                } }
                                                className={`btn btn-sm btn-dark border-right-radius-35 ${productCategoryFields?.field_6 && ` disabled`}`}>
                                                    More fields
                                            </span>
                                        </div>
                                    </div> 
                                    <div className="row g-2">
                                        { (productCategoryFields?.field_1) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 1</span>
                                                        <select 
                                                            value={ (product?.data?.categories?.find(category => category?.category?._id == category?._id)?._id) ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_1: event.target.value,
                                                            })} 
                                                            id="category-1"
                                                            class="form-select border-radius-35"> 
                                                            <option>Choose category 1...</option>
                                                            { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                return (
                                                                    <option 
                                                                        key={ category?._id } 
                                                                        value={ category?._id } 
                                                                        id="category-1" 
                                                                        aria-label="Product Category 1" 
                                                                        aria-describedby="product category 1">
                                                                            { category?.name }
                                                                    </option>
                                                                )
                                                            })}
                                                            {/* { console.log(product?.data?.categories?.find(category => category?._id == category?._id)?._id) } */}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                        { (productCategoryFields?.field_2) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 2</span>
                                                        <select 
                                                            value={ product?.data?.category_2 ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_2: event.target.value,
                                                            })} 
                                                            id="category-2" 
                                                            class="form-select border-radius-35"> 
                                                                <option>Choose category 2...</option>
                                                                { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                    return (
                                                                        <option 
                                                                            key={ category?._id } 
                                                                            value={ category?._id } 
                                                                            id="category-2" 
                                                                            aria-label="Product Category 2" 
                                                                            aria-describedby="product category 2">
                                                                                { category?.name }
                                                                        </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                    </div> 
                                    <div className="row g-2">
                                        { (productCategoryFields?.field_3) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 3</span>
                                                        <select 
                                                            value={ product?.data?.category_3 ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_3: event.target.value,
                                                            })} 
                                                            id="category-3" 
                                                            class="form-select border-radius-35"> 
                                                                <option>Choose category 3...</option>
                                                                { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                    return (
                                                                        <option 
                                                                            key={ category?._id } 
                                                                            value={ category?._id } 
                                                                            id="category-3" 
                                                                            aria-label="Product Category 3" 
                                                                            aria-describedby="product category 3">
                                                                                { category?.name }
                                                                        </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                        { (productCategoryFields?.field_4) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 4</span>
                                                        <select 
                                                            value={ product?.data?.category_4 ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_4: event.target.value,
                                                            })} 
                                                            id="category-4" 
                                                            class="form-select border-radius-35"> 
                                                            <option>Choose category 4...</option>
                                                            { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                return (
                                                                    <option 
                                                                        key={ category?._id } 
                                                                        value={ category?._id } 
                                                                        id="category-4"
                                                                        aria-label="Product Category 4" 
                                                                        aria-describedby="product category 4">
                                                                            { category?.name }
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                    </div> 
                                    <div className="row g-2">
                                        { (productCategoryFields?.field_5) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 5</span>
                                                        <select 
                                                            value={ product?.data?.category_5 ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_5: event.target.value,
                                                            })} 
                                                            id="category-5" 
                                                            class="form-select border-radius-35"> 
                                                                <option>Choose category 5...</option>
                                                                { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                    return (
                                                                        <option 
                                                                            key={ category?._id } 
                                                                            value={ category?._id } 
                                                                            id="category-5" 
                                                                            aria-label="Product Category 5" 
                                                                            aria-describedby="product category 5">
                                                                                { category?.name }
                                                                        </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                        { (productCategoryFields?.field_6) && 
                                            <div className="col-md">
                                                <div className="mb-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text border-radius-35 fw-semibold">Category 6</span>
                                                        <select 
                                                            value={ product?.data?.category_6 ?? '' } 
                                                            onChange={ event => product.setData({
                                                                ...product?.data,
                                                                category_6: event.target.value,
                                                            })} 
                                                            id="category-6" 
                                                            class="form-select border-radius-35"> 
                                                            <option>Choose category 6...</option>
                                                            { (categories?.data?.length > 0) && categories?.data?.map(category => {
                                                                return (
                                                                    <option 
                                                                        key={ category?._id } 
                                                                        value={ category?._id } 
                                                                        id="category-6" 
                                                                        aria-label="Product Category 6" 
                                                                        aria-describedby="product category 6">
                                                                            { category?.name }
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="form-text px-3"><small>The category of your product.</small></div>
                                                </div>
                                            </div> } 
                                    </div> 
                                </section>
                                {/* End of Categories */}





                            </div>

                            <div className="pt-3 d-flex justify-content-end">
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
