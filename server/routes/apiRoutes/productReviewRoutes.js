import express from 'express'; 
const productReviewRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProductReviews, 
        createProductReview, 
        getProductReview, 
        updateProductReview, 
        deleteProductReview,
        restoreProductReview, 
        destroyProductReview
} from '../../controllers/productReviewController.js'; 


productReviewRouter.use(authenticated); 

productReviewRouter.route('/')
                .get(getProductReviews)
                .post(authenticated, createProductReview); 

productReviewRouter.route('/:id')
                .get(getProductReview)
                .put(authenticated, updateProductReview)
                .patch(authenticated, deleteProductReview)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyProductReview); 

productReviewRouter.patch('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreProductReview); 


export default productReviewRouter; 