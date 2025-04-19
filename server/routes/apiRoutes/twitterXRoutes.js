import express from 'express'; 
const twitterXRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
// import { getOAuth, 
//         getOAuthCallback, 
//         getVideos, 
//         createVideo } from '../../controllers/socialControllers/tiktokController.js'; 
import { tweet, postTweet } from '../../controllers/socialControllers/twitterXController.js';


twitterXRouter.use(authenticated, checkRoles(roles.admin, roles.superAdmin)); 

// twitterRouter.get('/', getOAuth); 
// twitterRouter.get('/callback', getOAuthCallback); 

// twitterRouter.route('/videos')
//             .get(getVideos)
//             .post(createVideo); 

twitterXRouter.post('/tweet', tweet); 
twitterXRouter.post('/post-tweet', postTweet); 


export default twitterXRouter; 