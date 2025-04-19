import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useBrandProducts(brandProductQuery) {
    const axiosInstance = useAxios(); 
    const [brandProducts, setBrandProducts] = useState([]); 

    useEffect(() => {
        if (brandProductQuery !== null) {
            const controller = new AbortController(); 
            getBrandProducts(brandProductQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [brandProductQuery]); 

    async function getBrandProducts(brandProductQuery, { signal } = {}) {
        setBrandProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/brands/${brandProductQuery?.brand}/products?page=${brandProductQuery?.page}&limit=${brandProductQuery?.limit}&search=${brandProductQuery?.search}`, { signal })
            .then(response => setBrandProducts(response?.data))
            .catch(error => console.log(error));
    } 

    return { brandProducts, getBrandProducts, setBrandProducts }; 
} 
