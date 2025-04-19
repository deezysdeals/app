import express from 'express'; 
const siteConfigurationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSiteConfigurations, 
        createSiteConfigurations, 
        createUpdateSiteConfigurations
} from '../../controllers/otherControllers/siteConfigurationController.js'; 


// siteConfigurationRouter.use(authenticated); 

siteConfigurationRouter.route('/')
                .get(getSiteConfigurations)
                .post(authenticated, checkRoles(roles.admin, roles.superAdmin), createSiteConfigurations)
                .patch(authenticated, createUpdateSiteConfigurations); 


export default siteConfigurationRouter; 