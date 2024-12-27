import express from 'express'; 
const trendingRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getTrendings, getMiniTrendings } from '../../controllers/otherControllers/publicPages/trendingController.js'; 


trendingRouter.get('/mini-trendings', getMiniTrendings); 
trendingRouter.get('/', getTrendings); 


export default trendingRouter; 