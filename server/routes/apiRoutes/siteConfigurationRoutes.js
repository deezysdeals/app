import express from 'express'; 
const siteConfigurationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSiteConfigurations, 
        createSiteConfiguration, 
        getSiteConfiguration, 
        updateSiteConfiguration, 
        deleteSiteConfiguration,
        restoreSiteConfiguration, 
        destroySiteConfiguration
} from '../../controllers/siteConfigurationController.js'; 


siteConfigurationRouter.route('/')
                .get(getSiteConfigurations)
                .post(authenticated, createSiteConfiguration); 

siteConfigurationRouter.route('/:id')
                .get(getSiteConfiguration)
                .put(updateSiteConfiguration)
                .patch(deleteSiteConfiguration)
                .delete(destroySiteConfiguration); 
        
siteConfigurationRouter.patch('/:id/restore', restoreSiteConfiguration); 


export default siteConfigurationRouter; 