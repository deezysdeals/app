import express from 'express'; 
const deliveryModeRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDeliveryModes, 
        createDeliveryMode, 
        getDeliveryMode, 
        updateDeliveryMode, 
        deleteDeliveryMode, 
        restoreDeliveryMode, 
        destroyDeliveryMode
} from '../../controllers/deliveryModeController.js'; 


deliveryModeRouter.route('/')
                .get(getDeliveryModes)
                .post(authenticated, checkRoles(roles.admin, roles.superAdmin), createDeliveryMode); 

deliveryModeRouter.route('/:id')
                .get(getDeliveryMode)
                .put(authenticated, checkRoles(roles.admin, roles.superAdmin), updateDeliveryMode)
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteDeliveryMode)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyDeliveryMode); 

deliveryModeRouter.route('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreDeliveryMode);


export default deliveryModeRouter; 