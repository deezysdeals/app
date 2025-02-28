import express from 'express'; 
const brandRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getBrands, 
        createBrand, 
        getBrand, 
        updateBrand, 
        deleteBrand,
        restoreBrand, 
        destroyBrand
} from '../../controllers/brandController.js'; 
import { getPopularBrands, 
        getBrandsPublicVersion, 
        getBrandProducts } from '../../controllers/otherControllers/publicPages/brandController.js'


/** Public Pages Routes */
brandRouter.get('/quick-version', getBrandsPublicVersion); 
brandRouter.get('/popular', getPopularBrands); 
brandRouter.get('/:brand/products', getBrandProducts); 


/** Main Routes */
brandRouter.route('/')
                .get(getBrands)
                // .post(authenticated, (checkRoles(roles.admin) || checkRoles(roles.dispatcher)), createBrand); 
                .post(authenticated, checkRoles(roles.admin, roles.superAdmin), createBrand); 

brandRouter.route('/:id')
                .get(getBrand)
                .put(authenticated, checkRoles(roles.admin, roles.superAdmin), updateBrand)
                .patch(authenticated, checkRoles(roles.admin, roles.superAdmin), deleteBrand)
                .delete(authenticated, checkRoles(roles.admin, roles.superAdmin), destroyBrand); 

brandRouter.patch('/:id/restore', authenticated, checkRoles(roles.admin, roles.superAdmin), restoreBrand);


export default brandRouter; 