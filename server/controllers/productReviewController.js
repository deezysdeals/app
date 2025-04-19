import asyncHandler from 'express-async-handler'; 
import ProductReview from '../models/ProductReview.js'; 
import Product from '../models/Product.js';


/**
 * GET ALL PRODUCT REVIEWS
 */
const getProductReviews = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

    let productReviews; 
    let total; 
    let rating;
    
    if (req?.role == 'admin') { 
        if (req?.query?.stars != 'all') {
            const stars = parseInt(req.query.stars);
            if ([1, 2, 3, 4, 5].includes(stars)) {
                rating = stars; 
            } 

            productReviews = await ProductReview.find({ deleted_at: null, rating: rating })
                                                .sort('-created_at')
                                                .skip(skip)
                                                .limit(limit)
                                                .populate({
                                                    path: 'order', 
                                                })
                                                .populate({
                                                    path: 'order_item', 
                                                    select: 'product', 
                                                    populate: { 
                                                        path: 'product', 
                                                    }
                                                })
                                                .populate({
                                                    path: 'user', 
                                                    select: 'first_name last_name username' 
                                                })
                                                .lean(); 

             total = await ProductReview.find({ deleted_at: null, rating: rating }).countDocuments();
        } else if (req?.query?.stars == 'all') {
            productReviews = await ProductReview.find({ deleted_at: null })
                                                .sort('-created_at')
                                                .skip(skip)
                                                .limit(limit)
                                                .populate({
                                                    path: 'order', 
                                                })
                                                .populate({
                                                    path: 'order_item', 
                                                    select: 'product', 
                                                    populate: { 
                                                        path: 'product', 
                                                    }
                                                })
                                                .populate({
                                                    path: 'user', 
                                                    select: 'first_name last_name username' 
                                                })
                                                .lean(); 

             total = await ProductReview.find({ deleted_at: null }).countDocuments();
        }

    } else { 
        if (req?.query?.stars != 'all') {
            const stars = parseInt(req.query.stars);
            if ([1, 2, 3, 4, 5].includes(stars)) {
                rating = stars; 
            } 

            productReviews = await ProductReview.find({ deleted_at: null, 
                                                        rating: rating, 
                                                        user: req?.user_id })
                                                .sort('-created_at')
                                                .skip(skip)
                                                .limit(limit)
                                                .populate({
                                                    path: 'order', 
                                                })
                                                .populate({
                                                    path: 'order_item', 
                                                    select: 'product', 
                                                    populate: { 
                                                        path: 'product', 
                                                    }
                                                })
                                                .populate({
                                                    path: 'user', 
                                                    select: 'first_name last_name username' 
                                                })
                                                .lean(); 

            total = await ProductReview.find({ deleted_at: null, rating: rating, user: req?.user_id }).countDocuments(); 
        } else if (req?.query?.stars == 'all') {
            const stars = parseInt(req.query.stars);
            if ([1, 2, 3, 4, 5].includes(stars)) {
                rating = stars; 
            } 

            productReviews = await ProductReview.find({ deleted_at: null, 
                                                        user: req?.user_id })
                                                .sort('-created_at')
                                                .skip(skip)
                                                .limit(limit)
                                                .populate({
                                                    path: 'order', 
                                                })
                                                .populate({
                                                    path: 'order_item', 
                                                    select: 'product', 
                                                    populate: { 
                                                        path: 'product', 
                                                    }
                                                })
                                                .populate({
                                                    path: 'user', 
                                                    select: 'first_name last_name username' 
                                                })
                                                .lean(); 

            total = await ProductReview.find({ deleted_at: null, user: req?.user_id }).countDocuments(); 
        }
    }
        
    // if (!productReviews?.length) return res.status(404).json({ message: "No product reviews found!" }); 
    // if (total === 0) {
    if (!productReviews?.length) {
        return res.status(404).json({ message: "No product reviews found!" }); 
    } else {
        res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productReviews 
            });
    }
});

/**
 * CREATE PRODUCT REVIEW
 */
const createProductReview = asyncHandler(async (req, res) => {
    const { product, 
            order, 
            order_item, 
            title, 
            content, 
            rating } = req?.body; 

    const productReviewExists = await ProductReview.findOne({ product: product, 
                                                                order: order, 
                                                                order_item: order_item, 
                                                                user: req?.user_id, 
                                                                deleted_at: null
                                                            }).lean(); 

    if (productReviewExists) return res.status(409).json({ message: "A review already exists for this item. You can delete the already existing review to create a new one!" }); 

    /** Create new product, if does not exist */ 
    let productUpdate;
    const productFilter = { _id: product }; 
    if (rating == 5) 
        productUpdate = { $inc: { total_rating_value: 5, total_rating_count: 1, five_star_rating_count: 1 } }; 
    if (rating == 4) 
        productUpdate = { $inc: { total_rating_value: 4, total_rating_count: 1, four_star_rating_count: 1 } }; 
    if (rating == 3) 
        productUpdate = { $inc: { total_rating_value: 3, total_rating_count: 1, three_star_rating_count: 1 } }; 
    if (rating == 2) 
        productUpdate = { $inc: { total_rating_value: 2, total_rating_count: 1, two_star_rating_count: 1 } }; 
    if (rating == 1) 
        productUpdate = { $inc: { total_rating_value: 1, total_rating_count: 1, one_star_rating_count: 1 } }; 

    const updateProduct = await Product.findOneAndUpdate(productFilter, productUpdate, {
        new: true
    }); 
    if (!updateProduct) return res.status(404).json({ message: 'Product not found' });
    // console.log(updateProduct); 

    const productReview = new ProductReview({
        user: req?.user_id, 
        product, 
        order, 
        order_item, 
        title, 
        content, 
        rating 
    }); 

    productReview.save()
        .then(() => {
            res.status(201).json({ success: `ProductReview ${productReview._id} added`, data: productReview });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * GET A PRODUCT REVIEW
 */
const getProductReview = asyncHandler(async (req, res) => { 
    const { id } = req?.params;
	const productReview = await ProductReview.findOne({ _id: id })
		.select(['-created_at', '-updated_at', '-deleted_at'])
		.lean();

	if (!productReview) return res.status(404).json({ message: `No productReview matches productReview ${id}!` });
	res.status(200).json({ data: productReview });
}); 

/**
 * UPDATE A PRODUCT REVIEW
 */
const updateProductReview = asyncHandler(async (req, res) => {
    const { product, 
            product_unit, 
            title, 
            content, 
            rating } = req?.body; 

    const { id } = req?.params; 

    const productReview = await ProductReview.findOne({ _id: id }).exec();
    if (!productReview) return res.status(404).json({ message: "Product review not found!" }); 

    if (product) productReview.product = product; 
    if (product_unit) productReview.product_unit = product_unit; 
    if (title) productReview.title = title;  
    if (content) productReview.content = content;  
    if (rating) productReview.rating = rating;  

    productReview.save()
        .then(() => { 
			res.status(200).json({ success: `Product review record updated.`, data: productReview });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * SOFT-DELETE A PRODUCT REVIEW
 */
const deleteProductReview = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productReview = await ProductReview.findOne({ _id: id }).exec();

    if (!productReview) return res.status(404).json({ message: `No product review matches the product review ${id}!` }); 

    if (productReview.deleted_at == '' || productReview.deleted_at == null) {
        productReview.deleted_at = new Date().toISOString();
        productReview.deleted_by = req?.user_id;
    }

    productReview.save()
        .then(() => { 
			res.status(200).json({ success: `Product review record deleted.`, data: productReview });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED PRODUCT REVIEW
 */
const restoreProductReview = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productReview = await ProductReview.findOne({ _id: id }).exec();

    if (!productReview) return res.status(404).json({ message: `No product review matches the product review ${id}!` }); 

    if (productReview.deleted_at != '' && productReview.deleted_at != null) {
        productReview.deleted_at = '';
        productReview.deleted_by = '';
    };

    productReview.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted product review record restored.`, data: productReview });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A PRODUCT REVIEW
 */
const destroyProductReview = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const productReview = await ProductReview.findOne({ _id: id }).exec();

	if (!productReview) return res.status(404).json({ message: `No product review matches the product review ${id}!` }); 

	await productReview.deleteOne(); 

	res.status(200).json({ success: `Product review ${productReview?._id} has been permanently deleted.`, data: `${productReview}` });
}); 


export { getProductReviews, 
		createProductReview, 
		getProductReview, 
		updateProductReview, 
		deleteProductReview, 
        restoreProductReview, 
        destroyProductReview }; 