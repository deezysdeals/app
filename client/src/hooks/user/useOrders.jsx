import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrders(orderQuery) {
    const axiosInstance = useAxios(); 
    const [orders, setOrders] = useState([]); 

    useEffect(() => {
        if (orderQuery !== null) {
            const controller = new AbortController(); 
            getOrders(orderQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [orderQuery]); 

    async function getOrders(orderQuery, { signal } = {}) { 
        console.log(orderQuery);
        setOrders([]); 
        return axiosInstance.get(`users/${orderQuery?.username}/orders?page=${orderQuery?.page}&limit=${orderQuery?.limit}`, { signal }) 
            .then(response => setOrders(response?.data))
            .catch(error => console.log(error));
    } 

    return { orders, getOrders }; 
} 
