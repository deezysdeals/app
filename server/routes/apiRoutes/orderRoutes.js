import express from 'express'; 
const orderRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getOrders, 
        createOrder, 
        // updatePayPalOrderID, 
        // captureOrder, 
        // markAsPaidOrder,
        getOrder, 
        updateOrder, 
        deleteOrder, 
        restoreOrder, 
        destroyOrder
} from '../../controllers/orderController.js'; 
import { createOrderPayment, 
        captureOrderPayment, 
        authorizeOrderPayment, 
        captureAuthorisedOrderPayment
} from '../../controllers/otherControllers/orderPayPalPaymentController.js';


orderRouter.use(authenticated); 

/** Additional Routes */
/** Payment */ 
orderRouter.post('/payments', createOrderPayment); 
orderRouter.post('/payments/:orderID/capture', captureOrderPayment); 
orderRouter.post('/payments/:orderID/authorize', authorizeOrderPayment); 
orderRouter.post('/payments/:authorizationId/captureAuthorize', captureAuthorisedOrderPayment); 


/** Main Routes */
orderRouter.route('/')
                .get(getOrders)
                .post(createOrder); 

orderRouter.route('/:id')
                .get(getOrder)
                .put(updateOrder)
                .patch(deleteOrder)
                .delete(destroyOrder); 

orderRouter.patch('/:id/restore', restoreOrder); 
// orderRouter.patch('/:id/update-paypal-order-id', updatePayPalOrderID); 
// orderRouter.post('/:orderID/:payerID/:paymentID/:paymentSource/capture', captureOrder); 
// orderRouter.post('/:id/mark-as-paid', markAsPaidOrder); 




export default orderRouter; 