import express from 'express'; 
const tiktokRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getOAuth, 
        getOAuthCallback, 
        getVideos, 
        createVideo } from '../../controllers/socialControllers/tiktokController.js';


tiktokRouter.get('/', getOAuth); 
tiktokRouter.get('/callback', getOAuthCallback); 

tiktokRouter.route('/videos')
            .get(getVideos)
            .post(createVideo); 


export default tiktokRouter; 