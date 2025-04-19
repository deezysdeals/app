import asyncHandler from 'express-async-handler'; 
import Product from '../../models/Product.js'; 


/**
 * GET ALL PURCHASES
 */ 
const getPurchases = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    // const purchases = await Product.find({ deleted_at: null })
    const purchases = await Product.find({ deleted_at: null, purchased_for_resale: true })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!purchases?.length) return res.status(404).json({ message: "No purchases found!" }); 

    // const total = await Product.countDocuments({ deleted_at: null }); 
    const total = await Product.countDocuments({ deleted_at: null, purchased_for_resale: true }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: purchases 
            });
}); 


export { getPurchases }