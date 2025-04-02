import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useProducts(productQuery) {
    const axiosInstance = useAxios(); 
    const [products, setProducts] = useState([]); 

    useEffect(() => {
        if (productQuery !== null) {
            const controller = new AbortController(); 
            getProducts(productQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [productQuery]); 

    async function getProducts(productQuery, { signal } = {}) {
        // return axiosInstance.get(`products?page=${page}&limit=${limit}`, { signal }) 
        setProducts([]);
        
        return axios.get(`${ Constants?.serverURL }/api/v1/products/quick-version?page=${productQuery?.page}&limit=${productQuery?.limit}&search_key=${productQuery?.search_key}&price_range_start=${productQuery?.price_range_start}&price_range_end=${productQuery?.price_range_end}`, { signal })
            .then(response => setProducts(response?.data))
            .catch(error => console.log(error));
    } 

    return { products, getProducts, setProducts }; 
} 
