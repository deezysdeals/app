import express from 'express'; 
const mailNotificationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getMailNotifications, 
        readMailNotification,
        deleteMailNotification, 
        restoreMailNotification, 
        destroyMailNotification
} from '../../controllers/mailNotificationController.js'; 


mailNotificationRouter.use(authenticated); 

mailNotificationRouter.get('/', getMailNotifications); 

mailNotificationRouter.route('/:id')
                .put(readMailNotification)
                .patch(deleteMailNotification)
                .delete(destroyMailNotification); 

mailNotificationRouter.patch('/:id/restore', restoreMailNotification);


export default mailNotificationRouter; 