import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


// export function useOrders(orderRange = 'all', type = 'all', page = 1, limit = 10, user = '', delivery_status = 'all', paid = 'true') {
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

    // async function getOrders(range = 'all', type = 'all', page = 1, { signal } = {}) { 
    async function getOrders(orderQuery, { signal } = {}) { 
        console.log(orderQuery); 
        return axiosInstance.get(`orders?page=${orderQuery?.page}&limit=${orderQuery?.limit}&delivery_status=${orderQuery?.delivery_status}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setOrders(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { orders, getOrders }; 
} 
 