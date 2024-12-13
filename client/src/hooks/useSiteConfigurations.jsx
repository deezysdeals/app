import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSiteConfigurations() { 
    const [errors, setErrors] = useState(false); 
    const axiosInstance = useAxios(); 
    const [siteConfigurations, setSiteConfigurations] = useState({}); 

    useEffect(() => {
        const controller = new AbortController(); 
        getSiteConfigurations({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getSiteConfigurations({}, { signal } = {}) { 
        setSiteConfigurations([]); 
        return axiosInstance.get(`site-configurations`, { signal }) 
            .then(response => setSiteConfigurations(response?.data))
            .catch(error => {
                console.log(error); 
                setErrors(error);
            });
    } 

    return { siteConfigurations, getSiteConfigurations }; 
} 
