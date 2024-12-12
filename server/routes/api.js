import express from 'express'; 

const router = express.Router();
import authRouter from './apiRoutes/authRoutes.js'; 
import addressRouter from './apiRoutes/addressRoutes.js'; 
import brandRouter from './apiRoutes/brandRoutes.js'; 
import categoryRouter from './apiRoutes/categoryRoutes.js'; 
import deliveryModeRouter from './apiRoutes/deliveryModeRoutes.js'; 
import dealRouter from './apiRoutes/dealRoutes.js'; 
import favoriteRouter from './apiRoutes/favoriteRoutes.js'; 
import orderItemRouter from './apiRoutes/orderItemRoutes.js'; 
import orderRouter from './apiRoutes/orderRoutes.js'; 
// import paymentRouter from './apiRoutes/paymentRoutes.js'; 
import productRouter from './apiRoutes/productRoutes.js'; 
import productReviewRouter from './apiRoutes/productReviewRoutes.js';
import productVariationRouter from './apiRoutes/productVariationRoutes.js'; 
import productVariationValueRouter from './apiRoutes/productVariationValueRoutes.js'; 
import productImageRouter from './apiRoutes/productImageRoutes.js'; 
import userRouter from './apiRoutes/userRoutes.js'; 
import signInAttemptRouter from './apiRoutes/signInAttemptRoutes.js'; 


router.use('/auth', authRouter); 
router.use('/addresses', addressRouter); 
router.use('/brands', brandRouter); 
router.use('/categories', categoryRouter); 
router.use('/delivery-modes', deliveryModeRouter); 
router.use('/deals', dealRouter); 
router.use('/favorites', favoriteRouter); 
router.use('/order-items', orderItemRouter); 
router.use('/orders', orderRouter); 
router.use('/products', productRouter); 
router.use('/product-reviews', productReviewRouter); 
router.use('/product-variations', productVariationRouter); 
router.use('/product-variation-values', productVariationValueRouter); 
router.use('/product-images', productImageRouter); 
router.use('/users', userRouter); 
router.use('/sign-in-attempts', signInAttemptRouter); 


export default router;