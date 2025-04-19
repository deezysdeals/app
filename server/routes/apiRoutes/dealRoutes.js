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
        .post(authenticated, checkRoles(roles.admin, roles.superAdmin), createDeal); 

dealRouter.route('/:id')
        .get(getDeal)
        .put(authenticated, checkRoles(roles.admin, roles.superAdmin), updateDeal)
        .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteDeal)
        .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyDeal); 

dealRouter.route('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreDeal)


export default dealRouter; 