import express from 'express'; 
const productVariationValueRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProductVariationValues, 
        createProductVariationValue, 
        getProductVariationValue, 
        updateProductVariationValue, 
        deleteProductVariationValue,
        restoreProductVariationValue, 
        destroyProductVariationValue
} from '../../controllers/productVariationValueController.js'; 


productVariationValueRouter.route('/')
                .get(getProductVariationValues)
                .post(authenticated, createProductVariationValue); 

productVariationValueRouter.route('/:id')
                .get(getProductVariationValue)
                .put(authenticated, checkRoles(roles.vendor,
                                                roles.admin, 
                                                roles.superAdmin), updateProductVariationValue)
                .patch(authenticated, checkRoles(roles.vendor, 
                                                roles.admin, 
                                                roles.superAdmin), deleteProductVariationValue)
                .delete(authenticated, destroyProductVariationValue); 

productVariationValueRouter.route('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreProductVariationValue)


export default productVariationValueRouter; 