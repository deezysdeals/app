import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { paypalCreateOrder, paypalCaptureOrder } from '../utils/paypal-api.js'; 
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
    const deliveryStatus = req?.query?.delivery_status
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    // console.log(deliveryStatus, limit, current_page);
    const skip = (current_page - 1) * limit; 

    // console.log('delivery status', deliveryStatus);

    let orders, ordersCount; 
    let ordersList = [];

    if (deliveryStatus == 'all') {
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

        orders = await Order.find({ deleted_at: null, delivery_status: deliveryStatus }) 
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!orders?.length) return res.status(404).json({ message: "No orders found!" }); 

        ordersCount = await Order.countDocuments({ deleted_at: null, delivery_status: deliveryStatus });
    }

    /** Order Items within Orders */ 
    if (orders?.length) {
        const updatePromises = orders?.map(async order => { 
            let foundOrderItems = await OrderItem.find({ order: order?._id })
                                                .sort('-created_at')
                                                .populate({
                                                    path: 'product', 
                                                })
                                                .exec(); 
            order['orderItems'] = foundOrderItems; 

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
 * CREATE ORDER
 */
const createOrder = asyncHandler(async (req, res) => {
    const { cart, 
            delivery_mode, 
            payment_mode, 
            // billing_status, 
            // total_to_be_paid, 
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

    // console.log(req?.body); 
    // console.log(req); 

    // Internal record for Order
    // let proposed_delivery_start_date; 
    // if (delivery_mode != null) proposed_delivery_start_date = Date.now(); 

    // let proposed_delivery_destination_reach_date; 
    // if (delivery_mode == 'express') proposed_delivery_destination_reach_date = Date.now();
    // if (delivery_mode == 'business') proposed_delivery_destination_reach_date = Date.now();
    // if (delivery_mode == 'casual') proposed_delivery_destination_reach_date = Date.now(); 

    const userPlacingOrder = await User.findOne({ _id: req?.user_id }).lean(); 
    const addressOfUser = await Address.findOne({ user: req?.user_id, default: true }).lean();

    const newOrder = await Order.create({
        user: req?.user_id, 
        // order_items: items.map(item => ({
        //     ...item, 
        //     product: item?._id, 
        //     _id: undefined
        // })),
        // delivery_mode, 
        payment_mode: 'unpaid', 
        billing_status: 'unpaid', 
        // total_to_be_paid, 
        // proposed_delivery_start_date,
        // proposed_delivery_destination_reach_date, 
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

    if (cart && cart?.length === 0) { 

        return res.status(400).json({ message: 'No order items. You must add at least one item!' }); 

    } else if (cart && cart?.length > 0) { 
        // cart?.map(item => { 
        const cartResolve = cart?.map(async (item, index) => { 
            async function fetchProduct() {
                try {
                    const response = await axios.get(`https://fakestoreapi.com/products/${item?.id}`);
                    // console.log('Response:', response?.data); 

                    // Create new product (order item), if does not exist
                    const productFilter = { title: response?.data?.title }; 
                    const productUpdate = { added_by: req?.user_id, 
                                            title: response?.data?.title, 
                                            retail_price: response?.data?.price, 
                                            images: [response?.data?.image] };

                    const upsertProduct = await Product.findOneAndUpdate(productFilter, productUpdate, {
                        new: true,
                        upsert: true 
                    }); 
                    // console.log(upsertProduct); 

                    // Create new product Image (order item image), if does not exist
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
                        price: upsertProduct?.retail_price
                    }); 

                    // console.log({'Test': newOrderItem?.price * newOrderItem?.quantity}); 

                    let orderItemPrice = newOrderItem?.price * newOrderItem?.quantity; 
                    totalToBePaid += orderItemPrice; 
                    // console.log({ 'totaltobe': totalToBePaid }); 
                    // console.log({'Cart length:': cart?.length}); 
                    // console.log({'Index': index}); 

                    if ((cart?.length) == index+1) { 
                        // console.log({ 'totaltobe': totalToBePaid }); 
                        await Order.findOneAndUpdate({ _id: newOrder?._id }, { total_to_be_paid: totalToBePaid }); 
                        
                        async function paypalOrderCreate() { 
                            // Get the order to process payment
                            // const orderToBeProcessed = await Order.findById(newOrder?._id); 

                            // await orderPaymentInfo(orderToBeProcessed?.total_to_be_paid, orderToBeProcessed?.currency);

                            // console.log({ 'test2': orderToBeProcessed }); 

                            await paypalCreateOrder(totalToBePaid)
                                .then(({ jsonResponse, httpStatusCode }) => {
                                    res.status(httpStatusCode).json({
                                        jsonResponse, 
                                        data: { 'order': newOrder}
                                    }); 
                                    // res.status(201).json({ success: `Order ${newOrder._id} added`, data: { 'order': newOrder} }); 
                                })
                                .catch(error => {
                                    console.error("Failed to create order:", error);
                                    res.status(500).json({ error: "Failed to create order." });
                                });
                        }
                        await paypalOrderCreate();
                    }

                    // Create new category, if does not exist 
                    const categoryFilter = { name: response?.data?.category }; 
                    const categoryUpdate = { added_by: req?.user_id }; 

                    const upsertCategory = await Category.findOneAndUpdate(categoryFilter, categoryUpdate, {
                        new: true, 
                        upsert: true 
                    }); 
                    // console.log(upsertCategory); 

                } catch (error) {
                    console.error('Error:', error);
                } 
            }
            fetchProduct(); 

        }); 

        await Promise.all(cartResolve); 
    } 
}); 





const updatePayPalOrderID = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { paypal_order_id } = req.body; 

    const orderFilter = { _id: id }; 
    const orderUpdate = { paypal_order_id: paypal_order_id }; 

    await Order.findOneAndUpdate(orderFilter, orderUpdate, {
        upsert: true 
    })
        .then(order => {
            if (order) { 
                res.status(200).json({ success: `PayPal Order ID added to Order.`, data: order });
            } else {
                console.log('No order found to process payment.');
            }
        })
        .catch(error => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 
})





const captureOrder = asyncHandler(async (req, res) => {
    const { orderID, payerID, paymentID, paymentSource } = req.params; 
    console.log(orderID, payerID, paymentID, paymentSource)

    async function paypalOrderCapture() {
        await paypalCaptureOrder(id)
            .then(({ jsonResponse, httpStatusCode }) => { 
                // Update database with updated order record 
                const orderFilter = { paypal_order_id: orderID }; 
                const orderUpdate = { paypal_payer_id: payerID, 
                                    paypal_payment_id: paymentID, 
                                    billing_status: (paymentSource == 'paypal') 
                                                    ? 'paying-with-paypal' 
                                                        : (paymentSource == 'card') 
                                                        ? 'paying-with-card' 
                                                            : 'pay-on-delivery', 
                                    payment_mode: (paymentSource == 'paypal') 
                                                    ? 'paypal' 
                                                        : (paymentSource == 'card') 
                                                        ? 'card' 
                                                            : 'cash' };
                async function updateOrder() {
                    await Order.findOneAndUpdate(orderFilter, orderUpdate, {
                        new: true, 
                        upsert: true 
                    })
                        .then(order => {
                            if (order) { 
                                // res.status(200).json({ success: `Order updated with PayPal Payment details`, data: order });
                            } else {
                                // console.log('No order found to proceed with payment processing.'); 
                                res.status(404).json({ message: 'No order found to proceed with payment processing.' });
                            }
                        })
                        .catch(error => {
                            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                        });
                } 
                updateOrder()

                res.status(httpStatusCode).json(jsonResponse);
            })
            .catch(error => {
                console.error("Failed to capture order:", error);
                res.status(500).json({ error: "Failed to capture order." });
            }); 
    }; 
    paypalOrderCapture(); 
    
}); 





const markAsPaidOrder = asyncHandler(async (req, res) => {
    const { id } = req.params; 

    // const orderByPaypalID = await Order.findOne({paypal_order_id: id}).exec();

    const orderFilter = { paypal_order_id: id }; 
    const orderUpdate = { paid: true };

    // const upsertOrderByPaypalID = await Order.findOneAndUpdate(orderFilter, orderUpdate, {
    await Order.findOneAndUpdate(orderFilter, orderUpdate, { 
        new: true, 
        upsert: true 
    })
        .then(order => {
            if (order) { 
                res.status(200).json({ success: `Payment Successful.`, data: order });
            } else {
                console.log('No order found to process payment.');
            }
        })
        .catch(error => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 
}); 





const getOrder = asyncHandler(async (req, res) => {
	const order = await Order.findOne({ _id: req?.params?.id })
		.select(['-created_at', '-updated_at', '-deleted_at'])
		.lean();

	if (!order) return res.status(404).json({ message: `No order matches order ${req?.params?.id}!` }); 

    const orderItems = await OrderItem.find({ order: order?._id }).lean();
    
	res.status(200).json({ data: {
        order, order_items: orderItems
    } });
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
		createOrder, 
        updatePayPalOrderID, 
        captureOrder, 
        markAsPaidOrder,
		getOrder, 
		updateOrder, 
		deleteOrder, 
        restoreOrder, 
        destroyOrder }; 