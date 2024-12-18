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