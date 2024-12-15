import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function usePurchases(range = 'all') {
    const axiosInstance = useAxios(); 
    const [purchases, setPurchases] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getPurchases(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getPurchases(range, { signal } = {}) { 
        console.log(range) 
        return axiosInstance.get(`dashboard/purchases?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPurchases(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { purchases, getPurchases }; 
} 
 