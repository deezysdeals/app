import allowedOrigins from './allowedOrigins.js';


const corsOptions = {
    origin: (origin, callback) => {
        if ((allowedOrigins?.indexOf(origin) !== -1) || !origin) {
        // if (!origin || allowedOrigins?.includes(origin)) {
            // console.log('true')
            callback(null, true)
        } else {
            // console.log('false')
            callback(new Error('CORS Restriction'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}; 


export default corsOptions; 
