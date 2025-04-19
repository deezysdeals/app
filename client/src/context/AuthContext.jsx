import { createContext, useState, useEffect } from 'react'; 
import swal from 'sweetalert2'; 
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Constants from '@/utils/Constants.jsx'; 

const AuthContext = createContext(); 

export default AuthContext; 


export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage?.getItem('deezysdeals_auth_tokens') 
            ? JSON.parse(localStorage?.getItem('deezysdeals_auth_tokens')) 
            : null); 
    
    const [user, setUser] = useState(() => 
        localStorage?.getItem('deezysdeals_auth_tokens') 
            ? jwtDecode(localStorage?.getItem('deezysdeals_auth_tokens')) 
            : null); 

    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate(); 


    /** Routes */ 

    const signUp = async (username, email, firstname, lastname, password, account_type, enterpriseName = '') => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-up`, { username, email, first_name: firstname, last_name: lastname, password, account_type, enterprise_name: enterpriseName }, { withCredentials: true })
            .then((response) => { 
                // console.log(response); 
                navigate(route('sign-in')); 
                swal.fire({
                    text: 'Registration successful. An email with a verification link has been sent to you.',  
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
            .catch(error => { 
                // console.log(error); 
                if (error?.response?.status == '400') {
                    swal.fire({
                        // text: `${error?.response?.status}: Something went wrong!`, 
                        text: `${error?.response?.status}: Something went wrong!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else if (error?.response?.status == '409') {
                    swal.fire({
                        text: `${error?.response?.status}: Username / Email already taken`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: ${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                }
            });
    } 

    const verifyEmail = async (username, token) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/verify-email/${ username }/${ token }`, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                setAuthTokens(response?.data); 
                setUser(jwtDecode(response?.data?.access)); 
                localStorage?.setItem('deezysdeals_auth_tokens', JSON?.stringify(response?.data)); 
                navigate(route('home.index')); 
            })
            .catch(error => { 
                // console.log(error); 
                navigate(route('sign-in')); 
                if (error?.response?.status == '400') {
                    swal.fire({
                        text: `${error?.response?.data}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: Something went wrong!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                }
            });
    }

    const signIn = async (email_username, password) => { 
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-in`, { email_username, password }, { withCredentials: true })
            .then((response) => { 
                    // console.log(response?.data);
                    // console.log(response);
                    setAuthTokens(response?.data); 
                    setUser(jwtDecode(response?.data?.access)); 
                    // console.log(user);
                    // console.log(authTokens);
                    localStorage.setItem('deezysdeals_auth_tokens', JSON.stringify(response?.data)); 
                    // If Sign-in is successful
                    // navigate(route('home.index')); 
                    const lastVisitedPage = localStorage.getItem('deezysdeals_last_visited_page') || route('home.index');
                    // localStorage.removeItem('deezysdeals_last_visited_page'); 
                    navigate(lastVisitedPage); 

                })
            .catch(error => { 
                console.log(error);
                if (error?.response?.status == '401') {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else if (error?.response?.status == '429') {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    swal.fire({
                        // text: `${error?.response?.status}: Something went wrong!`, 
                        text: `Something went wrong!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                }
            });
    } 

    const passwordlessSignInRequest = async (username) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/passwordless-signin-request`, { username }, { withCredentials: true })
            .then((response) => { 
                // console.log(response); 
                swal.fire({
                    text: `${response?.data?.success}`,
                    color: "#820303",
                    width: 350,
                    position: 'top',
                    showConfirmButton: false,
                });
            })
            .catch(error => {
                // console.log(error);
                if (error?.response?.status == '401') {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: Something went wrong!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                }
            })
    } 

    const passwordlessSignIn = async (username, token) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/passwordless-signin/${ username }/${ token }`, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                setAuthTokens(response?.data); 
                setUser(jwtDecode(response?.data?.access)); 
                localStorage?.setItem('deezysdeals_auth_tokens', JSON?.stringify(response?.data)); 
                navigate(route('home.index')); 
            })
            .catch(error => { 
                // console.log(error); 
                navigate(route('sign-in')); 
                if (error?.response?.status == '400') {
                    swal.fire({
                        text: `${error?.response?.data}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: Something went wrong!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                }
            });
    }

    const signOut = async () => { 
        // localStorage.removeItem('deezysdeals_last_visited_page');
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-out`, { withCredentials: true })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setAuthTokens(null); 
                setUser(null); 
                localStorage?.removeItem('deezysdeals_auth_tokens'); 
                // navigate(route('sign-in'));
            })
    } 

    const resetPasswordRequest = async (email) => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/password-reset`, { email }, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                swal.fire({
                    text: 'Email notification with reset link was sent to your email.', 
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                })
            })
            .catch(error => {
                // console.log(error); 
                // console.log(error?.response?.data?.message); 
                swal.fire({
                    // text: `${error?.response?.status}: Something went wrong!`, 
                    text: `${ error?.response?.data?.message }`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
    } 

    const resetPassword = async (username, token, password) => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/password-reset/${ username }/${ token }`, { password }, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                navigate(route('sign-in')); 
                swal.fire({
                    text: 'Password reset successful.', 
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                })
            })
            .catch(error => {
                // console.log(error); 
                swal.fire({
                    text: `${error?.response?.status}: ${error?.response?.data?.message}`, 
                    color: '#900000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
    }; 


    let contextData = {
        user, 
        setUser, 
        authTokens, 
        setAuthTokens, 
        signUp, 
        verifyEmail, 
        signIn, 
        passwordlessSignInRequest, 
        passwordlessSignIn, 
        signOut, 
        resetPasswordRequest, 
        resetPassword
    } 

    useEffect(() => {
        if (authTokens?.authorization) setUser(jwtDecode(authTokens?.authorization?.token)); 
        setLoading(false); 
    }, [authTokens, loading]); 


    return (
        <AuthContext.Provider value={ contextData }>
            { loading ? null : children }
        </AuthContext.Provider>
    )
}