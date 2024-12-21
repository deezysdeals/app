import asyncHandler from 'express-async-handler'; 
import Order from '../../models/Order.js'; 


/**
 * GET ALL PAYMENTS
 */ 
const getPayments = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const payments = await Order.find({ deleted_at: null, paid: true })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!payments?.length) return res.status(404).json({ message: "No payments found!" }); 

    const total = await Order.countDocuments({ deleted_at: null, paid: true }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: payments 
            });
}); 


export { getPayments }; 