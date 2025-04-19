import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDealProducts(dealProductQuery) {
    const axiosInstance = useAxios(); 
    const [dealProducts, setDealProducts] = useState([]); 

    useEffect(() => {
        if (dealProductQuery !== null) {
            const controller = new AbortController(); 
            getDealProducts(dealProductQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [dealProductQuery]); 

    async function getDealProducts(dealProductQuery, { signal } = {}) {
        setDealProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/deals/${dealProductQuery?.deal}/products?page=${dealProductQuery?.page}&limit=${dealProductQuery?.limit}&search=${dealProductQuery?.search}`, { signal })
            .then(response => setDealProducts(response?.data))
            .catch(error => console.log(error));
    } 

    return { dealProducts, getDealProducts, setDealProducts }; 
} 
