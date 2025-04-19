import express from 'express'; 
const socialRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSocials } from '../../controllers/socialControllers/socialController.js';


socialRouter.use(authenticated, checkRoles(roles.admin, roles.superAdmin)); 

socialRouter.get('/', getSocials); 


export default socialRouter; 