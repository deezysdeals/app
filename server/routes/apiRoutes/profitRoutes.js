import express from 'express'; 
const profitRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProfits } from '../../controllers/otherControllers/profitController.js'; 


profitRouter.use(authenticated); 

profitRouter.get('/', checkRoles(roles.admin, roles.superAdmin), getProfits); 


export default profitRouter; 