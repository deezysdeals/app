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
        getSoldProducts } from '../../controllers/productController.js'; 


/** Additional Routes */
productRouter.get('/purchases', getPurchasedProducts); 
productRouter.get('/sales-of-purchases', getSoldProducts); 


/** Main Routes */
productRouter.patch('/:id/restore', authenticated, restoreProduct); 

productRouter.route('/:id')
                .get(getProduct)
                .put(authenticated, updateProduct)
                .patch(authenticated, deleteProduct)
                .delete(authenticated, destroyProduct); 

productRouter.route('/')
                .get(getProducts)
                .post(authenticated, createProduct); 


export default productRouter; 