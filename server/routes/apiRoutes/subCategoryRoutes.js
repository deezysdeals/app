import express from 'express'; 
const subCategoryRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSubCategories, 
        createSubCategory, 
        getSubCategory, 
        updateSubCategory, 
        deleteSubCategory,
        restoreSubCategory, 
        destroySubCategory
} from '../../controllers/subCategoryController.js'; 


subCategoryRouter.route('/')
                .get(getSubCategories)
                .post(authenticated, checkRoles(roles.vendor, roles.admin, roles.superAdmin), createSubCategory); 

subCategoryRouter.route('/:id')
                .get(getSubCategory)
                .put(authenticated, checkRoles(roles.vendor, roles.admin, roles.superAdmin), updateSubCategory)
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteSubCategory)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroySubCategory); 
        
subCategoryRouter.patch('/:id/restore', restoreSubCategory); 


export default subCategoryRouter; 