// const checkRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         if (!req?.role) return res.sendStatus(403); 
//         const rolesArray = [...allowedRoles]; 
//         const result = req?.role?.map(role => rolesArray.includes(role)).find(val => val === true); 
//         if (!result) return res.sendStatus(403); 
//         next();
//     };
// }; 

// const checkRoles = (allowedRole) => {
//     return (req, res, next) => {
//         if (!req?.role) return res.sendStatus(403); 
//         if (req.role !== allowedRole) return res.sendStatus(403); 
//         next();
//     };
// }; 

const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // if (!req?.role) return res.sendStatus(403); 
        if (!req?.role) return res.status(403).json({ message: "User not authorised to access resource!" }); 
        if (!allowedRoles.includes(req.role)) return res.status(403).json({ message: "User not authorised to access resource!" });
        next();
    };
};


export default checkRoles