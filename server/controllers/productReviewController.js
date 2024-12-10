import asyncHandler from 'express-async-handler'; 
import ProductReview from '../models/ProductReview.js'; 


const getProductReviews = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 

    const skip = (current_page - 1) * limit; 

    // console.log(req?.query) 
    // console.log('cookies', req?.cookies); 
    // console.log('decoded', jwt.verify(req?.cookies?.jwt, process.env.JWT_SECRET));
    // console.log('Logged out')

    let productReviews; 
    let total; 

    /** Query building */
    const queryforNonAdmin = {
        user: req?.user_id,
        deleted_at: null,
    };
    if (req?.query?.stars != null) {
        const stars = parseInt(req.query.stars);
        if ([1, 2, 3, 4, 5].includes(stars)) {
            queryforNonAdmin.rating = stars; 
        }
    } 

    const queryforAdmin = {
        deleted_at: null,
    };
    if (req?.query?.stars != null) {
        const stars = parseInt(req.query.stars);
        if ([1, 2, 3, 4, 5].includes(stars)) {
            queryforAdmin.rating = stars; 
        }
    } 
    /** End of Query building */
    
    if (req?.role != 'admin') {
        productReviews = await ProductReview.find(queryforNonAdmin)
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

        total = await ProductReview.find(queryforNonAdmin).countDocuments(); 

    } else {
        productReviews = await ProductReview.find(queryforAdmin)
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

        total = await ProductReview.find(queryforAdmin).countDocuments();
    }
        
    if (!productReviews?.length) return res.status(404).json({ message: "No product reviews found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productReviews 
            });
});

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
                                                                user: req?.user_id
                                                            }).lean(); 

    if (productReviewExists) return res.status(409).json({ message: "A review already exists for this item. You can delete the already existing review to create a new one!" })

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

const getProductReview = asyncHandler(async (req, res) => { 
    const { id } = req?.params;
	const productReview = await ProductReview.findOne({ _id: id })
		.select(['-created_at', '-updated_at', '-deleted_at'])
		.lean();

	if (!productReview) return res.status(404).json({ message: `No productReview matches productReview ${id}!` });
	res.status(200).json({ data: productReview });
}); 

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

const deleteProductReview = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productReview = await ProductReview.findOne({ _id: id }).exec();

    if (!productReview) return res.status(404).json({ message: `No product review matches the product review ${id}!` }); 

    if (productReview.deleted_at == '') {
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

const restoreProductReview = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const productReview = await ProductReview.findOne({ _id: id }).exec();

    if (!productReview) return res.status(404).json({ message: `No product review matches the product review ${id}!` }); 

    if (productReview.deleted_at != '') {
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