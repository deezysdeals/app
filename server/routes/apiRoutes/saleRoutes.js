import express from 'express'; 
const saleRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSales } from '../../controllers/otherControllers/saleController.js'; 


saleRouter.use(authenticated); 

saleRouter.get('/', getSales); 


export default saleRouter; 