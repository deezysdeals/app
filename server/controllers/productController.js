import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js';
import asyncHandler from 'express-async-handler'; 
import slug from 'slug';
const slugIt = slug; 
import Product from '../models/Product.js'; 
import CategoryProduct from '../models/CategoryProduct.js';
import ProductFeature from '../models/ProductFeature.js';
import ProductImage from '../models/ProductImage.js'; 
import ProductInfo from '../models/ProductInfo.js'; 
import ProductDescription from '../models/ProductDescription.js'; 
import mongoose from 'mongoose';


/**
 * GET ALL PRODUCTS
 */
const getProducts = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

	const products = await Product.find({ deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.find({ deleted_at: null }).countDocuments(); 

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

/**
 * CREATE PRODUCT
 */
const createProduct = asyncHandler(async (req, res) => { 
    console.log('request body', req?.body); 

    const { brand, 
            discount, 
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
            initial_retail_price, initial_retail_price_cents, 
            retail_price, retail_price_cents, 
            purchase_price, purchase_price_cents } = req?.body; 

    const session = await mongoose.startSession(); 
    session.startTransaction(); 

    try {
        /** Main Product Section */  
        const newProduct = await Product.create({
            user: req?.user_id, 
            brand, 
            discount, 
            asin: (asin ? asin : (new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)+(Date.now()))), 
            title, 
            slug: slugIt(title + '-' + new Date().toISOString() ),
            initial_retail_price: ((initial_retail_price * 100) + (initial_retail_price_cents)), 
            retail_price: ((retail_price * 100) + (retail_price_cents)), 
            purchase_price: ((purchase_price * 100) + (purchase_price_cents)), 
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

            // Save the valid feature to the ProductFeature model
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

                // Save the valid category to the ProductCategory model
                await ProductCategory.create({
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
		.lean();

	if (!product) return res.status(404).json({ message: `No product matches product ${id}!` });
	res.status(200).json({ data: product });
}); 

/**
 * UPDATE A PRODUCT
 */
const updateProduct = asyncHandler(async (req, res) => {
    const { brand, 
            discount, 
            category, 
            sub_category, 
            title, 
            description, 
            retail_price, 
            initial_discount_value } = req?.body; 

    const { id } = req?.params; 

    const product = await Product.findOne({ _id: id }).exec();
    if (!product) return res.status(404).json({ message: "Product not found!" }); 

    if (brand) product.brand = brand; 
    if (discount) product.discount = discount; 
    if (category) product.category = category; 
    if (sub_category) product.sub_category = sub_category; 
    if (title) product.title = title; 
    if (description) product.description = description; 
    if (retail_price) product.retail_price = retail_price; 
    if (initial_discount_value) product.initial_discount_value = initial_discount_value; 

    product.save()
        .then(() => { 
			res.status(200).json({ success: `Product record updated.`, data: product });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
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
                                        select: 'name web_address logo_path.url' 
                                    })
                                    .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.find({ purchased_for_resale: true, 
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
        getSoldProducts }; 