import express from 'express'; 
const deliveryRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDeliveries,  
        markDelivered
} from '../../controllers/otherControllers/deliveryController.js'; 


deliveryRouter.use(authenticated); 

/** Main Routes */
deliveryRouter.get('/', getDeliveries); 

deliveryRouter.route('/:id')
                .patch(markDelivered); 


export default deliveryRouter; 