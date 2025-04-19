import express from 'express'; 
const chatBotRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { chatBot } from '../../controllers/otherControllers/chatBotController.js'; 


// dashboardRouter.use(authenticated); 

chatBotRouter.post('/messages', chatBot); 


export default chatBotRouter; 