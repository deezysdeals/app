import express from 'express'; 
const productInfoRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { deleteProductInfo,
        restoreProductInfo, 
        destroyProductInfo
} from '../../controllers/productInfoController.js'; 


productInfoRouter.route('/:id')
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteProductInfo)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyProductInfo); 

productInfoRouter.patch('/:id/restore', authenticated, restoreProductInfo); 


export default productInfoRouter; 