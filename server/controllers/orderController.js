import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
// import { paypalCreateOrder, paypalCaptureOrder } from '../utils/paypal-standard-payment-api.js'; 
import Category from '../models/Category.js'; 
import Product from '../models/Product.js'; 
import ProductImage from '../models/ProductImage.js'; 
import Order from '../models/Order.js'; 
import OrderItem from '../models/OrderItem.js'; 
import User from '../models/User.js'; 
import Address from '../models/Address.js'; 


/**
 * GET ALL ORDERS
 */
const getOrders = asyncHandler(async (req, res) => { 
    const paymentStatus = req?.query?.payment_status
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    // console.log(paymentStatus, limit, current_page);
    const skip = (current_page - 1) * limit; 

    // console.log('payment status', paymentStatus);

    let orders, ordersCount; 
    let ordersList = [];

    if (paymentStatus == 'all') {
        orders = await Order.find({ deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!orders?.length) return res.status(404).json({ message: "No orders found!" }); 

        ordersCount = await Order.countDocuments({ deleted_at: null });

    } else {

        orders = await Order.find({ deleted_at: null, paid: paymentStatus }) 
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!orders?.length) return res.status(404).json({ message: "No orders found!" }); 

        ordersCount = await Order.countDocuments({ deleted_at: null, paid: paymentStatus });
    }

    /** Order Items within Orders */ 
    if (orders?.length) {
        const updatePromises = orders?.map(async order => { 
            let foundOrderItems = await OrderItem.find({ order: order?._id, deleted_at: null })
                                                .sort('-created_at')
                                                .populate({
                                                    path: 'product', 
                                                })
                                                .exec(); 
            order['order_items'] = foundOrderItems; 

            ordersList.push(order);
        }); 
        await Promise.all(updatePromises); 
    }

    // res.json({ data: orders, count: ordersCount, total_amount: totalPaid }); 
    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(ordersCount / limit), 
                    total_results: ordersCount
                }, 
                data: ordersList 
            });

});























































const getOrder = asyncHandler(async (req, res) => {
	const order = await Order.findOne({ _id: req?.params?.id })
                            .select(['-created_at', '-updated_at', '-deleted_at'])
                            .populate({
                                path: 'user', 
                                select: 'first_name last_name username' 
                            })
                            .lean();

	if (!order) return res.status(404).json({ message: `No order matches order ${req?.params?.id}!` }); 

    const orderItems = await OrderItem.find({ order: order?._id, deleted_at: null })
                                    .sort('-created_at')
                                    .populate({
                                        path: 'product'
                                    })
                                    .lean(); 

    order.order_items = orderItems;
    
	// res.status(200).json({ data: {
    //     order, order_items: orderItems
    // } }); 
	res.status(200).json({ data: order }); 
}); 





const updateOrder = asyncHandler(async (req, res) => {
    const { delivery_mode, 
            payment_mode, 
            order_key, 
            billing_status, 
            total_to_be_paid, 
            total_paid, 
            total_balance, 
            proposed_delivery_start_date, 
            proposed_delivery_destination_reach_date, 
            full_name, 
            email, 
            phone, 
            address_line_1, 
            address_line_2, 
            post_code, 
            town_city, 
            state_region, 
            country, 
            delivery_instructions } = req?.body;  

    const { id } = req?.params; 

    const order = await Order.findOne({ _id: id }).exec();
    if (!order) return res.status(404).json({ message: "Order not found!" }); 

    if (delivery_mode) order.delivery_mode = delivery_mode; 
    if (payment_mode) order.payment_mode = payment_mode; 
    if (order_key) order.order_key = order_key; 
    if (billing_status) order.billing_status = billing_status; 
    if (total_to_be_paid) order.total_to_be_paid = total_to_be_paid; 
    if (total_paid) order.total_paid = total_paid; 
    if (total_balance) order.total_balance = total_balance; 
    if (proposed_delivery_start_date) order.proposed_delivery_start_date = proposed_delivery_start_date; 
    if (proposed_delivery_destination_reach_date) order.proposed_delivery_destination_reach_date = proposed_delivery_destination_reach_date; 
    if (full_name) order.full_name = full_name; 
    if (email) order.email = email; 
    if (phone) order.phone = phone; 
    if (address_line_1) order.address_line_1 = address_line_1; 
    if (address_line_2) order.address_line_2 = address_line_2; 
    if (post_code) order.post_code = post_code; 
    if (town_city) order.town_city = town_city; 
    if (state_region) order.state_region = state_region; 
    if (country) order.country = country; 
    if (delivery_instructions) order.delivery_instructions = delivery_instructions; 

    order.save()
        .then(() => { 
			res.status(200).json({ success: `Order record updated.`, data: order });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 





const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const order = await Order.findOne({ _id: id }).exec();

    if (!order) return res.status(404).json({ message: `No order matches the order ${id}!` }); 

    if (order.deleted_at == '') {
        order.deleted_at = new Date().toISOString();
        order.deleted_by = req?.user_id;
    }

    order.save()
        .then(() => { 
			res.status(200).json({ success: `Order record deleted.`, data: order });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 





const restoreOrder = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const order = await Order.findOne({ _id: id }).exec();

    if (!order) return res.status(404).json({ message: `No order matches the order ${id}!` }); 

    if (order.deleted_at != '') {
        order.deleted_at = '';
        order.deleted_by = '';
    };

    order.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted order record restored.`, data: order });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 





const destroyOrder = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const order = await Order.findOne({ _id: id }).exec();

	if (!order) return res.status(404).json({ message: `No order matches the order ${id}!` }); 

	await order.deleteOne(); 

	res.status(200).json({ success: `Order ${order?.code} has been permanently deleted.`, data: `${order}` });
}); 






export { getOrders, 
		// createOrder, 
        // updatePayPalOrderID, 
        // captureOrder, 
        // markAsPaidOrder,
		getOrder, 
		updateOrder, 
		deleteOrder, 
        restoreOrder, 
        destroyOrder }; 