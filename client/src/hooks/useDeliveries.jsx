import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDeliveries(deliveryRange = 'all', type = 'all', page = 1, limit = 10, user = '') {
    const axiosInstance = useAxios(); 
    const [deliveries, setDeliveries] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getDeliveries({deliveryRange}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [deliveryRange, type, page, limit, user]); 

    async function getDeliveries(obj, { signal } = {}) {
        console.log(obj); 

        return axiosInstance.get(`deliveries?range=${obj?.deliveryRange?.range}&type=${obj?.deliveryRange?.type}&page=${obj?.deliveryRange?.page}&limit=${obj?.deliveryRange?.limit}&user=${obj?.deliveryRange?.user}`, { signal })
            .then(response => {
                console.log(response?.data); 
                setDeliveries(response?.data); 
            })
            .catch(error => {
                console.log(error)
            });
    } 

    return { deliveries, getDeliveries }; 
}