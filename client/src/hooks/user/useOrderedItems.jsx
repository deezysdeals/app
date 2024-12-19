import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrderedItems(orderedItemQuery) {
    const axiosInstance = useAxios(); 
    const [orderedItems, setOrderedItems] = useState([]); 

    useEffect(() => {
        if (orderedItemQuery !== null) {
            const controller = new AbortController(); 
            getOrderedItems(orderedItemQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [orderedItemQuery]); 

    async function getOrderedItems(orderedItemQuery, { signal } = {}) { 
        console.log(orderedItemQuery);
        setOrderedItems([]); 
        return axiosInstance.get(`users/${orderedItemQuery?.username}/ordered-items?page=${orderedItemQuery?.page}&limit=${orderedItemQuery?.limit}`, { signal }) 
            .then(response => setOrderedItems(response?.data))
            .catch(error => console.log(error));
    } 

    return { orderedItems, getOrderedItems }; 
} 
