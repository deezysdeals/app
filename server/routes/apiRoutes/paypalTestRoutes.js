import express from 'express'; 
const paypalTestRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { orderCreate,
        orderCapture
} from '../../controllers/otherControllers/paypalStandardController.js';


paypalTestRouter.use(authenticated); 

/** Additional Routes */
/** Payment */ 
paypalTestRouter.post('/payments', orderCreate); 
paypalTestRouter.post('/payments/:orderID/capture', orderCapture); 


export default paypalTestRouter; 