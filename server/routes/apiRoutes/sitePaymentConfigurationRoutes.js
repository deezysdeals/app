import express from 'express'; 
const sitePaymentConfigurationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSitePaymentConfigurations, 
        createUpdateSitePaymentConfiguration
} from '../../controllers/otherControllers/sitePaymentConfigurationController.js'; 


sitePaymentConfigurationRouter.use(authenticated, checkRoles(roles.admin, roles.superAdmin)); 

sitePaymentConfigurationRouter.route('/')
                                .get(getSitePaymentConfigurations)
                                .patch(createUpdateSitePaymentConfiguration); 


export default sitePaymentConfigurationRouter; 