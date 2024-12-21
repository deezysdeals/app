import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSales(saleQuery) {
    const axiosInstance = useAxios(); 
    const [sales, setSales] = useState([]); 

    useEffect(() => {
        if (saleQuery !== null) {
            const controller = new AbortController(); 
            getSales(saleQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [saleQuery]); 

    async function getSales(saleQuery, { signal } = {}) { 
        console.log(saleQuery); 
        setSales([]); 
        return axiosInstance.get(`sales?page=${saleQuery?.page}&limit=${saleQuery?.limit}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setSales(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { sales, getSales }; 
} 
 