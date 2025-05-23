import express from 'express'; 
const categoryProductRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { deleteCategoryProduct,
        restoreCategoryProduct, 
        destroyCategoryProduct
} from '../../controllers/categoryProductController.js'; 


categoryProductRouter.route('/:id')
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteCategoryProduct)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyCategoryProduct); 

categoryProductRouter.patch('/:id/restore', authenticated, restoreCategoryProduct); 


export default categoryProductRouter; 