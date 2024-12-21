import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { createOrder, 
        captureOrder, 
        authorizeOrder, 
        captureAuthorize 
} from '../../utils/paypal-api.js'; 
import orderPlacedNoticationMailTemplate from '../../mails/templates/orderNotificationMail.js'; 
import Category from '../../models/Category.js'; 
import Product from '../../models/Product.js'; 
import ProductImage from '../../models/ProductImage.js'; 
import Order from '../../models/Order.js'; 
import OrderItem from '../../models/OrderItem.js'; 
import User from '../../models/User.js'; 
import Address from '../../models/Address.js'; 
import Notification from '../../models/Notification.js'; 


const createOrderPayment = async (req, res) => {
    try {
        const { cart } = req.body; 
        // console.log('cart', cart); 

        const userPlacingOrder = await User.findOne({ _id: req?.user_id }).lean(); 
        const addressOfUser = await Address.findOne({ user: req?.user_id, default: true }).lean(); 

        if (!addressOfUser) return res.status(409).json({ message: 'You must have an address before you can pay' }); 

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
                async function fetchProduct() {
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
                            const { jsonResponse, httpStatusCode } = await createOrder(totalToBePaid); 

                            console.log('status 1', httpStatusCode); 
                            console.log('json 1', jsonResponse); 
                            console.log('order id', newOrder?._id)
                            // console.log({ 'totaltobe': totalToBePaid }); 
                            async function updateOrderWithOrderIDUserAndNotification(jsonResponse) {
                                try { 
                                    const orderFilter = { _id: newOrder?._id }; 
                                    const orderUpdate = { paypal_order_id: jsonResponse?.id,  
                                                        total_to_be_paid: totalToBePaid }; 

                                    const updatedOrder = await Order.findOneAndUpdate(orderFilter, orderUpdate, {
                                        new: true,  
                                    }) 
                                    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
                                    console.log('updated order', updatedOrder); 

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
                                    // if (userPlacingOrder?.receive_notifications == true) {
                                    if (updateUserWithOrdersPlaced?.receive_notifications == true) {
                                        // (async function () {
                                            await orderPlacedNoticationMailTemplate(updateUserWithOrdersPlaced, updatedOrder)
                                        // })();
                                    }

                                } catch (error) {
                                    console.error('Error updating order and user:', error);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }

                            }
                            await updateOrderWithOrderIDUserAndNotification(jsonResponse);

                            // console.log('total within function', totalToBePaid); 

                            res.status(httpStatusCode).json(jsonResponse);
                        }

                    } catch (error) {
                        console.error('Error:', error);
                    } 
                }
                fetchProduct(); 

            }); 

            await Promise.all(cartResolve); 
        } 

        // res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
}

const captureOrderPayment = async (req, res) => {
    try {
        const { orderID } = req.params; 
        // console.log('order id', orderID); 

        const { jsonResponse, httpStatusCode } = await captureOrder(orderID); 
        console.log('status', httpStatusCode); 
        console.log('json', jsonResponse); 
        // jsonResponse?.payment_source == 'paypal'
        // jsonResponse?.payment_source?.paypal?.account_id 

        const orderFilter = { paypal_order_id: orderID }; 
        // const orderUpdate = { paid: true }; 
        const orderUpdate = { billing_status: (jsonResponse?.payment_source?.paypal) 
                                                ? 'paying-with-paypal' 
                                                    : (jsonResponse?.payment_source?.card) 
                                                    ? 'paying-with-card' 
                                                        : 'pay-on-delivery', 
                                payment_mode: (jsonResponse?.payment_source?.paypal) 
                                                ? 'paypal' 
                                                    : (jsonResponse?.payment_source?.card) 
                                                    ? 'card' 
                                                        : 'cash', 
                                paypal_payer_id: (jsonResponse?.payment_source?.paypal?.account_id || null),
                                paid: true, 
                                paid_at: new Date().toISOString() }; 

        await Order.findOneAndUpdate(orderFilter, orderUpdate, {
            new: true
        })
            .then(async order => {
                if (order) { 
                    try {
                        const orderItem = await OrderItem.updateMany(
                            { order: order?._id },
                            { $set: { order_paid: true } }
                        ); 

                        const productFilter = { _id: orderItem?.product };
                        const productUpdate = { $inc: { sold_count: 1 } };
                        const updateProduct = await Product.findOneAndUpdate(
                            productFilter,
                            productUpdate,
                            {
                                new: true
                            }
                        ); 
                        res.status(httpStatusCode).json(jsonResponse);
                    } catch (error) {
                        res.status(500).json({ message: 'Failed to update OrderItems', details: `${error.message}` });
                    }
                    // res.status(httpStatusCode).json(jsonResponse); 
                } else {  
                    res.status(404).json({ message: 'No order found to proceed with payment processing.' });
                }
            })
            .catch(error => {
                if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
            });

        // const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        // res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
}

// authorizeOrder route
const authorizeOrderPayment = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await authorizeOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to authorize order." });
    }
}

// captureAuthorize route
const captureAuthorisedOrderPayment = async (req, res) => {
    try {
        const { authorizationId } = req.params;
        const { jsonResponse, httpStatusCode } = await captureAuthorize(
            authorizationId
        );
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture authorize." });
    }
}


export { createOrderPayment, 
        captureOrderPayment, 
        authorizeOrderPayment, 
        captureAuthorisedOrderPayment }