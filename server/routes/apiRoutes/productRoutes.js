import express from 'express'; 
const productRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProducts, 
        createProduct, 
        getProduct, 
        updateProduct, 
        deleteProduct,
        restoreProduct, 
        destroyProduct, 

        getPurchasedProducts, 
        addToShop, 
        getSoldProducts } from '../../controllers/productController.js'; 
import { getProductsPublicVersion, 
        getFeaturedProducts, 
        getPopularProducts, 
        getTopRatedProducts, 
        getSuggestedProducts } from '../../controllers/otherControllers/publicPages/productController.js'


/** Public Pages Routes */
productRouter.get('/quick-version', getProductsPublicVersion); 
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/popular', getPopularProducts); 
productRouter.get('/top-rated', getTopRatedProducts); 
// productRouter.get('/suggested', getSuggestedProducts); 


/** Additional Routes */
productRouter.get('/purchases', getPurchasedProducts); 
productRouter.get('/sales-of-purchases', getSoldProducts); 


/** Main Routes */
productRouter.post('/add-to-shop/:id', authenticated, addToShop); 

productRouter.patch('/:id/restore', authenticated, restoreProduct); 

productRouter.route('/:id')
                .get(getProduct)
                .put(authenticated, updateProduct)
                .patch(authenticated, deleteProduct)
                .delete(authenticated, destroyProduct); 
                // .post(authenticated, addToShop)

productRouter.route('/')
                .get(getProducts)
                .post(authenticated, createProduct); 


export default productRouter; 