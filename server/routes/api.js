import express from 'express'; 

const router = express.Router();
import authRouter from './apiRoutes/authRoutes.js'; 
import addressRouter from './apiRoutes/addressRoutes.js'; 
import brandRouter from './apiRoutes/brandRoutes.js'; 
import categoryRouter from './apiRoutes/categoryRoutes.js'; 
import deliveryModeRouter from './apiRoutes/deliveryModeRoutes.js'; 
import deliveryRouter from './apiRoutes/deliveryRoutes.js'; 
import dealRouter from './apiRoutes/dealRoutes.js'; 
import favoriteRouter from './apiRoutes/favoriteRoutes.js'; 
import mailNotificationRouter from './apiRoutes/mailNotificationRoutes.js'; 
import orderItemRouter from './apiRoutes/orderItemRoutes.js'; 
import orderRouter from './apiRoutes/orderRoutes.js'; 
import paymentRouter from './apiRoutes/paymentRoutes.js'; 
import productRouter from './apiRoutes/productRoutes.js'; 
import productReviewRouter from './apiRoutes/productReviewRoutes.js';
import productVariationRouter from './apiRoutes/productVariationRoutes.js'; 
import productVariationValueRouter from './apiRoutes/productVariationValueRoutes.js'; 
import productImageRouter from './apiRoutes/productImageRoutes.js'; 
import profitRouter from './apiRoutes/profitRoutes.js'; 
import purchaseRouter from './apiRoutes/purchaseRoutes.js'; 
import userRouter from './apiRoutes/userRoutes.js'; 
import saleRouter from './apiRoutes/saleRoutes.js'; 
import signInAttemptRouter from './apiRoutes/signInAttemptRoutes.js'; 
import trendingRouter from './apiRoutes/trendingRoutes.js'; 

import siteConfigurationRouter from './apiRoutes/siteConfigurationRoutes.js'; 
import sitePaymentConfigurationRouter from './apiRoutes/sitePaymentConfigurationRoutes.js'; 
import tiktokRouter from './apiRoutes/tiktokRoutes.js'; 
import twitterXRouter from './apiRoutes/twitterXRoutes.js'; 
import socialRouter from './apiRoutes/socialRoutes.js'; 
import dashboardRouter from './apiRoutes/dashboardRoutes.js'; 
import chatBotRouter from './apiRoutes/chatBotRoutes.js'; 


router.use('/auth', authRouter); 
router.use('/addresses', addressRouter); 
router.use('/brands', brandRouter); 
router.use('/categories', categoryRouter); 
router.use('/delivery-modes', deliveryModeRouter); 
router.use('/deliveries', deliveryRouter); 
router.use('/deals', dealRouter); 
router.use('/favorites', favoriteRouter); 
router.use('/notifications', mailNotificationRouter); 
router.use('/order-items', orderItemRouter); 
router.use('/orders', orderRouter); 
router.use('/payments', paymentRouter); 
router.use('/products', productRouter); 
router.use('/product-reviews', productReviewRouter); 
router.use('/product-variations', productVariationRouter); 
router.use('/product-variation-values', productVariationValueRouter); 
router.use('/product-images', productImageRouter); 
router.use('/profits', profitRouter); 
router.use('/purchases', purchaseRouter); 
router.use('/users', userRouter); 
router.use('/sales', saleRouter); 
router.use('/sign-in-attempts', signInAttemptRouter); 
router.use('/trendings', trendingRouter); 

router.use('/dashboard', dashboardRouter); 
router.use('/chat-bot', chatBotRouter); 
router.use('/site-configurations', siteConfigurationRouter); 
router.use('/site-payment-configurations', sitePaymentConfigurationRouter); 
router.use('/social-media/tiktok', tiktokRouter); 
router.use('/social-media/twitter-x', twitterXRouter); 
router.use('/social-media', socialRouter); 


export default router;