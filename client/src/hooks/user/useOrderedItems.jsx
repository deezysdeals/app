import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useOrderedItems(username) {
    let page = 1, limit = 10
    const axiosInstance = useAxios(); 
    const [orderedItems, setOrderedItems] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getOrderedItems({username, page, limit}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [page, limit, username]); 

    async function getOrderedItems(page = 1, { signal } = {}) { 
        console.log(page);
        setOrderedItems([]); 
        return axiosInstance.get(`users/${username}/ordered-items?page=${page}&limit=${limit}`, { signal }) 
            .then(response => setOrderedItems(response?.data))
            .catch(error => console.log(error));
    } 

    return { orderedItems, getOrderedItems }; 
} 