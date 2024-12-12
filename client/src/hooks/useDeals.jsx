import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDeals(dealQuery) {
    const axiosInstance = useAxios(); 
    const [deals, setDeals] = useState([]); 

    useEffect(() => {
        if (dealQuery !== null) {
            const controller = new AbortController(); 
            getDeals(dealQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [dealQuery]); 

    async function getDeals(dealQuery, { signal } = {}) { 
        console.log(dealQuery);
        // console.log(dealQuery?.page); 
        // const { page, limit, stars } = dealQuery; 
        // console.log(page, limit, stars) 
        setDeals([]); 
        return axiosInstance.get(`deals?page=${dealQuery?.page}&limit=${dealQuery?.limit}`, { signal }) 
            .then(response => setDeals(response?.data))
            .catch(error => console.log(error));
    } 

    return { deals, getDeals, setDeals }; 
} 
