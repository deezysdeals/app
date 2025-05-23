import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js';
import mongoose from 'mongoose'; 
import slug from 'slug';
const slugIt = slug; 
import Brand from '../models/Brand.js';
import Deal from '../models/Deal.js';
import Category from '../models/Category.js'; 
import Product from '../models/Product.js'; 
import CategoryProduct from '../models/CategoryProduct.js';
import ProductDescription from '../models/ProductDescription.js'; 
import ProductFeature from '../models/ProductFeature.js';
import ProductImage from '../models/ProductImage.js'; 
import ProductInfo from '../models/ProductInfo.js'; 
import SitePaymentConfiguration from '../models/SitePaymentConfiguration.js';


/**
 * GET ALL PRODUCTS
 */
const getProducts = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const search_key = req?.query?.search_key; 
    // console.log('search_key', search_key);

    let products, total;

    // if (search_key && (search_key != '') && (search_key != null) && (search_key != undefined)) {
    if (!search_key) {
        products = await Product.find({ deleted_at: null })
                                // .sort('-created_at')
                                .sort('-updated_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'brand', 
                                })
                                .lean(); 
        if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

        total = await Product.countDocuments({ deleted_at: null }); 
    } else {
        products = await Product.find({ title: new RegExp(search_key, 'i'), deleted_at: null })
                                // .sort('-created_at')
                                .sort('-updated_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'brand', 
                                })
                                .lean(); 
        if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

        total = await Product.countDocuments({ title: new RegExp(search_key, 'i'), deleted_at: null }); 
    }

    let productsList = []; 

    const updateProductPromises = products?.map(async productItem => { 
        let foundProductImages = await ProductImage.find({ product: productItem?._id }).exec(); 
        productItem['product_images'] = foundProductImages; 

        let foundProductCategories = await CategoryProduct.find({ product: productItem?._id })
                                                        .select('-product -deleted_at')
                                                        .populate({
                                                            path: 'category', 
                                                            select: 'title description'
                                                        })
                                                        .lean(); 
        productItem['product_categories'] = foundProductCategories; 


        productsList.push(productItem); 
    }); 

    await Promise.all(updateProductPromises); 

	// res.json({ data: products }); 
    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productsList 
            });
});

/**
 * CREATE PRODUCT
 */
const createProduct = asyncHandler(async (req, res) => { 
    console.log('request body', req?.body); 

    const { brand, 
            deal, 
            asin, 
            title, 
            category_1, category_2, category_3, category_4, category_5, category_6, category_7, 
            info_1, info_1_value, 
            info_2, info_2_value, 
            info_3, info_3_value, 
            info_4, info_4_value, 
            info_5, info_5_value, 
            info_6, info_6_value, 
            info_7, info_7_value, 
            info_8, info_8_value, 
            info_9, info_9_value, 
            info_10, info_10_value, 
            info_11, info_11_value, 
            info_12, info_12_value, 
            info_13, info_13_value, 
            info_14, info_14_value, 
            info_15, info_15_value, 
            info_16, info_16_value, 
            info_17, info_17_value, 
            info_18, info_18_value, 
            info_19, info_19_value, 
            info_20, info_20_value, 
            description_1, description_2, description_3, 
            feature_1, feature_2, feature_3, feature_4, feature_5, feature_6, feature_7, feature_8, feature_9, feature_10, 
            initial_retail_price, 
            retail_price, 
            purchase_price } = req?.body; 

    const session = await mongoose.startSession(); 
    session.startTransaction(); 

    try {
        /** Main Product Section */  
        const newProduct = await Product.create({
            user: req?.user_id, 
            brand, 
            deal, 
            asin: (asin ? asin : (new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)+(Date.now()))), 
            title, 
            slug: slugIt(title + '-' + new Date().toISOString() ),
            purchase_price_virtual: purchase_price, 
            initial_retail_price_virtual: initial_retail_price, 
            retail_price_virtual: retail_price, 
            purchased_for_resale: ((purchase_price > 0) ? true : false),
        }); 
        /** End of Main Product Section */

        /** Images Section */ 
        const images = [
            req?.files?.image_1, 
            req?.files?.image_2, 
            req?.files?.image_3, 
            req?.files?.image_4, 
            req?.files?.image_5, 
            req?.files?.image_6
        ]; 

        const validImages = images.filter(image => image != null); 

        let imagesArray = [];

        if (validImages?.length > 0) {
            for (let i = 0; i < validImages.length; i++) {
                const image = validImages[i]; 

                let productImageUpload = await cloudinaryImageUpload(image.tempFilePath, "deezysdeals_product_images"); 
                if (!productImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

                // Save the valid image to the ProductImage model
                await ProductImage.create({
                    user: req?.user_id, 
                    product: newProduct._id, 
                    image_path: { 
                        public_id: productImageUpload.public_id,
                        url: productImageUpload.secure_url
                    }, 
                }); 

                imagesArray.push(productImageUpload.secure_url); 
            } 

            const addImagesToProduct = await Product.findOneAndUpdate(
                { _id: newProduct._id }, 
                { $push: { images: { $each: imagesArray } } },
                { new: true } 
            ); 
        }
        /** End Images Section */

        /** Infos Section */ 
        const dynamicInfoData = new Map([
            [info_1 || '', info_1_value || ''],
            [info_2 || '', info_2_value || ''],
            [info_3 || '', info_3_value || ''], 
            [info_4 || '', info_4_value || ''], 
            [info_5 || '', info_5_value || ''], 
            [info_6 || '', info_6_value || ''], 
            [info_7 || '', info_7_value || ''], 
            [info_8 || '', info_8_value || ''], 
            [info_9 || '', info_9_value || ''], 
            [info_10 || '', info_10_value || ''], 
            [info_11 || '', info_11_value || ''], 
            [info_12 || '', info_12_value || ''], 
            [info_13 || '', info_13_value || ''], 
            [info_14 || '', info_14_value || ''], 
            [info_15 || '', info_15_value || ''], 
            [info_16 || '', info_16_value || ''], 
            [info_17 || '', info_17_value || ''], 
            [info_18 || '', info_18_value || ''], 
            [info_19 || '', info_19_value || ''], 
            [info_20 || '', info_20_value || ''], 
        ]);

        await ProductInfo.create({
            user: req?.user_id,
            product: newProduct._id,
            dynamic_data: dynamicInfoData,
        });
        /** End Infos Section */

        /** Descriptions Section */ 
        const descriptions = [
            description_1, 
            description_2, 
            description_3
        ]; 

        const validDescriptions = descriptions.filter(description => description != null);

        for (let i = 0; i < validDescriptions.length; i++) {
            const description = validDescriptions[i];

            // Save the valid description to the ProductDescription model
            await ProductDescription.create({
                user: req?.user_id,
                product: newProduct._id,
                content: description,
            });
        }
        /** End Descriptions Section */

        /** Features Section */ 
        const features = [
            feature_1, 
            feature_2, 
            feature_3, 
            feature_4, 
            feature_5, 
            feature_6, 
            feature_7, 
            feature_8, 
            feature_9, 
            feature_10, 
        ]; 

        const validFeatures = features.filter(feature => feature != null);

        for (let i = 0; i < validFeatures.length; i++) {
            const feature = validFeatures[i];

            await ProductFeature.create({
                user: req?.user_id,
                product: newProduct._id,
                content: feature,
            });
        }
        /** End Features Section */ 

        /** Categories Section */ 
        const categories = [
            category_1, 
            category_2, 
            category_3, 
            category_4, 
            category_5, 
            category_6, 
            category_7
        ]; 

        const validCategories = categories.filter(category => category != null);

        if (validCategories?.length > 0) {
            for (let i = 0; i < validCategories.length; i++) {
                const category = validCategories[i];

                // Save the valid category to the CategoryProduct model
                await CategoryProduct.create({
                    user: req?.user_id,
                    product: newProduct._id,
                    category,
                });
            } 
        } 
        /** End Categories Section */

        // newProduct['categories'] = productCategories; 
        // newProduct['images'] = productImages; 

        await session.commitTransaction(); 

        res.status(201).json({ success: `Product ${newProduct._id} added`, data: newProduct });


    } catch(error) { 

        await session.abortTransaction(); 
        // await transaction.rollback();
        
        res.status(500).json({ message: "An error occured! Product not saved.", details: `${error}` }); 

    } finally {

        session.endSession();

    }
}); 

/**
 * GET A PRODUCT
 */
const getProduct = asyncHandler(async (req, res) => { 
    const { id } = req?.params; 

	const product = await Product.findOne({ _id: id })
                                .select(['-created_at', '-updated_at', '-deleted_at'])
                                .populate({
                                    path: 'brand'
                                })
                                .populate({
                                    path: 'deal'
                                })
                                .lean();

	if (!product) return res.status(404).json({ message: `No product matches product ${id}!` }); 

    let productObj = product; 

    let productCategories = await CategoryProduct.find({ product: product?._id, deleted_at: null })
                                                .populate({ path: 'category' })
                                                .lean(); 

    let productImages = await ProductImage.find({ product: product?._id, deleted_at: null })
                                        .select('-product -deleted_at')
                                        .lean(); 

    let productInfo = await ProductInfo.find({ product: product?._id, deleted_at: null })
                                        .select('-product -deleted_at')
                                        .lean(); 

    let productFeatures = await ProductFeature.find({ product: product._id, deleted_at: null })
                                        .select('-product -deleted_at')
                                        .lean(); 

    let productDescriptions = await ProductDescription.find({ product: product._id, deleted_at: null })
                                        .select('-product -deleted_at')
                                        .lean(); 

    productObj.categories = productCategories; 
    productObj.images = productImages; 
    productObj.info = productInfo; 
    productObj.features = productFeatures; 
    productObj.descriptions = productDescriptions; 

	res.status(200).json({ data: productObj });
}); 

/**
 * UPDATE A PRODUCT
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { 
            // brand, 
            deal, 
            asin, 
            amazon_affiliate_link,
            title, 
            initial_retail_price, 
            retail_price,
            purchase_price, 
            info, 
            descriptions, 
            features, 
            categories } = req?.body; 

    const { id } = req?.params; 

    const session = await mongoose.startSession(); 
    session.startTransaction(); 

    try {
        const product = await Product.findOne({ _id: id }).exec(); 
        if (!product) return res.status(404).json({ message: "Product not found!" }); 

        // let brandExists;
        // if (brand) {
        //     brandExists = await Brand.findOne({ _id: brand }).lean(); 
        //     if (!brandExists) return res.status(404).json({ message: "Brand not found!" }); 
        // }

        let dealExists;
        if (deal) {
            dealExists = await Deal.findOne({ _id: deal }).lean(); 
            if (!dealExists) return res.status(404).json({ message: "Deal not found!" }); 
        }

        // if (brand) product.brand = brandExists?._id; 
        if (deal) product.deal = deal; 
        if (asin) product.asin = asin; 
        if (amazon_affiliate_link) product.amazon_affiliate_link = amazon_affiliate_link; 
        if (title) product.title = title; 
        if (slug) product.slug = slugIt(title + '-' + new Date().toISOString() );
        if (purchase_price) product.purchase_price = purchase_price; 
        if (initial_retail_price) product.initial_retail_price = initial_retail_price; 
        if (retail_price) product.retail_price = retail_price; 

        const info_array = JSON.parse(req?.body?.info || '[]');
        const descriptions_array = JSON.parse(req?.body?.descriptions || '[]');
        const features_array = JSON.parse(req?.body?.features || '[]');
        const categories_array = JSON.parse(req?.body?.categories || '[]');

        console.log(req?.files)

        /** Images Section */ 
        let imagesArray = []; 

        if (req?.files?.images) {
            // for (let { file, index } of validImages) {
            //     let productImageUpload = await cloudinaryImageUpload(file.tempFilePath, "deezysdeals_product_images");
            //     if (!productImageUpload) return res.status(400).json({ message: "Image upload failed" });

            //     await ProductImage.create({
            //         product: product._id, 
            //         image_index: index,
            //         image_path: {
            //             url: productImageUpload.secure_url, 
            //             public_id: productImageUpload.public_id
            //         }
            //     });

            //     imagesArray.push(productImageUpload.secure_url);
            // }

            await Promise.all(
                req?.files?.images?.map(async (file, index) => {
                    const productImageUpload = await cloudinaryImageUpload(file?.tempFilePath, "deezysdeals_product_images");

                    if (!productImageUpload) {
                        throw new Error("Image upload failed");
                    }

                    await ProductImage.create({
                        user: req?.user_id,
                        product: product._id,
                        image_index: index,
                        image_path: [
                            {
                                hi_res: {
                                    url: productImageUpload.secure_url,
                                    public_id: productImageUpload.public_id
                                },
                                // large: {
                                //     url: productImageUpload.secure_url,
                                //     public_id: productImageUpload.public_id
                                // },
                                // thumb: {
                                //     url: productImageUpload.secure_url,
                                //     public_id: productImageUpload.public_id
                                // },
                            }
                        ]
                    });

                    return imagesArray.push({
                        hi_res: productImageUpload.secure_url,
                        large: productImageUpload.secure_url,
                        thumb: productImageUpload.secure_url
                    });
                })
            );

            // const imagesArray = uploadImages; 

            // const updateProductImages = await Product.findOneAndUpdate(
            //     { _id: product._id },
            //     { $set: { images: imagesArray } },  // Replace the entire array with the new images
            //     { new: true }
            // );

            const addImagesToProduct = await Product.findOneAndUpdate(
                { _id: product._id }, 
                { $push: { images: { $each: imagesArray } } },
                { new: true } 
            ); 

            // product.images.push(...imagesArray);
        }
        /** End Images Section */

        /** Infos Section */ 
        if (req?.body?.info) {
            const dynamicInfoData = Object.fromEntries(
                info_array.map(item => [item.title, item.value])
            );

            const updateProductInfo = await ProductInfo.findOneAndUpdate(
                { product: product._id }, 
                { $set: { user: req?.user_id, dynamic_data: dynamicInfoData } },  
                { new: true, upsert: true } 
            );
        }
        /** End Infos Section */ 

        /** Descriptions Section */ 
        if (req?.body?.descriptions) {
            const validDescriptions = descriptions_array.filter(description => description != null);

            if (validDescriptions?.length > 0) {
                for (let i = 0; i < validDescriptions.length; i++) {
                    const description = validDescriptions[i];
                    const descriptionIndex = i + 1; 

                    const existingDescription = await ProductDescription.findOne({ product: product._id, description_index: descriptionIndex }).exec();

                    if (existingDescription) {
                        existingDescription.content = description;
                        await existingDescription.save();
                    } else {
                        await ProductDescription.create({
                            user: req?.user_id,
                            product: product._id,
                            // description_index: descriptionIndex, 
                            content: description,
                        });
                    }
                }
            } 
        }
        /** End of Descriptions Section */ 

        /** Features Section */ 
        if (req?.body?.features) {
            const validFeatures = features_array?.filter(feature => feature != null);

            if (validFeatures?.length > 0) {
                for (let i = 0; i < validFeatures.length; i++) {
                    const feature = validFeatures[i];
                    const featureIndex = i + 1; 

                    const existingFeature = await ProductFeature.findOne({ product: product._id, feature_index: featureIndex }).exec();

                    if (existingFeature) {
                        existingFeature.content = feature;
                        await existingFeature.save();
                    } else {
                        await ProductFeature.create({
                            user: req?.user_id,
                            product: product._id,
                            // feature_index: featureIndex, 
                            content: feature,
                        });
                    }
                }
            } 
        }
        /** End of Features Section */ 

        /** Categories Section */ 
        // console.log(brand)
        if (req?.body?.categories) {
            const validCategories = categories_array?.filter(category => category != null); 

            // let categoryExists; 

            if (validCategories?.length > 0) {
                for (let i = 0; i < validCategories.length; i++) {
                    const category = validCategories[i]; 
                    // console.log(validCategories); 
                    console.log('category', category); 

                    const categoryExists = await Category.findOne({ name: category }).lean();

                    if (categoryExists) {
                        let categoryProductExists = await CategoryProduct.findOne({ product: product._id, 
                                                                        category: categoryExists?._id }).lean();

                        if (!categoryProductExists) {
                            await CategoryProduct.create({
                                user: req?.user_id,
                                product: product._id, 
                                category: categoryExists?._id
                            });
                        }
                    }
                }
            } 
        }
        /** End of Categories Section */ 

        product.save()
                .then(() => { 
                    res.status(200).json({ success: `Product record updated.`, data: product });
                })
                .catch((error) => {
                    if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                });

    } catch(error) { 

        await session.abortTransaction(); 

        res.status(500).json({ message: "An error occured! Product not saved.", details: `${JSON.stringify(error)}` }); 

    } finally {

        session.endSession();

    }
}); 

/**
 * SOFT-DELETE A PRODUCT
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const product = await Product.findOne({ _id: id }).exec();

    if (!product) return res.status(404).json({ message: `No product matches the product ${id}!` }); 

    if (product.deleted_at == '') {
        product.deleted_at = new Date().toISOString();
        product.deleted_by = req?.user_id;
    }

    product.save()
        .then(() => { 
			res.status(200).json({ success: `Product record deleted.`, data: product });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED PRODUCT
 */
const restoreProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const product = await Product.findOne({ _id: id }).exec();

    if (!product) return res.status(404).json({ message: `No product matches the product ${id}!` }); 

    if (product.deleted_at != '') {
        product.deleted_at = '';
        product.deleted_by = '';
    };

    product.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product record restored.`, data: product });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A PRODUCT
 */
const destroyProduct = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const product = await Product.findOne({ _id: id }).exec();

	if (!product) return res.status(404).json({ message: `No product matches the product ${id}!` }); 

	await product.deleteOne(); 

	res.status(200).json({ success: `Product ${product?._id} has been permanently deleted.`, data: `${product}` });
}); 




/********************* */
/** ADDITIONAL METHODS */
/********************* */

/**
 * GET ALL PURCHASED PRODUCTS
 */
const getPurchasedProducts = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const products = await Product.find({ purchased_for_resale: true, 
                                        deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'brand', 
                                })
                                .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.countDocuments({ purchased_for_resale: true, deleted_at: null }); 

    let productsList = []; 

    const updateProductPromises = products?.map(async productItem => { 
        let foundProductImages = await ProductImage.find({ product: productItem?._id }).exec(); 
        productItem['product_images'] = foundProductImages; 

        let foundProductCategories = await CategoryProduct.find({ product: productItem?._id })
                                                        .select('-product -deleted_at')
                                                        .populate({
                                                            path: 'category', 
                                                            select: 'title description'
                                                        })
                                                        .lean(); 
        productItem['product_categories'] = foundProductCategories; 


        productsList.push(productItem); 
    }); 

    await Promise.all(updateProductPromises); 

	// res.json({ data: products }); 
    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productsList 
            });
}); 

/**
 * GET FROM EXTERNAL API AND ADD PRODUCT TO SHOP
 */
const addToShop = asyncHandler(async (req, res) => {
    const { id } = req?.params;

    const foundProduct = await Product.findOne({ asin: id });

    if (!foundProduct) {
        try {
            const options = {
                method: 'GET',
                url: 'https://parazun-amazon-data.p.rapidapi.com/product/',
                params: {
                    asin: id,
                    region: 'US'
                },
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json', 
                    'x-rapidapi-ua': 'RapidAPI-Playground', 
                    'x-rapidapi-key': process.env.VITE_X_RAPID_API_KEY,
                    'x-rapidapi-host': 'parazun-amazon-data.p.rapidapi.com'
                }
            };

            async function fetchData() {
                try {
                    const response = await axios.request(options);
                    console.log(response?.data);

                    /** Create new brand, if it does not exist */
                    const foundBrand = await Brand.findOne({ name: response?.data?.brand });

                    let newBrand;

                    if (!foundBrand) {
                        newBrand = await Brand.create({
                            user: req?.user_id,
                            name: response?.data?.brand,
                            slug: slugIt(response?.data?.brand + '-' + new Date().toISOString() ),
                        });
                    };
                    // console.log(newBrand);

                    /** Get Site Payment Charge Configuration */
                    const foundPaymentChargeConfiguration = await SitePaymentConfiguration.findOne({ initial_setup: true }); 

                    let computedInitialRetailPrice, computedRetailPrice;

                    if (foundPaymentChargeConfiguration) {
                        if (foundPaymentChargeConfiguration?.type == 'amount') {
                            computedInitialRetailPrice = response?.data?.price?.list_price
                                                        + foundPaymentChargeConfiguration?.unit; 
                            computedRetailPrice = (response?.data?.price?.amount ?? response?.data?.price?.list_price)
                                                    + foundPaymentChargeConfiguration?.unit;
                        } else if (foundPaymentChargeConfiguration?.type == 'percentage') {
                            computedInitialRetailPrice = response?.data?.price?.list_price
                                                        + ((foundPaymentChargeConfiguration?.unit/100) * response?.data?.price?.list_price); 
                            computedRetailPrice = (response?.data?.price?.amount ?? response?.data?.price?.list_price)
                                                + ((foundPaymentChargeConfiguration?.unit/100) * (response?.data?.price?.amount ?? response?.data?.price?.list_price)); 
                        }
                    }

                    /** Create new product, since it does not exist */ 
                    const newProduct = await Product.create({
                        asin: id,
                        user: req?.user_id,
                        brand: foundBrand?._id ?? newBrand?._id,
                        link: response?.data?.link,
                        title: response?.data?.title,
                        slug: slugIt(response?.data?.title + '-' + new Date().toISOString() ),
                        purchase_price: response?.data?.price?.amount ?? response?.data?.price?.list_price, 
                        // initial_retail_price: response?.data?.price?.list_price,
                        initial_retail_price: computedInitialRetailPrice ?? (response?.data?.price?.list_price + 20),
                        // retail_price: response?.data?.price?.amount ?? response?.data?.price?.list_price, 
                        retail_price: computedRetailPrice ?? ((response?.data?.price?.amount ?? response?.data?.price?.list_price) + 20), 
                        images: response?.data?.images,
                        purchased_from_amazon_market: true,
                    });

                    /** Create new product Image (order item image) */
                    if (response?.data?.images?.length > 0) {
                        const createImagePromises = response.data.images.map(async (image) => {
                            return await ProductImage.create({
                                user: req?.user_id,
                                product: newProduct._id,
                                image_path: {
                                    hi_res: {
                                        url: image?.hi_res
                                    },
                                    large: {
                                        url: image?.large
                                    },
                                    thumb: {
                                        url: image?.thumb
                                    }
                                }
                            });
                        });
                        
                        // Wait for all the image creations to complete
                        await Promise.all(createImagePromises);
                    }

                    /** Create new product description */
                    if (response?.data?.description?.length > 0) {
                        const createDescriptionPromises = response.data.description.map(async (descriptionUnit, index) => {
                            return await ProductDescription.create({
                                user: req?.user_id,
                                product: newProduct._id,
                                content: descriptionUnit,
                                description_index: index
                            });
                        });
                        
                        // Wait for all the description creations to complete
                        await Promise.all(createDescriptionPromises);
                    }

                    /** Create new product features */
                    if (response?.data?.features?.length > 0) {
                        const createFeaturePromises = response.data.features.map(async (feature, index) => {
                            return await ProductFeature.create({
                                user: req?.user_id,
                                product: newProduct._id,
                                content: feature,
                                feature_index: index
                            });
                        });
                        
                        // Wait for all the features creations to complete
                        await Promise.all(createFeaturePromises);
                    }

                    /** Create new product info */
                    if (response?.data?.info?.length > 0) {
                        const createInfoPromises = response.data.info.map(async (infoUnit, index) => {
                            return await ProductFeature.create({
                                user: req?.user_id,
                                product: newProduct._id,
                                content: infoUnit,
                                info_index: index
                            });
                        });
                        
                        // Wait for all the info creations to complete
                        await Promise.all(createInfoPromises);
                    }

                    const newProductInfo = await ProductInfo.create({
                        user: req?.user_id,
                        product: newProduct?._id, 
                        dynamic_data: new Map(Object.entries(response?.data?.info))
                    });

                    console.log('categories:', response?.data?.categories);
                    if (response?.data?.categories?.length > 0) {
                        const createCategoryPromises = response.data.categories.map(async (category, index) => {
                            const foundCategory = await Category.findOne({ name: category?.name });
                            
                            let newCategory;

                            console.log('category name:', category?.name);
                            /** Create new product category if it does not exist */
                            if (!foundCategory) {
                                return await Category.create({
                                    user: req?.user_id,
                                    name: category?.name,
                                    link: category?.link,
                                    node: category?.node
                                });
                            }

                            // if (newCategory?.length) {
                            //     return await CategoryProduct.create({
                            //         user: req?.user_id,
                            //         product: newProduct?._id, 
                            //         category: newCategory?._id
                            //     });
                            // }
                        });

                        // Wait for all the category-related promises to complete
                        await Promise.all(createCategoryPromises);
                    } else if (response?.data?.best_seller_rank?.length > 0) {
                        // best_seller_rank: [
                        //     {
                        //     category: 'Building Sets',
                        //     link: 'https://www.amazon.com/gp/bestsellers/toys-and-games/166099011/ref=pd_zg_hrsr_toys-and-games',
                        //     node_id: 166099011,
                        //     rank: 30
                        //     }
                        // ],

                        const createBestSellerCategoryPromises = response.data.best_seller_rank.map(async (rank, index) => {
                            const foundCategory = await Category.findOne({ name: rank?.category });
                            
                            let newCategory;

                            console.log('category name:', rank?.category);
                            /** Create new product category if it does not exist */
                            if (!foundCategory) {
                                newCategory = await Category.create({
                                    user: req?.user_id,
                                    name: rank?.category,
                                    link: rank?.link,
                                    node: rank?.node_id
                                });

                                return await CategoryProduct.create({
                                    user: req?.user_id,
                                    product: newProduct?._id, 
                                    category: newCategory?._id
                                });
                            }

                            // if (newCategory?.length) {
                            //     return await CategoryProduct.create({
                            //         user: req?.user_id,
                            //         product: newProduct?._id, 
                            //         category: newCategory?._id
                            //     });
                            // }
                        });

                        // Wait for all the category-related promises to complete
                        await Promise.all(createBestSellerCategoryPromises);
                    }

                    res.status(200).json({ success: `Product ${newProduct?._id} add successful.` });

                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Failed to add product to shop', error: `${error}` });
                }
            }

            fetchData();
        } catch (error) {
            res.status(500).json({ message: 'Failed to add product to shop', error: `${error}` });
        }
    } else {
        res.status(409).json({ message: 'Product already in shop' });
    }
});

const addToShop2 = asyncHandler(async (req, res) => {
    const { id } = req?.params; 

    async function fetchAndAddProduct() {
        try {
            // const response = await axios.get(`https://fakestoreapi.com/products/${id}`); 

            // /** Create new product, if does not exist */ 
            // const productFilter = { title: response?.data?.title }; 
            // const productUpdate = { user: req?.user_id, 
            //                         title: response?.data?.title, 
            //                         retail_price: response?.data?.price, 
            //                         images: [response?.data?.image] }; 

            // const upsertProduct = await Product.findOneAndUpdate(productFilter, productUpdate, {
            //     new: true,
            //     upsert: true 
            // }); 
            // console.log(upsertProduct); 

            // /** Create new product Image (order item image), if does not exist */ 
            // const productImageFilter = { 'image_path.url': response?.data?.image }; 
            // const productImageUpdate = { $set: { product: upsertProduct?._id,
            //                                     'image_path.$.url': response?.data?.image } }; 

            // const upsertProductImage = await ProductImage.findOneAndUpdate(productImageFilter, productImageUpdate, {
            //     new: true,
            //     upsert: true 
            // }); 
            // console.log(upsertProductImage); 

            // /** Create new category, if does not exist */ 
            // const categoryFilter = { name: response?.data?.category }; 
            // const categoryUpdate = { user: req?.user_id }; 

            // const upsertCategory = await Category.findOneAndUpdate(categoryFilter, categoryUpdate, {
            //     new: true, 
            //     upsert: true 
            // }); 
            // console.log(upsertCategory); 

            // /** Add the category product relationship if it does not exist */
            // const categoryProductFilter = { category: upsertCategory?._id, 
            //                                 product: upsertProduct?._id }; 
            // const categoryProductUpdate = { user: req?.user_id }; 

            // const upsertCategoryProduct = await CategoryProduct.findOneAndUpdate(categoryProductFilter, categoryProductUpdate, {
            //     new: true, upsert: true
            // }); 

            // res.status(200).json({ success: `Product ${id} add successful.` });

        } catch (error)  {
            res.status(500).json({ message: 'Failed to add product to shop' });
        }
    } 
    fetchAndAddProduct()
});

/**
 * MARK PRODUCT AS FEATURED
 */
const makeProductFeatured = asyncHandler(async (req, res) => {
    const { id } = req?.params;
    console.log(id)

    const foundProduct = await Product.findOne({ _id: id });
    if (!foundProduct) return res.status(404).json({ message: `No product matches the product ${id}!` });

    if (foundProduct?.featured == true) {
        foundProduct.featured = false;
    } else {
        foundProduct.featured = true;
    };

    foundProduct.save()
        .then(() => { 
			res.status(200).json({ success: `Product updated.`, data: foundProduct });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
})

/**
 * GET ALL SOLD PRODUCTS (PURCHASED PRODUCTS)
 */
const getSoldProducts = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

	const products = await Product.find({ purchased_for_resale: true, 
                                            sold_to_client: true, 
                                            deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'brand', 
                                        select: 'name web_address logo_path.url' 
                                    })
                                    .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.find({ purchased_for_resale: true, 
                                        sold_to_client: true, 
                                        deleted_at: null })
                                .countDocuments(); 

    let productsList = []; 

    const updateProductPromises = products?.map(async productItem => { 
        let foundProductImages = await ProductImage.find({ product: productItem?._id }).exec(); 
        productItem['product_images'] = foundProductImages; 

        let foundProductCategories = await CategoryProduct.find({ product: productItem?._id })
                                                        .select('-product -deleted_at')
                                                        .populate({
                                                            path: 'category', 
                                                            select: '_id title description'
                                                        })
                                                        .exec(); 
        productItem['product_categories'] = foundProductCategories; 


        productsList.push(productItem); 
    }); 

    await Promise.all(updateProductPromises); 

	// res.json({ data: products }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productsList 
            });
});


export { getProducts, 
		createProduct, 
		getProduct, 
		updateProduct, 
		deleteProduct, 
        restoreProduct, 
        destroyProduct, 
        
        getPurchasedProducts, 
        addToShop, 
        makeProductFeatured, 
        getSoldProducts }; 