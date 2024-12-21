import express from 'express'; 
const purchaseRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getPurchases } from '../../controllers/otherControllers/purchaseController.js'; 


purchaseRouter.use(authenticated); 

purchaseRouter.get('/', getPurchases); 


export default purchaseRouter; 