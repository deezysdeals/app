import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSignInAttempts(signInRange = 'all', page = 1, limit = 10) {
    const axiosInstance = useAxios(); 
    const [signInAttempts, setSignInAttempts] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getSignInAttempts({signInRange}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [signInRange, page, limit]); 

    // async function getSignInAttempts(range = 'all', type = 'all', page = 1, { signal } = {}) { 
    async function getSignInAttempts(obj, { signal } = {}) { 
        console.log(obj) 
        return axiosInstance.get(`sign-in-attempts?range=${obj?.signInRange?.range}&page=${obj?.signInRange?.page}&limit=${obj?.signInRange?.limit}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setSignInAttempts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { signInAttempts, getSignInAttempts }; 
} 
 