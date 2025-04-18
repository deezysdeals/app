import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSocials(socialQuery) {
    const axiosInstance = useAxios(); 
    const [socials, setSocials] = useState([]); 

    useEffect(() => {
        if (socialQuery !== null) {
            const controller = new AbortController(); 
            getSocials(socialQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [socialQuery]); 

    async function getSocials(socialQuery, { signal } = {}) { 
        // console.log(socialQuery); 
        setSocials([]); 
        return axiosInstance.get(`social-media?page=${socialQuery?.page}&limit=${socialQuery?.limit}&network=${socialQuery?.network}`, { signal }) 
            .then(response => { 
                // console.log(response?.data);
                setSocials(response?.data);
            })
            .catch(error => {
                console.log(error);
            }); 
    } 

    return { socials, getSocials }; 
} 
