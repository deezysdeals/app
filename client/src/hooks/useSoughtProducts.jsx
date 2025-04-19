import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useSoughtProducts(productQuery) {
    const navigate = useNavigate(); 
    // const axiosInstance = useAxios(); 
    const [soughtProducts, setSoughtProducts] = useState([]); 

    useEffect(() => {
        if (productQuery !== null) {
            const controller = new AbortController(); 
            getSoughtProducts(productQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [productQuery]); 

    async function getSoughtProducts(productQuery, { signal } = {}) {
        navigate(route('products.index', { source: 'shop'}));

        // return axiosInstance.get(`products?page=${page}&limit=${limit}`, { signal }) 
        return axios.get(`${ Constants?.serverURL }/api/v1/products?page=${productQuery?.page}&limit=${productQuery?.limit}&search_key=${productQuery?.search_key}&price_range_start=${productQuery?.price_range_start}&price_range_end=${productQuery?.price_range_end}`, { signal })
            .then(response => setProducts(response?.data))
            .catch(error => {
                console.log(error);
            });
    } 

    return { soughtProducts, getSoughtProducts, setSoughtProducts }; 
} 
