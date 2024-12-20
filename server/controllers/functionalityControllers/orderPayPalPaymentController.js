import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { createOrder, 
        captureOrder, 
        authorizeOrder, 
        captureAuthorize 
} from '../../utils/paypal-api.js'
import Category from '../../models/Category.js'; 
import Product from '../../models/Product.js'; 
import ProductImage from '../../models/ProductImage.js'; 
import Order from '../../models/Order.js'; 
import OrderItem from '../../models/OrderItem.js'; 
import User from '../../models/User.js'; 
import Address from '../../models/Address.js'; 

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
                        const productUpdate = { added_by: req?.user_id, 
                                                title: response?.data?.title, 
                                                retail_price: response?.data?.price, 
                                                images: [response?.data?.image] };

                        const upsertProduct = await Product.findOneAndUpdate(productFilter, productUpdate, {
                            new: true,
                            upsert: true 
                        }); 
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

                            // console.log('total within function', totalToBePaid); 

                            const { jsonResponse, httpStatusCode } = await createOrder(totalToBePaid); 
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
        // const { orderID, paymentSource } = req.params; 
        const { orderID } = req.params; 
        // const { paymentSource } = req.body 
        // console.log('payment source', paymentSource); 
        console.log('order id', orderID)

        const { jsonResponse, httpStatusCode } = await captureOrder(req?.params?.orderID);

        const orderFilter = { paypal_order_id: orderID }; 
        const orderUpdate = { billing_status: (paymentSource == 'paypal') 
                                                ? 'paying-with-paypal' 
                                                    : (paymentSource == 'card') 
                                                    ? 'paying-with-card' 
                                                        : 'pay-on-delivery', 
                                payment_mode: (paymentSource == 'paypal') 
                                                ? 'paypal' 
                                                    : (paymentSource == 'card') 
                                                    ? 'card' 
                                                        : 'cash', 
                                paid: true }; 

        await Order.findOneAndUpdate(orderFilter, orderUpdate, {
            new: true, 
            upsert: true 
        })
            .then(async order => {
                if (order) { 
                    res.status(httpStatusCode).json(jsonResponse); 
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