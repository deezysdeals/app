import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDeliveries(deliveryQuery) {
    const axiosInstance = useAxios(); 
    const [deliveries, setDeliveries] = useState([]); 

    useEffect(() => {
        if (deliveryQuery !== null) {
            const controller = new AbortController(); 
            getDeliveries(deliveryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [deliveryQuery]); 

    // async function getDeliveries(range = 'all', type = 'all', page = 1, { signal } = {}) { 
    async function getDeliveries(deliveryQuery, { signal } = {}) { 
        // console.log(deliveryQuery); 
        setDeliveries([]); 
        // console.log(deliveries);
        return axiosInstance.get(`deliveries?page=${deliveryQuery?.page}&limit=${deliveryQuery?.limit}&delivery_status=${deliveryQuery?.delivery_status}`, { signal }) 
            .then(response => { 
                // console.log(response?.data)
                setDeliveries(response?.data)
            })
            .catch(error => {
                // console.log(error);
            }); 
    } 

    return { deliveries, getDeliveries }; 
} 
 