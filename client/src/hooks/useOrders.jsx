import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrders(orderRange = 'all', type = 'all', page = 1, limit = 10) {
    const axiosInstance = useAxios(); 
    const [orders, setOrders] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getOrders({orderRange}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [orderRange, type, page, limit]); 

    // async function getOrders(range = 'all', type = 'all', page = 1, { signal } = {}) { 
    async function getOrders(obj, { signal } = {}) { 
        console.log(obj) 
        return axiosInstance.get(`orders?range=${obj?.orderRange?.range}&type=${obj?.orderRange?.type}&page=${obj?.orderRange?.page}&limit=${obj?.orderRange?.limit}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setOrders(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { orders, getOrders }; 
} 
 