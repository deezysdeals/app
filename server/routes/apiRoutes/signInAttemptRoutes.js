import express from 'express'; 
const signInAttemptRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getSignInAttempts, 
        deleteSignInAttempt, 
        restoreSignInAttempt, 
        destroySignInAttempt
} from '../../controllers/authControllers/signInAttemptController.js'; 


signInAttemptRouter.use(authenticated, checkRoles(roles.admin, roles.superAdmin), ); 

signInAttemptRouter.get('/', getSignInAttempts); 

signInAttemptRouter.route('/:id')
                .patch(deleteSignInAttempt)
                .delete(destroySignInAttempt); 

signInAttemptRouter.patch('/:id/restore', restoreSignInAttempt);


export default signInAttemptRouter; 