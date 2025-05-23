import express from 'express'; 
const productDescriptionRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { deleteProductDescription,
        restoreProductDescription, 
        destroyProductDescription
} from '../../controllers/productDescriptionController.js'; 


productDescriptionRouter.route('/:id')
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteProductDescription)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyProductDescription); 

productDescriptionRouter.patch('/:id/restore', authenticated, restoreProductDescription); 


export default productDescriptionRouter; 