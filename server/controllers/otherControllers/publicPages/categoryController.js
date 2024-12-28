import asyncHandler from 'express-async-handler'; 
import Product from '../../../models/Product.js'; 
import Category from '../../../models/Category.js'; 
import CategoryProduct from '../../../models/CategoryProduct.js'; 


const getCategoriesPublicVersion = asyncHandler (async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const categories = await Category.find({ deleted_at: null })
                                .sort('-updated_at')
                                .skip(skip)
                                .limit(limit)
                                .lean(); 
    if (!categories?.length) return res.status(404).json({ message: "No categories found!" }); 

    const total = await Category.countDocuments({ deleted_at: null });

	res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: categories 
            });
}); 

const getPopularCategories = asyncHandler (async (req, res) => {
    const limit = 20; 

    const categories = await Category.find({ deleted_at: null })
                                    .sort({ order_count: -1 })
                                    .limit(limit)
                                    .lean(); 

    if (!categories?.length) return res.status(404).json({ message: "No popular categories found!" }); 

    res.json({ data: categories }); 
});

const getCategoryProducts = asyncHandler (async (req, res) => {
    const category = req?.params?.category; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const products = await CategoryProduct.find({ category: category, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'product', 
                                })
                                .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await CategoryProduct.countDocuments({ deleted_at: null });

	// res.json({ data: products }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: products 
            });
}); 


export { getCategoriesPublicVersion, 
        getPopularCategories, 
        getCategoryProducts }