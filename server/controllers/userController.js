import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js'; 
import User from '../models/User.js'; 
import Order from '../models/Order.js'; 
import OrderItem from '../models/OrderItem.js'; 
import Payment from '../models/Payment.js'; 
import Product from '../models/Product.js'; 
import ProductReview from '../models/ProductReview.js';
import ClientQuery from '../models/ClientQuery.js'; 


/**
 * GET ALL USERS
 */
const getUsers = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const roleQuery = req?.query?.role; 
    const skip = (current_page - 1) * limit; 

    console.log(current_page, limit, roleQuery); 


    let users, usersCount;

    if ((roleQuery != 'all')) {
        users = await User.find({ role: roleQuery, 
                                deleted_at: null })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean();   
        if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

        usersCount = await User.find({ role: roleQuery, deleted_at: null }).countDocuments(); 

        

    } else if ((roleQuery == 'all' || !roleQuery)) {
        users = await User.find({ deleted_at: null })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean(); 
        if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

        usersCount = await User.find({ deleted_at: null }).countDocuments(); 
    } 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(usersCount / limit), 
                    total_results: usersCount
                }, 
                data: users 
            }); 
});

/**
 * CREATE USER
 */
const createUser = asyncHandler(async (req, res) => {
    const { username, 
            first_name, 
            other_names, 
            last_name, 
            enterprise_name, 
            email, 
            phone, 
            password, 
            account_type } = req?.body; 

    const duplicateUsername = await User.findOne({ username: username }).lean(); 
    const duplicateEmail = await User.findOne({ email: email }).lean(); 

    if (duplicateUsername) {
        return res.status(409).json({ message: `Username ${duplicateUsername.username} already exists` });
    } else if (duplicateEmail) {
        return res.status(409).json({ message: `User email ${duplicateEmail.email} already exists` });
    }; 

    const emailVerifyToken = jwt.sign(
        { "username": username }, 
        process.env.EMAIL_VERIFY_TOKEN_SECRET, 
        { expiresIn: 20 * 60 }
    ); 

    let accountType;

    if (!account_type) {
        accountType = "individual";
    } else if (account_type && account_type == "individual") {
        accountType = "individual";
    } else if (account_type && account_type == "enterprise") {
        accountType = "enterprise";
    }; 

    const user = new User({
        user: req?.user_id, 
        username, 
        first_name, 
        other_names, 
        last_name, 
        enterprise_name, 
        email, 
        phone, 
        password, 
        role: accountType,
        email_verify_token: emailVerifyToken, 
        email_verified: new Date().toISOString()
    }); 

    user.save()
        .then(() => {
            res.status(201).json({ success: `User ${user._id} added`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 

    (async function () {
        const mailSubject = "New Account Registration";

        const mailBody = registerEmailConfirmMailTemplate(user)
        await sendMail(process.env.EMAIL_ADDRESS, user.email, mailSubject, mailBody);
    })();
}); 

/**
 * GET A USER
 */
const getUser = asyncHandler(async (req, res) => { 
    const { username } = req?.params; 

	const user = await User.findOne({ username: username })
                                .select(['-password', '-password_reset_token', '-updated_at', '-deleted_at'])
                                .lean(); 

	if (!user) return res.status(404).json({ message: `No user matches user @${username}!` }); 

    console.log(user);

    /** User Details: */
    /** Orders, Order Items, Payments, Product Reviews, Deliveries, Purchases, Client Queries, Query Responses */ 
    const userOrders = await Order.countDocuments({ user: user?._id, deleted_at: null }); 
    const userOrdersPending = await Order.countDocuments({ user: user?._id, paid: false, deleted_at: null }); 
    const getUserOrderItems = await OrderItem.countDocuments({ user: user?._id, deleted_at: null }); 
    const getUserPayments = await Order.countDocuments({ user: user?._id, paid: 'true', deleted_at: null }); 
    const getUserProductReviews = await ProductReview.countDocuments({ user: user?._id, deleted_at: null }); 
    const getUserDeliveries = await Order.countDocuments({ user: user?._id, deleted_at: null }); 
    const getUserDeliveriesPending = await Order.countDocuments({
        user: user?._id,
        delivery_status: { $in: ['undelivered', 'pending'] },
        deleted_at: null
    }); 
    const getUserPurchases = await Product.countDocuments({ user: user?._id, purchased_for_resale: true, deleted_at: null }); 
    const getUserClientQueries = await ClientQuery.countDocuments({ user: user?._id, deleted_at: null }); 
    const getUserClientQueriesSolved = await ClientQuery.countDocuments({ marked_solved_by: user?._id, deleted_at: null }); 

    user.orders_count = userOrders; 
    user.orders_pending_count = userOrdersPending; 
    user.order_items_count = getUserOrderItems;
    user.payments_count = getUserPayments; 
    user.product_reviews_count = getUserProductReviews; 
    user.deliveries_count = getUserDeliveries; 
    user.deliveries_pending_count = getUserDeliveriesPending; 
    user.purchases_count = getUserPurchases; 
    user.client_queries_count = getUserClientQueries; 
    user.client_queries_solved_count = getUserClientQueriesSolved; 

    res.json({ data: user });
}); 

/**
 * UPDATE A USER
 */
const updateUser = asyncHandler(async (req, res) => {
    const { first_name, 
            other_names, 
            last_name, 
            enterprise_name, 
            email, 
            phone, 
            password, 
            account_type } = req?.body; 

    const { username } = req?.params; 

    const user = await User.findOne({ username: username }).exec();
    if (!user) return res.status(404).json({ message: "User not found!" }); 

    let accountType;

    if (!account_type) {
        accountType = "individual";
    } else if (account_type && account_type == "individual") {
        accountType = "individual";
    } else if (account_type && account_type == "enterprise") {
        accountType = "enterprise"; 
    }; 

    /** Image Upload */
    let userImageUpload = {};
    if (!req?.files?.user_image) {
        userImageUpload.public_id = ''
        userImageUpload.secure_url = ''
    } else if (req?.files?.user_image) {
        userImageUpload = await cloudinaryImageUpload(req?.files?.user_image?.tempFilePath, "deezysdeals_user_images"); 
        if (!userImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        user.user_image_path.public_id = userImageUpload.public_id
        user.user_image_path.url = userImageUpload.secure_url
    }
    /** End of Image upload */

    if (first_name) user.first_name = first_name; 
    if (last_name) user.last_name = last_name; 
    if (enterprise_name) user.enterprise_name = enterprise_name; 
    if (email) user.email = email; 
    if (phone) user.phone = phone; 
    if (password) user.password = password; 
    if (account_type) user.role = accountType; 

    user.save()
        .then(() => { 
			res.status(200).json({ success: `User record updated.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * SOFT-DELETE A USER
 */
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const user = await User.findOne({ _id: id }).exec();

    if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

    if (user.deleted_at == '') {
        user.deleted_at = new Date().toISOString();
        user.deleted_by = req?.user_id;
    }

    user.save()
        .then(() => { 
			res.status(200).json({ success: `User record deleted.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * RESTORE A SOFT-DELETED USER
 */
const restoreUser = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const user = await User.findOne({ _id: id }).exec();

    if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

    if (user.deleted_at != '') {
        user.deleted_at = '';
        user.deleted_by = '';
    };

    user.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted user record restored.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * PERMANENTLY DELETE A USER
 */
const destroyUser = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const user = await User.findOne({ _id: id }).exec();

	if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

	await user.deleteOne(); 

	res.status(200).json({ success: `User ${user?._id} has been permanently deleted.`, data: `${user}` });
}); 




/********************* */
/** ADDITIONAL METHODS */
/********************* */

/**
 * GET USER CLIENT QUERIES
 */
const getUserClientQueries = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
    
});

/**
 * GET USER DELIVERIES
 */
const getUserDeliveries = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
    const deliveryStatus = req?.query?.delivery_status; 
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    // console.log(deliveryStatus, limit, current_page);
    const skip = (current_page - 1) * limit; 

    /** Firstly, find user */ 
    const userFound = await User.findOne({ username: username }).lean();

    let deliveries, deliveriesCount; 
    let deliveriesList = []; 

    if (deliveryStatus == 'all') {
        deliveries = await Order.find({ user: userFound?._id, deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!deliveries?.length) return res.status(404).json({ message: "No deliveries found!" }); 

        deliveriesCount = await Order.countDocuments({ user: userFound?._id, deleted_at: null });

    } else {
        // if (deliveryStatus == 'pending' || deliveryStatus == 'undelivered') deliveryStatus = { $in: ['undelivered', 'pending'] };
        deliveries = await Order.find({ user: userFound?._id, deleted_at: null, delivery_status: deliveryStatus }) 
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
        if (!deliveries?.length) return res.status(404).json({ message: "No deliveries found!" }); 

        deliveriesCount = await Order.countDocuments({ user: userFound?._id, deleted_at: null, delivery_status: deliveryStatus });
    }

    /** Order Items within Deliveries */ 
    if (deliveries?.length) {
        const updatePromises = deliveries?.map(async order => { 
            let foundOrderItems = await OrderItem.find({ user: userFound?._id, order: order?._id, deleted_at: null })
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
 * GET USER ORDER ITEMS
 */
const getUserOrderItems = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    /** Firstly, find user */ 
    const userFound = await User.findOne({ username: username }).lean();

	const orderItems = await OrderItem.find({ user: userFound?._id, deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .populate({
                                        path: 'order', 
                                    })
                                    .populate({
                                        path: 'product', 
                                    })
                                    .populate({
                                        path: 'user', 
                                        select: 'first_name last_name username' 
                                    })
                                    .lean(); 
                                    
    if (!orderItems?.length) return res.status(404).json({ message: "No order items found!" }); 

    // Order items count 
    const orderItemsCount = await OrderItem.find({ user: userFound?._id, deleted_at: null }).countDocuments(); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(orderItemsCount / limit), 
                    total_results: orderItemsCount 
                }, 
                data: orderItems 
            });
}); 

/**
 * GET USER ORDERS
 */
const getUserOrders = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
    const paymentStatus = req?.query?.payment_status
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    const skip = (current_page - 1) * limit; 

    /** Firstly, find user */ 
    const userFound = await User.findOne({ username: username }).lean();

    let orders, ordersCount; 
    let ordersList = [];

    if (paymentStatus == 'all') {
        orders = await Order.find({ user: userFound?._id, deleted_at: null })
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
        orders = await Order.find({ user: userFound?._id,  deleted_at: null, paid: paymentStatus }) 
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
            let foundOrderItems = await OrderItem.find({ user: userFound?._id, order: order?._id, deleted_at: null })
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
 * GET USER PAYMENTS
 */
const getUserPayments = asyncHandler(async (req, res) => {
    const username = req?.params?.username; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    let userFound = await User.findOne({ username: username }).lean(); 
    if (!userFound) return res.status(404).json({ message: "User not found!" }); 

    const payments = await Order.find({ user: userFound?._id, deleted_at: null, paid: true })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!payments?.length) return res.status(404).json({ message: "No payments found!" }); 

    const total = await Order.countDocuments({ user: userFound?._id, deleted_at: null, paid: true }); 

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

/**
 * GET USER PRODUCT REVIEWS
 */
const getUserProductReviews = asyncHandler(async (req, res) => {
    const username = req?.params?.username; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    let productReviews; 
    let total; 
    let rating; 
    let userFound = await User.findOne({ username: username }).lean(); 
    if (!userFound) return res.status(404).json({ message: "User not found!" }); 
    
    if (req?.query?.stars != 'all') {
        const stars = parseInt(req.query.stars);
        if ([1, 2, 3, 4, 5].includes(stars)) {
            rating = stars; 
        } 

        productReviews = await ProductReview.find({ deleted_at: null, 
                                                    rating: rating, 
                                                    user: userFound?._id })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .populate({
                                                path: 'order', 
                                            })
                                            .populate({
                                                path: 'order_item', 
                                                select: 'product', 
                                                populate: { 
                                                    path: 'product', 
                                                }
                                            })
                                            .populate({
                                                path: 'user', 
                                                select: 'first_name last_name username' 
                                            })
                                            .lean(); 

        total = await ProductReview.find({ deleted_at: null, rating: rating, user: userFound?._id }).countDocuments(); 
    } else if (req?.query?.stars == 'all') {
        const stars = parseInt(req.query.stars);
        if ([1, 2, 3, 4, 5].includes(stars)) {
            rating = stars; 
        } 

        productReviews = await ProductReview.find({ deleted_at: null, 
                                                    user: userFound?._id })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .populate({
                                                path: 'order', 
                                            })
                                            .populate({
                                                path: 'order_item', 
                                                select: 'product', 
                                                populate: { 
                                                    path: 'product', 
                                                }
                                            })
                                            .populate({
                                                path: 'user', 
                                                select: 'first_name last_name username' 
                                            })
                                            .lean(); 

        total = await ProductReview.find({ deleted_at: null, user: userFound?._id }).countDocuments(); 
    }

    if (!productReviews?.length) {
        return res.status(404).json({ message: "No product reviews found!" }); 
    } else {
        res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: productReviews 
            });
    }
});

/**
 * GET USER PURCHASES
 */
const getUserPurchases = asyncHandler(async (req, res) => {
    const username = req?.params?.username; 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    /** Firstly, find user */ 
    const userFound = await User.findOne({ username: username }).lean();

    // const purchases = await Product.find({ deleted_at: null })
    const purchases = await Product.find({ user: userFound?._id, deleted_at: null, purchased_for_resale: true })
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .populate({
                                path: 'user',
                                select: 'first_name last_name username'
                            })
                            .lean(); 
    if (!purchases?.length) return res.status(404).json({ message: "No purchases found!" }); 

    // const total = await Product.countDocuments({ deleted_at: null }); 
    const total = await Product.countDocuments({ user: userFound?._id, deleted_at: null, purchased_for_resale: true }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: purchases 
            });
});

/**
 * GET USER QUERY RESPONSES
 */
const getUserQueryResponses = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
});


export { getUsers, 
		createUser, 
		getUser, 
		updateUser, 
		deleteUser, 
        restoreUser, 
        destroyUser, 
    
        getUserClientQueries, 
        getUserDeliveries, 
        getUserOrderItems, 
        getUserOrders, 
        getUserPayments, 
        getUserProductReviews, 
        getUserPurchases, 
        getUserQueryResponses }; 