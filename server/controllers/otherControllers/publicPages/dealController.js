import asyncHandler from 'express-async-handler'; 
import Product from '../../../models/Product.js'; 
import Deal from '../../../models/Deal.js'; 


const getDealProducts = asyncHandler (async (req, res) => {
    const deal = req?.params?.deal; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

	const products = await Product.find({ deal: deal, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .lean(); 
    if (!products?.length) return res.status(404).json({ message: "No products found!" }); 

    const total = await Product.countDocuments({ deleted_at: null });

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


export { getDealProducts }