import asyncHandler from 'express-async-handler'; 
import Order from '../../models/Order.js'; 
import OrderItem from '../../models/OrderItem.js'; 


/**
 * GET ALL SALES
 */ 
const getSales = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const sales = await OrderItem.find({ deleted_at: null, order_paid: true })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'product',
                            })
                            .populate({
                                path: 'order',
                            })
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!sales?.length) return res.status(404).json({ message: "No sales found!" }); 

    const total = await OrderItem.countDocuments({ deleted_at: null, order_paid: true }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: sales 
            });
}); 


export { getSales }