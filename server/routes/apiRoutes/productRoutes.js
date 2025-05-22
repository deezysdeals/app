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
        makeProductFeatured, 
        getSoldProducts } from '../../controllers/productController.js'; 
import { getProductsPublicVersion, 
        getFeaturedProducts, 
        getPopularProducts, 
        getTopRatedProducts, 
        getAmazonAffiliateLinkProducts, 
        getSuggestedProducts } from '../../controllers/otherControllers/publicPages/productController.js'


/** Public Pages Routes */
productRouter.get('/quick-version', getProductsPublicVersion); 
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/popular', getPopularProducts); 
productRouter.get('/top-rated', getTopRatedProducts); 
productRouter.get('/amazon-affiliate-linked', getAmazonAffiliateLinkProducts); 
productRouter.get('/suggested', getSuggestedProducts); 


/** Additional Routes */
productRouter.get('/purchases', authenticated, checkRoles(roles.admin, roles.superAdmin), getPurchasedProducts); 
productRouter.get('/sales-of-purchases', authenticated, checkRoles(roles.admin, roles.superAdmin), getSoldProducts); 


/** Main Routes */
productRouter.post('/add-to-shop/:id', authenticated, checkRoles(roles.admin, roles.superAdmin), addToShop); 
productRouter.patch('/make-featured/:id', authenticated, checkRoles(roles.admin, roles.superAdmin), makeProductFeatured); 
// productRouter.patch('/make-featured/:id', authenticated, makeProductFeatured); 

productRouter.patch('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreProduct); 

productRouter.route('/:id')
                .get(getProduct)
                .put(authenticated, checkRoles(roles.vendor,
                                                roles.admin, 
                                                roles.superAdmin), updateProduct)
                .patch(authenticated, checkRoles(roles.vendor,
                                                roles.admin, 
                                                roles.superAdmin), deleteProduct)
                .delete(authenticated, destroyProduct); 
                // .post(authenticated, addToShop)

productRouter.route('/')
                .get(getProducts)
                .post(authenticated, checkRoles(roles.admin, roles.superAdmin), createProduct); 


export default productRouter; 