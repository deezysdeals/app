import express from 'express'; 
const twitterXRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
// import { getOAuth, 
//         getOAuthCallback, 
//         getVideos, 
//         createVideo } from '../../controllers/socialControllers/tiktokController.js'; 
import { tweet } from '../../controllers/socialControllers/twitterXController.js';


// twitterRouter.get('/', getOAuth); 
// twitterRouter.get('/callback', getOAuthCallback); 

// twitterRouter.route('/videos')
//             .get(getVideos)
//             .post(createVideo); 

twitterXRouter.post('/tweet', tweet); 


export default twitterXRouter; 