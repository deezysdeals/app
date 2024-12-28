import express from 'express'; 
const categoryRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getCategories, 
        createCategory, 
        getCategory, 
        updateCategory, 
        deleteCategory,
        restoreCategory, 
        destroyCategory
} from '../../controllers/categoryController.js'; 
import { getCategoriesPublicVersion, 
        getPopularCategories, 
        getCategoryProducts } from '../../controllers/otherControllers/publicPages/categoryController.js'


/** Public Pages Routes */
categoryRouter.get('/quick-version', getCategoriesPublicVersion); 
categoryRouter.get('/popular', getPopularCategories); 
categoryRouter.get('/:category/products', getCategoryProducts); 


categoryRouter.route('/')
                .get(getCategories)
                .post(authenticated, createCategory); 

categoryRouter.route('/:id')
                .get(getCategory)
                .put(authenticated, updateCategory)
                .patch(authenticated, deleteCategory)
                .delete(authenticated, destroyCategory); 

categoryRouter.patch('/:id/restore', restoreCategory)


export default categoryRouter; 