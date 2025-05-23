import express from 'express'; 
const productFeatureRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { deleteProductFeature,
        restoreProductFeature, 
        destroyProductFeature
} from '../../controllers/productFeatureController.js'; 


productFeatureRouter.route('/:id')
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteProductFeature)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyProductFeature); 

productFeatureRouter.patch('/:id/restore', authenticated, restoreProductFeature); 


export default productFeatureRouter; 