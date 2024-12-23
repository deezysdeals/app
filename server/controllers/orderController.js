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
import Notification from '../models/Notification.js'; 
import orderPlacedNoticationMailTemplate from '../mails/templates/orderNotificationMail.js';


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
                                                .lean(); 
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

/**
 * CREATE ORDER (AND PAY LATER)
 */
const createOrder = async (req, res) => {
    try {
        const { cart } = req.body; 
        console.log('cart', cart); 

        const userPlacingOrder = await User.findOne({ _id: req?.user_id }).lean(); 
        const addressOfUser = await Address.findOne({ user: req?.user_id, default: true }).lean(); 

        if (!addressOfUser) return res.status(409).json({ message: 'You must have an address before you can place an order.' }); 

        const newOrder = await Order.create({
            user: req?.user_id, 
            payment_mode: 'unpaid', 
            billing_status: 'unpaid', 
            full_name: addressOfUser?.full_name, 
            email: userPlacingOrder?.email, 
            phone: addressOfUser?.phone, 
            address_line_1: addressOfUser?.address_line_1, 
            address_line_2: addressOfUser?.address_line_2, 
            post_code: addressOfUser?.post_code, 
            town_city: addressOfUser?.town_city, 
            state_region: addressOfUser?.state_region, 
            country: addressOfUser?.country, 
            delivery_instructions: addressOfUser?.delivery_instructions 
        }); 

        let totalToBePaid = 0; 

        if ((cart && cart?.length === 0) || (cart == undefined)) { 

            return res.status(400).json({ message: 'No order items. You must add at least one item!' }); 

        } else if (cart && cart?.length > 0) { 
            const cartResolve = cart?.map(async (item, index) => { 
                async function fetchProductAndProcessOrder() {
                    try {
                        const response = await axios.get(`https://fakestoreapi.com/products/${item?.id}`);
                        // console.log('Response:', response?.data); 

                        /** Create new category, if does not exist */  
                        const categoryFilter = { name: response?.data?.category }; 
                        const categoryUpdate = { added_by: req?.user_id }; 

                        const upsertCategory = await Category.findOneAndUpdate(categoryFilter, categoryUpdate, {
                            new: true, 
                            upsert: true 
                        }); 
                        // console.log(upsertCategory); 

                        /** Create new product (order item), if does not exist */
                        const productFilter = { title: response?.data?.title };
                        const productUpdate = {
                            $setOnInsert: { // This ensures these fields are set only when the document is inserted
                                user: req?.user_id,
                                title: response?.data?.title,
                                retail_price: response?.data?.price,
                                images: [response?.data?.image]
                            },
                            $inc: { order_count: 1 } // Increment the order_count atomically
                        };

                        /** Find and update or insert a new product, incrementing `order_count` if the product exists */ 
                        const upsertProduct = await Product.findOneAndUpdate(
                            productFilter,
                            productUpdate,
                            {
                                new: true,   // Return the updated document
                                upsert: true // Create a new document if one doesn't exist
                            }
                        );
                        // console.log(upsertProduct);

                        /** Create new product image (order item image), if does not exist */ 
                        const productImageFilter = { 'image_path.url': response?.data?.image }; 
                        const productImageUpdate = { $set: { product: upsertProduct?._id,
                                                            'image_path.$.url': response?.data?.image } }; 

                        const upsertProductImage = await ProductImage.findOneAndUpdate(productImageFilter, productImageUpdate, {
                            new: true,
                            upsert: true 
                        }); 
                        // console.log(upsertProductImage); 

                        const newOrderItem = await OrderItem.create({
                            user: req?.user_id, 
                            product: upsertProduct?._id, 
                            order: newOrder?._id, 
                            quantity: item?.quantity, 
                            cost_price: upsertProduct?.retail_price, 
                            selling_price: (upsertProduct?.retail_price + (10/100))
                        }); 
                        // console.log({'Test': newOrderItem?.price * newOrderItem?.quantity}); 

                        let orderItemPrice = newOrderItem?.selling_price * newOrderItem?.quantity; 
                        totalToBePaid += orderItemPrice; 
                        // console.log({ 'totaltobe': totalToBePaid }); 
                        // console.log({'Cart length:': cart?.length}); 
                        // console.log({'Index': index}); 

                        if ((cart?.length) == index+1) { 
                            async function updateUserWithOrderCountAndNotification() {
                                try { 
                                    const updateUserWithOrdersPlaced = await User.findOneAndUpdate(
                                        { _id: req?.user_id }, 
                                        { $inc: { total_amount_spent_on_orders: totalToBePaid, total_orders: 1 } }, 
                                        { new: true }
                                    );
                                    if (!updateUserWithOrdersPlaced) return res.status(404).json({ message: 'User not found' });

                                    const newNotification = await Notification.create({
                                        user: req?.user_id, 
                                        type: 'order', 
                                        order: newOrder?._id
                                    }); 

                                    // console.log('updated user', updateUserWithOrdersPlaced)

                                    /** Send mail notification for placed order if user wants */ 
                                    if (updateUserWithOrdersPlaced?.receive_notifications == true) {
                                        await orderPlacedNoticationMailTemplate(updateUserWithOrdersPlaced, newOrder)
                                    }

                                } catch (error) {
                                    console.error('Error updating order and user:', error);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }

                            }
                            await updateUserWithOrderCountAndNotification();

                            // console.log('total within function', totalToBePaid); 
                            // res.status(201).json({ success: `Order ${newOrder._id} added`, data: newOrder });
                        }

                    } catch (error) {
                        console.error('Error:', error);
                    } 
                }
                fetchProductAndProcessOrder(); 

            }); 

            await Promise.all(cartResolve); 

            res.status(201).json({ success: `Order ${newOrder._id} added`, data: newOrder });
        } 

    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
};

/**
 * GET AN ORDER
 */
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

/**
 * UPDATE AN ORDER
 */
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

/**
 * SOFT-DELETE AN ORDER
 */
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

/**
 * RESTORE A SOFT-DELETED ORDER
 */
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

/**
 * PERMANENTLY DELETE AN ORDER
 */
const destroyOrder = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const order = await Order.findOne({ _id: id }).exec();

	if (!order) return res.status(404).json({ message: `No order matches the order ${id}!` }); 

	await order.deleteOne(); 

	res.status(200).json({ success: `Order ${order?.code} has been permanently deleted.`, data: `${order}` });
}); 


export { getOrders, 
		createOrder, 
        // updatePayPalOrderID, 
        // captureOrder, 
        // markAsPaidOrder,
		getOrder, 
		updateOrder, 
		deleteOrder, 
        restoreOrder, 
        destroyOrder }; 