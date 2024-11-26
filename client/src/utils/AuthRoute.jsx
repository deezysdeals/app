import { useContext } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { route } from '@/routes'; 


const AuthRoute = () => {
    let { user } = useContext(AuthContext); 

    return user ? <Navigate to={ route('home.index') } /> : <Outlet />; 
}; 


export default AuthRoute; 