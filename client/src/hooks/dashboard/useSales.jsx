import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useSales(range = 'all') {
    const axiosInstance = useAxios(); 
    const [sales, setSales] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getSales(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getSales(range, { signal } = {}) { 
        console.log(range); 
        setSales([])
        return axiosInstance.get(`dashboard/sales?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setSales(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { sales, getSales }; 
} 
 