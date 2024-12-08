import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function usePurchases(page = 1, limit = 10) {
    const axiosInstance = useAxios(); 
    const [purchases, setPurchases] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getPurchases({page, limit}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [page, limit]); 

    async function getPurchases(page = 1, { signal } = {}) {
        return axiosInstance.get(`products/purchases?page=${page}&limit=${limit}`, { signal }) 
            .then(response => setPurchases(response?.data))
            .catch(error => console.log(error));
    } 

    return { purchases, getPurchases }; 
} 
