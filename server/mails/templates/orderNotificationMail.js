import ejs from 'ejs'; 
import { fileURLToPath } from 'url'; 
import { dirname, join, resolve } from 'path'; 
const __dirname = dirname(fileURLToPath(import.meta.url)); 
import sendMail from '../../mails/sendMail.js'; 


const orderPlacedNoticationMailTemplate = async (user, order) => {
    const mailSubject = `${process.env.APP_NAME + ': New Order No.' + (order?._id)}`; 

    const mailBody = await ejs.renderFile(resolve(__dirname, '..', '..', 'views', 'emails', 'orderPlacedEmailTemplate.ejs'), {  
        user: `${user?.first_name} ${user?.last_name}`, 
        orderLink: `${process?.env?.CLIENT_URL}/home/orders/${order?._id}`
    }); 

    await sendMail(process.env.EMAIL_ADDRESS, user?.email, mailSubject, mailBody);
};  


export default orderPlacedNoticationMailTemplate;