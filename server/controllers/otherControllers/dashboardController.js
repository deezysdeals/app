import asyncHandler from 'express-async-handler'; 
import Order from '../../models/Order.js'; 
import ProductReview from '../../models/ProductReview.js';
import Product from '../../models/Product.js'; 
import SignInAttempt from '../../models/SignInAttempt.js'; 
import User from '../../models/User.js';
import { getYesterdayDateRange, 
        getTodayDateRange, 
        getPreviousWeekDateRange, 
        getCurrentWeekDateRange, 
        getPreviousMonthDateRange,
        getCurrentMonthDateRange, 
        getPreviousYearDateRange, 
        getCurrentYearDateRange } from '../../utils/date_range.js'; 
/** Initialising Date Range Manipulation Functions */ 
const { yesterdayStart, yesterdayEnd } = getYesterdayDateRange(); 
const { todayStart, todayEnd } = getTodayDateRange(); 
const { lastWeekStart, lastWeekEnd } = getPreviousWeekDateRange(); 
const { weekStart, weekEnd } = getCurrentWeekDateRange(); 
const { lastMonthStart, lastMonthEnd } = getPreviousMonthDateRange();
const { monthStart, monthEnd } = getCurrentMonthDateRange(); 
const { lastYearStart, lastYearEnd } = getPreviousYearDateRange(); 
const { yearStart, yearEnd } = getCurrentYearDateRange(); 
/** End of Initialising Date Range Manipulation Functions */


/**
 * GET ALL ORDERS
 */
const getOrders = asyncHandler(async (req, res) => {
    const range = req?.query?.range; 

    /** Orders sum and count */
    let totalPaid, totalPaidPrevious, ordersCount, ordersCountPrevious;   

    const rangeStart = (range == 'today') ? todayStart 
                        : (range == 'this-week') ? weekStart 
                        : (range == 'this-month') ? monthStart 
                        : (range == 'this-year') ? yearStart 
                        : 'all' 
    const previousRangeStart = (range == 'today') ? yesterdayStart 
                                : (range == 'this-week') ? lastWeekStart
                                : (range == 'this-month') ? lastMonthStart 
                                : (range == 'this-year') ? lastYearStart
                                : 'all'

    const rangeEnd = (range == 'today') ? todayEnd 
                        : (range == 'this-week') ? weekEnd
                        : (range == 'this-month') ? monthEnd 
                        : (range == 'this-year') ? yearEnd 
                        : 'all' 
    const previousRangeEnd = (range == 'today') ? yesterdayEnd 
                                : (range == 'this-week') ? lastWeekEnd
                                : (range == 'this-month') ? lastMonthEnd 
                                : (range == 'this-year') ? lastYearEnd 
                                : 'all' 

    /** Auth User */
    const userFound = await User.findOne({ _id: req?.user_id }).lean(); 
    /** End of Auth User */

    async function calculateTotalAmount() {
        try {
            let total, totalPrevious;

            if ((userFound?.role != 'admin') && (userFound?.role != 'dispatcher')) { 
                if ((range == 'today') || (range == 'this-week') || (range == 'this-month') || (range == 'this-year')) {
                    /** Current */
                    total = await Order.aggregate([
                        {
                            $match: { deleted_at: null, 
                                    user: userFound?._id, 
                                    created_at: { $gte: rangeStart, $lte: rangeEnd } }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCount = await Order.find({ deleted_at: null, 
                                                    user: userFound?._id, 
                                                    created_at: { $gte: rangeStart, 
                                                                $lte: rangeEnd } }).countDocuments(); 
                    /** End of Current */
                    /** Previous */
                    totalPrevious = await Order.aggregate([
                        {
                            $match: { deleted_at: null, 
                                    user: userFound?._id, 
                                    created_at: { $gte: previousRangeStart, $lte: previousRangeEnd } }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCountPrevious = await Order.find({ deleted_at: null, 
                                                    user: userFound?._id, 
                                                    created_at: { $gte: previousRangeStart, 
                                                                $lte: previousRangeEnd } }).countDocuments(); 
                    /** End of Previous */
                } else {
                    total = await Order.aggregate([
                        {
                            $match: { deleted_at: null, 
                                    user: userFound?._id }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCount = await Order.find({ deleted_at: null, 
                                                    user: userFound?._id }).countDocuments(); 
                }
                
            } else {
                if ((range == 'today') || (range == 'this-week') || (range == 'this-month') || (range == 'this-year')) {
                    /** Current */
                    total = await Order.aggregate([
                        {
                            $match: { deleted_at: null, 
                                    created_at: { $gte: rangeStart, $lte: rangeEnd } }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCount = await Order.find({ deleted_at: null,
                                                    created_at: { $gte: rangeStart, 
                                                                $lte: rangeEnd } }).countDocuments(); 
                    /** End of Current */
                    /** Previous */
                    totalPrevious = await Order.aggregate([
                        {
                            $match: { deleted_at: null, 
                                    created_at: { $gte: previousRangeStart, $lte: previousRangeEnd } }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCountPrevious = await Order.find({ deleted_at: null,
                                                    created_at: { $gte: previousRangeStart, 
                                                                $lte: previousRangeEnd } }).countDocuments(); 
                    /** End of Previous */
                } else {
                    total = await Order.aggregate([
                        {
                            $match: { deleted_at: null }
                        },
                        {
                            $group: {
                                _id: null, 
                                totalAmount: { $sum: "$total_to_be_paid" }
                            }
                        }
                    ]); 
                    ordersCount = await Order.find({ deleted_at: null }).countDocuments(); 
                }
            }
            
            totalPaid = total?.length > 0 ? total[0].totalAmount : 0;
            console.log('Total Amount:', totalPaid);
            totalPaidPrevious = totalPrevious?.length > 0 ? totalPrevious[0].totalAmount : 0;
            console.log('Total Amount Previous:', totalPaidPrevious);
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    } 
    await calculateTotalAmount(); 
    /** End of Orders sum and count */ 

    /** Getting the top Orders */ 
    async function getTopThreeHighestValues() {
        try {
            const topThreeOrders = await Order.find()
                .sort({ total_to_be_paid: -1 }) 
                .limit(3) 
                .populate({
                    path: 'user', 
                    select: 'first_name last_name username user_image_path' 
                })
                .lean(); 
            
            return topThreeOrders;
        } catch (error) {
            console.error('Error retrieving top three highest total_to_be_paid values:', error);
        }
    }

    let topThreeOrders; 
    
    await getTopThreeHighestValues().then(orders => {
        topThreeOrders = orders; 
    });
    // console.log('yes',topThreeOrders)
    /** End of Getting the top Orders */ 

    res.json({ data: { total_results: ordersCount, 
                        total_amount: { total_paid: totalPaid, 
                                        total_paid_previous: totalPaidPrevious }, 
                        top_3: topThreeOrders
            }});
}); 


/**
 * GET ALL PURCHASES
 */
const getPurchases = asyncHandler(async (req, res) => {
    const range = req?.query?.range; 

    /** Purchases sum and count */
    let totalPaid, totalPaidPrevious, purchasesCount, purchasesCountPrevious; 

    const rangeStart = (range == 'today') ? todayStart 
                        : (range == 'this-week') ? weekStart 
                        : (range == 'this-month') ? monthStart 
                        : (range == 'this-year') ? yearStart 
                        : 'all' 
    const previousRangeStart = (range == 'today') ? yesterdayStart 
                                : (range == 'this-week') ? lastWeekStart
                                : (range == 'this-month') ? lastMonthStart 
                                : (range == 'this-year') ? lastYearStart
                                : 'all'

    const rangeEnd = (range == 'today') ? todayEnd 
                        : (range == 'this-week') ? weekEnd
                        : (range == 'this-month') ? monthEnd 
                        : (range == 'this-year') ? yearEnd 
                        : 'all' 
    const previousRangeEnd = (range == 'today') ? yesterdayEnd 
                                : (range == 'this-week') ? lastWeekEnd
                                : (range == 'this-month') ? lastMonthEnd 
                                : (range == 'this-year') ? lastYearEnd 
                                : 'all' 

    async function calculateTotalAmount() {
        try {
            let total, totalPrevious;

            if ((range == 'today') || (range == 'this-week') || (range == 'this-month') || (range == 'this-year')) {
                /** Current */
                total = await Product.aggregate([
                    {
                        $match: { deleted_at: null, 
                                // purchase_price: { $exists: true }, 
                                purchased_for_resale: true, 
                                created_at: { $gte: rangeStart, $lte: rangeEnd } }
                    },
                    {
                        $group: {
                            _id: null, 
                            totalAmount: { $sum: "$purchase_price" }
                        }
                    }
                ]); 
                purchasesCount = await Product.find({ deleted_at: null, 
                                                    // purchase_price: { $exists: true }, 
                                                    purchased_for_resale: true, 
                                                    created_at: { $gte: rangeStart, 
                                                                $lte: rangeEnd } }).countDocuments(); 
                /** End of Current */
                /** Previous */
                totalPrevious = await Product.aggregate([
                    {
                        $match: { deleted_at: null, 
                                // purchase_price: { $exists: true }, 
                                purchased_for_resale: true, 
                                created_at: { $gte: previousRangeStart, $lte: previousRangeEnd } }
                    },
                    {
                        $group: {
                            _id: null, 
                            totalAmount: { $sum: "$purchase_price" }
                        }
                    }
                ]); 
                purchasesCountPrevious = await Product.find({ deleted_at: null, 
                                                            // purchase_price: { $exists: true }, 
                                                            purchased_for_resale: true, 
                                                            created_at: { $gte: previousRangeStart, 
                                                                        $lte: previousRangeEnd } }).countDocuments(); 
                /** End of Previous */
            } else {
                total = await Product.aggregate([
                    {
                        // $match: { deleted_at: null, purchase_price: { $exists: true } }
                        $match: { deleted_at: null, purchased_for_resale: true }
                    },
                    {
                        $group: {
                            _id: null, 
                            totalAmount: { $sum: "$purchase_price" }
                        }
                    }
                ]); 
                purchasesCount = await Product.find({ deleted_at: null, 
                                                    // purchase_price: { $exists: true },  }).countDocuments(); 
                                                    purchased_for_resale: true }).countDocuments(); 
            }
            
            totalPaid = total?.length > 0 ? total[0].totalAmount : 0;
            console.log('Total Amount:', totalPaid);
            totalPaidPrevious = totalPrevious?.length > 0 ? totalPrevious[0].totalAmount : 0;
            console.log('Total Amount Previous:', totalPaidPrevious);
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    } 
    await calculateTotalAmount(); 
    /** End of Purchases sum and count */ 

    res.json({ data: { total_results: purchasesCount, 
                        total_amount: { total_paid: totalPaid, 
                                        total_paid_previous: totalPaidPrevious }
            }});
}); 


/**
 * GET ALL CHECK-INS
 */
const getCheckIns = asyncHandler(async (req, res) => {
    const range = req?.query?.range; 

    /** Check-Ins Count */ 
    let checkInsCount, checkInsCountPrevious; 
    const rangeStart = (range == 'today') ? todayStart 
                        : (range == 'this-week') ? weekStart 
                        : (range == 'this-month') ? monthStart 
                        : (range == 'this-year') ? yearStart 
                        : 'all' 
    const previousRangeStart = (range == 'today') ? yesterdayStart 
                                : (range == 'this-week') ? lastWeekStart
                                : (range == 'this-month') ? lastMonthStart 
                                : (range == 'this-year') ? lastYearStart
                                : 'all'

    const rangeEnd = (range == 'today') ? todayEnd 
                        : (range == 'this-week') ? weekEnd
                        : (range == 'this-month') ? monthEnd 
                        : (range == 'this-year') ? yearEnd 
                        : 'all' 
    const previousRangeEnd = (range == 'today') ? yesterdayEnd 
                                : (range == 'this-week') ? lastWeekEnd
                                : (range == 'this-month') ? lastMonthEnd 
                                : (range == 'this-year') ? lastYearEnd 
                                : 'all' 

    async function calculateTotalAmount() {
        try {
            if ((range == 'today') || (range == 'this-week') || (range == 'this-month') || (range == 'this-year')) {
                /** Current */
                checkInsCount = await SignInAttempt.find({ deleted_at: null,
                                                            created_at: { $gte: rangeStart, 
                                                                        $lte: rangeEnd } }).countDocuments(); 
                /** End of Current */
                /** Previous */
                checkInsCountPrevious = await SignInAttempt.find({ deleted_at: null,
                                                                    created_at: { $gte: previousRangeStart, 
                                                                                $lte: previousRangeEnd } }).countDocuments(); 
                /** End of Previous */
            } else {
                checkInsCount = await SignInAttempt.find({ deleted_at: null }).countDocuments(); 
                checkInsCountPrevious = 0; 
            }
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    } 
    await calculateTotalAmount(); 
    /** End of Check-Ins Count */ 

    res.json({ data: { total_results: checkInsCount,  
                        total_amount: { check_ins: checkInsCount, 
                                        check_ins_previous: checkInsCountPrevious }
            }});
}); 


/**
 * GET CLIENTS GROWTH
 */
const getClientsGrowth = asyncHandler(async (req, res) => { 
    const range = req?.query?.range; 

    /** Clients Count */ 
    let clientsCount, clientsCountPrevious; 
    const rangeStart = (range == 'today') ? todayStart 
                        : (range == 'this-week') ? weekStart 
                        : (range == 'this-month') ? monthStart 
                        : (range == 'this-year') ? yearStart 
                        : 'all' 
    const previousRangeStart = (range == 'today') ? yesterdayStart 
                                : (range == 'this-week') ? lastWeekStart
                                : (range == 'this-month') ? lastMonthStart 
                                : (range == 'this-year') ? lastYearStart
                                : 'all'

    const rangeEnd = (range == 'today') ? todayEnd 
                        : (range == 'this-week') ? weekEnd
                        : (range == 'this-month') ? monthEnd 
                        : (range == 'this-year') ? yearEnd 
                        : 'all' 
    const previousRangeEnd = (range == 'today') ? yesterdayEnd 
                                : (range == 'this-week') ? lastWeekEnd
                                : (range == 'this-month') ? lastMonthEnd 
                                : (range == 'this-year') ? lastYearEnd 
                                : 'all' 

    async function calculateTotalAmount() {
        try {
            if ((range == 'today') || (range == 'this-week') || (range == 'this-month') || (range == 'this-year')) {
                /** Current */
                clientsCount = await User.find({ deleted_at: null,
                                                created_at: { $gte: rangeStart, 
                                                            $lte: rangeEnd } }).countDocuments(); 
                /** End of Current */
                /** Previous */
                clientsCountPrevious = await User.find({ deleted_at: null,
                                                        created_at: { $gte: previousRangeStart, 
                                                                    $lte: previousRangeEnd } }).countDocuments(); 
                /** End of Previous */
            } else {
                clientsCount = await User.find({ deleted_at: null }).countDocuments(); 
                clientsCountPrevious = 0;
            }
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    } 
    await calculateTotalAmount(); 
    /** End of Clients Count */ 

    console.log('Client Count', clientsCount)

    res.json({ data: { total_results: clientsCount,  
                        total_amount: { clients: clientsCount, 
                                        clients_previous: clientsCountPrevious }
            }}); 
}); 


/**
 * GET ALL RATINGS
 */ 
const getRatings = asyncHandler(async (req, res) => {
    const range = req?.query?.range; 

    /** Ratings Count */ 
    let ratingsCount = {}, ratingsCountPrevious = {}; 
    const rangeStart = (range == 'today') ? todayStart 
                        : (range == 'this-week') ? weekStart 
                        : (range == 'this-month') ? monthStart 
                        : (range == 'this-year') ? yearStart 
                        : 'all' 
    const previousRangeStart = (range == 'today') ? yesterdayStart 
                                : (range == 'this-week') ? lastWeekStart
                                : (range == 'this-month') ? lastMonthStart 
                                : (range == 'this-year') ? lastYearStart
                                : 'all'

    const rangeEnd = (range == 'today') ? todayEnd 
                        : (range == 'this-week') ? weekEnd
                        : (range == 'this-month') ? monthEnd 
                        : (range == 'this-year') ? yearEnd 
                        : 'all' 
    const previousRangeEnd = (range == 'today') ? yesterdayEnd 
                                : (range == 'this-week') ? lastWeekEnd
                                : (range == 'this-month') ? lastMonthEnd 
                                : (range == 'this-year') ? lastYearEnd 
                                : 'all' 

    async function calculateTotalAmount() {
        try {
            if ((range == 'this-week') || (range == 'this-month') || (range == 'this-year') || (range == 'today')) {
                const getRatingCount = async (rating, start, end) => {
                    return await ProductReview.find({
                        deleted_at: null,
                        rating: rating,
                        created_at: { $gte: start, $lte: end }
                    }).countDocuments();
                };

                const ratings = [5, 4, 3, 2, 1]; 

                for (let rating of ratings) {
                    /** Current ratings count */ 
                    ratingsCount[`${rating}_star`] = await getRatingCount(rating, rangeStart, rangeEnd);
                    
                    /** Previous ratings count */ 
                    ratingsCountPrevious[`${rating}_star`] = await getRatingCount(rating, previousRangeStart, previousRangeEnd);
                }

            } else {
                ratingsCount.five_star = await ProductReview.find({ deleted_at: null, rating: 5 }).countDocuments(); 
                ratingsCount.four_star = await ProductReview.find({ deleted_at: null, rating: 4 }).countDocuments(); 
                ratingsCount.three_star = await ProductReview.find({ deleted_at: null, rating: 3 }).countDocuments(); 
                ratingsCount.two_star = await ProductReview.find({ deleted_at: null, rating: 2 }).countDocuments(); 
                ratingsCount.one_star = await ProductReview.find({ deleted_at: null, rating: 1 }).countDocuments(); 
            }
        } catch (error) {
            console.error('Error calculating total amount:', error);
        }
    } 
    await calculateTotalAmount(); 
    /** End of Ratings Count */ 


    res.json({ data: { total_results: ratingsCount,  
                        total_amount: { ratings: ratingsCount, 
                                        ratings_previous: ratingsCountPrevious }
            }}); 
}); 


export { getOrders, 
        getPurchases, 
        getCheckIns, 
        getClientsGrowth, 
        getRatings }; 