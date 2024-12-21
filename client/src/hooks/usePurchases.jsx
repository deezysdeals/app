import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function usePurchases(purchaseQuery) {
    const axiosInstance = useAxios(); 
    const [purchases, setPurchases] = useState([]); 

    useEffect(() => {
        if (purchaseQuery !== null) {
            const controller = new AbortController(); 
            getPurchases(purchaseQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [purchaseQuery]); 

    async function getPurchases(purchaseQuery, { signal } = {}) { 
        console.log(purchaseQuery); 
        setPurchases([]); 
        return axiosInstance.get(`purchases?page=${purchaseQuery?.page}&limit=${purchaseQuery?.limit}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPurchases(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { purchases, getPurchases }; 
} 
 