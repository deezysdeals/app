import asyncHandler from 'express-async-handler'; 
import Product from '../../../models/Product.js'; 
import { getYesterdayDateRange, 
        getTodayDateRange, 
        getPreviousWeekDateRange, 
        getCurrentWeekDateRange } from '../../../utils/date_range.js'; 
/** Initialising Date Range Manipulation Functions */ 
const { yesterdayStart, yesterdayEnd } = getYesterdayDateRange(); 
const { todayStart, todayEnd } = getTodayDateRange(); 
const { lastWeekStart, lastWeekEnd } = getPreviousWeekDateRange(); 
const { weekStart, weekEnd } = getCurrentWeekDateRange(); 
/** End of Initialising Date Range Manipulation Functions */


/**
 * GET ALL TRENDINGS
 */ 
const getTrendings = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    // const trendings = await Product.find({ deleted_at: null })
    const trendings = await Product.find({ deleted_at: null, purchased_for_resale: true })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'user',
                                    select: 'first_name last_name username'
                                })
                                .lean(); 
    if (!trendings?.length) return res.status(404).json({ message: "No trendings found!" }); 

    // const total = await Product.countDocuments({ deleted_at: null }); 
    const total = await Product.countDocuments({ deleted_at: null, purchased_for_resale: true }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: trendings 
            });
}); 

/**
 * GET MINI TRENDINGS
 */ 
const getMiniTrendings = asyncHandler(async (req, res) => {
    // const trendings = await Product.find({ deleted_at: null })
    //                                 .sort({ order_count: -1, updated_at: -1 })
    //                                 .limit(3)
    //                                 .lean(); 

    const trendings = await Product.aggregate([ {
                                                    $match: {
                                                        deleted_at: null,
                                                        order_count: { $gt: 5 }
                                                    }
                                                },
                                                {
                                                    $sort: {
                                                        updated_at: -1
                                                    }
                                                },
                                                {
                                                    $limit: 3
                                                } ]);

    if (!trendings?.length) return res.status(404).json({ message: "No trendings found!" }); 

    res.json({ data: trendings });
}); 


export { getTrendings, getMiniTrendings }