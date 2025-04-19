import express from 'express'; 
const productVariationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProductVariations, 
        createProductVariation, 
        getProductVariation, 
        updateProductVariation, 
        deleteProductVariation,
        restoreProductVariation, 
        destroyProductVariation
} from '../../controllers/productVariationController.js'; 


productVariationRouter.route('/')
                .get(getProductVariations)
                .post(authenticated, checkRoles(roles.vendor,
                                                roles.admin, 
                                                roles.superAdmin), createProductVariation); 

productVariationRouter.route('/:id')
                .get(getProductVariation)
                .put(authenticated, checkRoles(roles.vendor,
                                                roles.admin,
                                                roles.superAdmin), updateProductVariation)
                .patch(authenticated, checkRoles(roles.vendor,
                                                roles.admin,
                                                roles.superAdmin), deleteProductVariation)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyProductVariation); 

productVariationRouter.patch('/:id/restore', authenticated, checkRoles(roles.admin, 
                                                                        roles.superAdmin), restoreProductVariation); 


export default productVariationRouter; 