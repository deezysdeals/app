import asyncHandler from 'express-async-handler'; 
import Order from '../../models/Order.js'; 
import OrderItem from '../../models/OrderItem.js'; 


/**
 * GET ALL DELIVERIES
 */
const getDeliveries = asyncHandler(async (req, res) => {
    const deliveryStatus = req?.query?.delivery_status
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    // console.log(deliveryStatus, limit, current_page);
    const skip = (current_page - 1) * limit; 

    let deliveries, deliveriesCount; 
    let deliveriesList = []; 

    if (deliveryStatus == 'all') {
        deliveries = await Order.find({ deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!deliveries?.length) return res.status(404).json({ message: "No deliveries found!" }); 

        deliveriesCount = await Order.countDocuments({ deleted_at: null });

    } else {

        deliveries = await Order.find({ deleted_at: null, delivery_status: deliveryStatus }) 
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!deliveries?.length) return res.status(404).json({ message: "No deliveries found!" }); 

        deliveriesCount = await Order.countDocuments({ deleted_at: null, delivery_status: deliveryStatus });
    }

    /** Order Items within Deliveries */ 
    if (deliveries?.length) {
        const updatePromises = deliveries?.map(async order => { 
            let foundOrderItems = await OrderItem.find({ order: order?._id, deleted_at: null })
                                                .sort('-created_at')
                                                .populate({
                                                    path: 'product', 
                                                })
                                                .exec(); 
            order['order_items'] = foundOrderItems; 

            deliveriesList.push(order);
        }); 
        await Promise.all(updatePromises); 
    }

    // res.json({ data: deliveries, count: deliveriesCount, total_amount: totalPaid }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(deliveriesCount / limit), 
                    total_results: deliveriesCount
                }, 
                data: deliveriesList 
            });
}); 

/**
 * GET ALL DELIVERIES
 */

const markDelivered = asyncHandler (async (req, res) => {

});


export { getDeliveries, markDelivered };