import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useCheckIns(range = 'all') {
    const axiosInstance = useAxios(); 
    const [checkIns, setCheckIns] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getCheckIns(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getCheckIns(range, { signal } = {}) { 
        console.log(range) 
        return axiosInstance.get(`dashboard/check-ins?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setCheckIns(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { checkIns, getCheckIns }; 
} 
 