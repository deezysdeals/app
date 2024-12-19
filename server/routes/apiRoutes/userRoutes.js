import express from 'express'; 
const userRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getUsers, 
        createUser, 
        getUser, 
        updateUser, 
        deleteUser,
        restoreUser, 
        destroyUser, 

        getUserClientQueries, 
        getUserDeliveries, 
        getUserOrderItems, 
        getUserOrders, 
        getUserPayments, 
        getUserProductReviews, 
        getUserPurchases, 
        getUserQueryResponses
} from '../../controllers/userController.js'; 


/** Additional Routes */
userRouter.get('/:username/client-queries', getUserClientQueries); 
userRouter.get('/:username/deliveries', getUserDeliveries); 
userRouter.get('/:username/ordered-items', getUserOrderItems); 
userRouter.get('/:username/orders', getUserOrders); 
userRouter.get('/:username/payments', getUserPayments); 
userRouter.get('/:username/product-reviews', getUserProductReviews); 
userRouter.get('/:username/purchases', getUserPurchases); 
userRouter.get('/:username/query-responses', getUserQueryResponses); 


/** Main Routes */
userRouter.use(authenticated); 

userRouter.route('/')
                .get(getUsers)
                .post(createUser); 

userRouter.route('/:username')
                .get(getUser)
                .put(updateUser)
                .patch(deleteUser)
                .delete(destroyUser); 

userRouter.patch('/:id/restore', restoreUser); 



// Admins
// userRouter.get('/admins', getAdmins);

// userRouter.get('/admins/:username', getAdmin); 



// Clients
// userRouter.get('/clients', getClients); 

// userRouter.get('/clients/:username', getClient); 



export default userRouter; 