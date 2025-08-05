import "dotenv/config";
// import dotenv from 'dotenv';
// dotenv.config();
const {
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY
} = process.env;
import Stripe from 'stripe';
const stripe = new Stripe(STRIPE_SECRET_KEY);
import orderPlacedNoticationMailTemplate from '../../mails/templates/orderNotificationMail.js'; 
import Product from '../../models/Product.js'; 
import Order from '../../models/Order.js'; 
import OrderItem from '../../models/OrderItem.js'; 
import User from '../../models/User.js'; 
import Address from '../../models/Address.js'; 
import Notification from '../../models/Notification.js'; 
import Brand from '../../models/Brand.js';


/**
 * CREATE ORDER (AND PAY)
 */
const createOrderAndPay = async (req, res) => {
    const { cart } = req.body;

    try {
        const userPlacingOrder = await User.findOne({ _id: req?.user_id }).lean(); 
        const addressOfUser = await Address.findOne({ user: req?.user_id, default: true }).lean(); 

        if (!addressOfUser) return res.status(409).json({ message: 'You must have an address before you can pay' }); 

        const newOrder = await Order.create({
            // user: req?.user_id, 
            user: userPlacingOrder?._id, 
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
        let stripeItems = [];

        if ((cart && cart?.length === 0) || (cart == undefined)) { 

            return res.status(400).json({ message: 'No order items. You must add at least one item!' }); 

        } else if (cart && cart?.length > 0) { 
            console.log('Cart"', cart);
            const cartResolve = cart?.map(async (item, index) => { 
                async function fetchProductAndProcessOrder() {
                    try {
                        /** Update product */
                        const productFilter = { asin: item?.id };
                        const productUpdate = { $inc: { order_count: 1 } };

                        /** Find and update or insert a new product, incrementing `order_count` if the product exists */ 
                        const upsertProduct = await Product.findOneAndUpdate(
                            productFilter,
                            productUpdate,
                            { new: true }
                        );
                        console.log('upsertProduct:', upsertProduct);

                        const newOrderItem = await OrderItem.create({
                            user: userPlacingOrder?._id, 
                            product: upsertProduct?._id, 
                            order: newOrder?._id, 
                            quantity: item?.quantity, 
                            // cost_price: upsertProduct?.retail_price, 
                            cost_price: Number(upsertProduct?.purchase_price) || Number(upsertProduct?.retail_price), 
                            // selling_price: Number(upsertProduct?.retail_price + (10/100))
                            selling_price: Number(upsertProduct?.retail_price)
                        }); 
                        // console.log('Cost Price', newOrderItem?.cost_price); 
                        // console.log('Selling Price', newOrderItem?.selling_price); 
                        // console.log({'Test': newOrderItem?.selling_price * newOrderItem?.quantity}); 

                        let orderItemPrice = (newOrderItem?.selling_price ?? upsertProduct?.retail_price) * newOrderItem?.quantity; 
                        totalToBePaid += orderItemPrice; 
                        
                        console.log({ 'totaltobe': totalToBePaid }); 
                        console.log({ 'orderitemPrice': orderItemPrice }); 
                        // console.log({'Cart length:': cart?.length}); 
                        // console.log({'Index': index}); 

                        stripeItems.push({
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    // name: stripeItem?.title?.slice(0, 127),
                                    name: upsertProduct?.title?.slice(0, 127),
                                },
                                // unit_amount: (Number(stripeItem?.currentPrice)?.toFixed(2) * 100),
                                // unit_amount: (Number(upsertProduct?.retail_price)?.toFixed(2) * 100),
                                unit_amount: Math.round(Number(upsertProduct?.retail_price) * 100)
                            },
                            quantity: item?.quantity,
                        })

                        if ((cart?.length) == index+1) { 
                            // console.log('createOrder: ', await createOrder(totalToBePaid))

                            console.log('stripeItems', stripeItems);

                            const session = await stripe.checkout.sessions.create({
                                line_items: stripeItems,
                                mode: 'payment',
                                // success_url: `${process?.env?.CLIENT_URL}/order-placed`,
                                // success_url: `${process?.env?.CLIENT_URL}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
                                // success_url: `${process?.env?.CLIENT_URL}/paid?session_id={CHECKOUT_SESSION_ID}`,
                                success_url: `${process?.env?.CLIENT_URL}/order-placed`,
                                cancel_url: `${process?.env?.CLIENT_URL}/payment-failed`,
                                metadata: {
                                    order_id: newOrder._id.toString(),
                                    user_id: userPlacingOrder._id.toString(),
                                }
                            });

                            // res.redirect(303, session.url);

                            console.log('order id', newOrder?._id)
                            // console.log({ 'totaltobe': totalToBePaid }); 
                            async function updateBrandAndOrderWithOrderIDUserAndNotification() {
                                try { 

                                    const updateBrandWithOrderCount = await Brand.findOneAndUpdate(
                                        { _id: upsertProduct?.brand }, 
                                        { $inc: { order_count: 1 } }, 
                                        { new: true }
                                    );

                                    const orderFilter = { _id: newOrder?._id }; 
                                    const orderUpdate = { total_to_be_paid: totalToBePaid }; 

                                    const updatedOrder = await Order.findOneAndUpdate(orderFilter, orderUpdate, {
                                        new: true,  
                                    }) 
                                    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
                                    console.log('updated order', updatedOrder); 

                                    const updateUserWithOrdersPlaced = await User.findOneAndUpdate(
                                        { _id: userPlacingOrder?._id }, 
                                        { $inc: { total_amount_spent_on_orders: totalToBePaid, total_orders: 1 } }, 
                                        { new: true }
                                    );
                                    if (!updateUserWithOrdersPlaced) return res.status(404).json({ message: 'User not found' });

                                    const newNotification = await Notification.create({
                                        user: userPlacingOrder?._id, 
                                        type: 'order', 
                                        order: newOrder?._id
                                    }); 

                                } catch (error) {
                                    console.error('Error updating order and user:', error);
                                    return res.status(500).json({ message: 'Internal server error' });
                                }

                            }
                            await updateBrandAndOrderWithOrderIDUserAndNotification();

                            console.log('session', session);
                            console.log('session url', session?.url);

                            /** Update Order Database records */
                            const orderFilter = { _id: newOrder?._id }; 
                            // const orderUpdate = { paid: true }; 
                            const orderUpdate = { billing_status: 'paid-using-stripe', 
                                                    payment_mode: 'stripe', 
                                                    stripe_session_id: session?.id,
                                                    paid: true, 
                                                    paid_at: new Date().toISOString() }; 

                            await Order.findOneAndUpdate(orderFilter, orderUpdate, {
                                new: true
                            })
                                .then(async order => {
                                    if (order) { 
                                        try {
                                            await OrderItem.updateMany(
                                                { order: order._id },
                                                { $set: { order_paid: true } }
                                            );

                                            const orderItems = await OrderItem.find({ order: order._id });

                                            // for (const item of orderItems) {
                                            //     await Product.findOneAndUpdate(
                                            //         { _id: item.product },
                                            //         { $inc: { sale_count: item.quantity } },
                                            //         { new: true }
                                            //     );
                                            // };

                                            await Promise.all(orderItems.map(item =>
                                                Product.findOneAndUpdate(
                                                    { _id: item?.product },
                                                    { $inc: { sale_count: item?.quantity } },
                                                    { new: true }
                                                )
                                            ));

                                            if (userPlacingOrder?.receive_notifications == true) {
                                                await orderPlacedNoticationMailTemplate(userPlacingOrder, order);
                                            };
                                            
                                            // res.status(httpStatusCode).json(jsonResponse);
                                        } catch (error) {
                                            res.status(500).json({ message: 'Failed to update Order Items', details: `${error.message}` });
                                        }
                                        // res.status(httpStatusCode).json(jsonResponse); 
                                    } else {  
                                        res.status(404).json({ message: 'No order found to proceed with payment processing.' });
                                    }
                                })
                                .catch(error => {
                                    if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
                                });
                            /** End of Update Order Database records */

                            res.status(200).json({ success: 'Payment successful', session, order: newOrder, total_to_be_paid: totalToBePaid });

                            // res.redirect(303, session.url);
                        }

                    } catch (error) {
                        console.error('Error:', error);
                        // res.status(402).json({ error: error, message: 'Payment failed' });
                    } 
                }
                fetchProductAndProcessOrder(); 

            }); 

            await Promise.all(cartResolve); 
        } 
        
    } catch (error) {
        console.error('Error creating order and payment:', error);
        res.status(500).json({ error: 'Failed to create order and payment' });
    }
};

/**
 * CAPTURE CREATED ORDER (AND UPDATE PAYMENT STATUS)
 */
const captureOrderStripePayment = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const orderId = session.metadata?.order_id;

        if (!orderId) {
            console.warn('No order ID found in session metadata:', session.id);
            return res.status(400).send('Order ID not found in session metadata');
        }

        console.log('webhook session', session);
        console.log('webhook order id', orderId);

        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                payment_mode: 'stripe',
                billing_status: 'paid-using-stripe'
            }, { new: true });

            if (!updatedOrder) {
                console.warn('Order not found for webhook session:', session.id);
                return res.status(404).send('Order not found');
            }

            console.log('✅ Order marked as paid:', updatedOrder._id);
            res.status(200).send('Success');
        } catch (error) {
            console.error('Failed to update order from webhook:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        // For other events (optional)
        res.status(200).send('Event received');
    }
}


export { createOrderAndPay, captureOrderStripePayment };