import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useCategories(categoryQuery) {
    const axiosInstance = useAxios(); 
    const [categories, setCategories] = useState([]); 

    useEffect(() => {
        if (categoryQuery !== null) {
            const controller = new AbortController(); 
            getCategories(categoryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [categoryQuery]); 

    async function getCategories(categoryQuery, { signal } = {}) { 
        // console.log(categoryQuery);

        setCategories([]); 
        // return axiosInstance.get(`categories?page=${categoryQuery?.page}&limit=${categoryQuery?.limit}&search=${categoryQuery?.search}`, { signal }) 
        return axios.get(`${ Constants?.serverURL }/api/v1/categories?page=${categoryQuery?.page}&limit=${categoryQuery?.limit}&search=${categoryQuery?.search}`, { signal }) 
            .then(response => setCategories(response?.data))
            .catch(error => console.log(error));
    } 

    return { categories, getCategories, setCategories }; 
} 
