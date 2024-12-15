import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrders(range = 'all') {
    const axiosInstance = useAxios(); 
    const [orders, setOrders] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getOrders(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getOrders(range, { signal } = {}) { 
        console.log(range) 
        return axiosInstance.get(`dashboard/orders?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setOrders(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { orders, getOrders }; 
} 
 