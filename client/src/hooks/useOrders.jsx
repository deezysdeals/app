import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrders(orderRange = 'all', type = 'all', page = 1, limit = 10, user = '', delivery_status = 'all', paid = 'true') {
    const axiosInstance = useAxios(); 
    const [orders, setOrders] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getOrders({orderRange}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [orderRange, type, page, limit, user, delivery_status, paid]); 

    // async function getOrders(range = 'all', type = 'all', page = 1, { signal } = {}) { 
    async function getOrders(obj, { signal } = {}) { 
        console.log(obj) 
        return axiosInstance.get(`orders?range=${obj?.orderRange?.range}&type=${obj?.orderRange?.type}&page=${obj?.orderRange?.page}&limit=${obj?.orderRange?.limit}&user=${obj?.orderRange?.user}&delivery_status=${obj?.orderRange?.delivery_status}&paid=${obj?.orderRange?.paid}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setOrders(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { orders, getOrders }; 
} 
 