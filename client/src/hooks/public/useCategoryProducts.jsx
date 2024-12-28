import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useCategoryProducts(categoryProductQuery) {
    const axiosInstance = useAxios(); 
    const [categoryProducts, setCategoryProducts] = useState([]); 

    useEffect(() => {
        if (categoryProductQuery !== null) {
            const controller = new AbortController(); 
            getCategoryProducts(categoryProductQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [categoryProductQuery]); 

    async function getCategoryProducts(categoryProductQuery, { signal } = {}) {
        setCategoryProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/categories/${categoryProductQuery?.category}/products?page=${categoryProductQuery?.page}&limit=${categoryProductQuery?.limit}&search=${categoryProductQuery?.search}`, { signal })
            .then(response => setCategoryProducts(response?.data))
            .catch(error => console.log(error));
    } 

    return { categoryProducts, getCategoryProducts, setCategoryProducts }; 
} 
