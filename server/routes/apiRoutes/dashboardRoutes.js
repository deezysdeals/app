import express from 'express'; 
const dashboardRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getOrders, 
        getPurchases, 
        getCheckIns, 
        getClientsGrowth, 
        getRatings } from '../../controllers/functionalityControllers/dashboardController.js'; 


dashboardRouter.use(authenticated); 

dashboardRouter.get('/orders', getOrders); 
dashboardRouter.get('/purchases', getPurchases); 
dashboardRouter.get('/check-ins', getCheckIns); 
dashboardRouter.get('/client-growth', getClientsGrowth); 
dashboardRouter.get('/ratings', getRatings); 


export default dashboardRouter; 