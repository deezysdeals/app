import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSales(page = 1, limit = 10) {
    const axiosInstance = useAxios(); 
    const [sales, setSales] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getSales({page, limit}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [page, limit]); 

    async function getSales(page = 1, { signal } = {}) {
        return axiosInstance.get(`products/sales-of-purchases?page=${page}&limit=${limit}`, { signal }) 
            .then(response => setSales(response?.data))
            .catch(error => console.log(error));
    } 

    return { sales, getSales }; 
} 
