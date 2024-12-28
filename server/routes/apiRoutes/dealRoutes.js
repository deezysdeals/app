import express from 'express'; 
const dealRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDeals, 
        createDeal, 
        getDeal, 
        updateDeal, 
        deleteDeal,
        restoreDeal, 
        destroyDeal
} from '../../controllers/dealController.js'; 
import { getDealProducts } from '../../controllers/otherControllers/publicPages/dealController.js'


/** Public Pages Routes */
dealRouter.get('/:deal/products', getDealProducts); 


/** Main Routes */
dealRouter.route('/')
                .get(getDeals)
                .post(authenticated, createDeal); 

dealRouter.route('/:id')
                .get(getDeal)
                .put(authenticated, updateDeal)
                .patch(authenticated, deleteDeal)
                .delete(authenticated, destroyDeal); 

dealRouter.route('/:id/restore', authenticated, restoreDeal)


export default dealRouter; 