import { useContext } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { jwtDecode } from 'jwt-decode'; 
import dayjs from 'dayjs'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 

const baseURL = `${ Constants?.serverURL }/api/v1`; 


const useAxios = () => {
    const navigate = useNavigate(); 
    const { authTokens, setUser, setAuthTokens, signOut } = useContext(AuthContext); 

    const axiosInstance = axios.create({
        baseURL, 
        headers: {
            'Authorization': `Bearer ${ authTokens?.access }`, 
            'Content-Type': 'multipart/form-data', 
        }
    }, { withCredentials: true }); 

    axiosInstance.interceptors.request.use(async req => {
        const user = jwtDecode(authTokens?.access); 
        const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1; 

        if (!isExpired) return req;

        // const response = await axios.post(`${ baseURL }/auth/refresh-token`, {
        //     // refresh: authTokens?.refresh
        // }, {
        //     headers: {
        //         'Authorization': `Bearer ${ authTokens?.access }`, 
        //         'Content-Type': 'application/json', 
        //     }
        // }, { 
        //     withCredentials: true 
        // }); 

        // const response = await axios.post(`${ baseURL }/auth/refresh-token`, {}, 
        // {
        //     headers: {
        //         'Authorization': `Bearer ${ authTokens?.access }`, 
        //         'Content-Type': 'application/json', 
        //     }
        // }, 
        // { 
        //     withCredentials: true 
        // }); 

        // localStorage?.setItem('deezysdeals_auth_tokens', JSON?.stringify(response?.data)); 

        /** Refresh Token */
        let response; 

        try {
            response = await axios.post(
                `${baseURL}/auth/refresh-token`, 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens?.access}`, 
                        'Content-Type': 'application/json', 
                    }
                }, 
                { 
                    withCredentials: true 
                }
            );

            // If successful, store the response data in localStorage
            localStorage?.setItem('deezysdeals_auth_tokens', JSON?.stringify(response?.data));

        } catch (error) {
            // Catching and handling any errors

            if (error.response) {
                // The request was made, and the server responded with a status code that falls out of the range of 2xx
                // console.error('Error response:', error.response.data);
                // console.error('Error status:', error.response.status);
                // console.error('Error headers:', error.response.headers);

                // You can handle different status codes here, for example:
                if (error.response.status === 401) {
                    console.log('Unauthorized! Maybe the refresh token has expired.');
                    // Handle refresh token expiration, redirect to login, etc.
                }

                // You can handle different status codes here, for example:
                if (error.response.status === 403) {
                    signOut();
                    navigate(route('sign-in'));
                }

            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
        }
        /** End of Refresh Token */

        setAuthTokens(response?.data); 
        setUser(jwtDecode(response?.data?.access)); 

        req.headers.Authorization = `Bearer ${response?.data?.access}`; 
        return req;
    }); 

    axiosInstance.interceptors.response.use(
        response => response, 
        error => {
            console.log('error:', error); 
            if (error?.response?.status === 401) { 
                signOut();
                navigate(route('sign-in'));
            } else if ((error?.status == 403) || (error?.response?.status == 403)) {
                swal.fire({
                    text: `${error?.response?.data?.message || error?.response?.statusText}`, 
                    // text: `${error?.response?.statusText}`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            } else if (error?.response?.status == 409) {
                swal.fire({
                    text: `${error?.response?.data?.message}`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            } 
            // else if (error?.response?.status == 500) {
            //     swal.fire({
            //         text: `${error?.response?.status}: An error occured!`, 
            //         color: '#900000', 
            //         width: 325, 
            //         position: 'top', 
            //         showConfirmButton: false
            //     });
            // }
            return Promise.reject(error);
        }
    ) 
    
    return axiosInstance;
} 


export default useAxios; 