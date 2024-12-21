import express from 'express'; 
const paymentRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getPayments } from '../../controllers/otherControllers/paymentController.js'; 


paymentRouter.use(authenticated); 

paymentRouter.get('/', getPayments); 


export default paymentRouter; 