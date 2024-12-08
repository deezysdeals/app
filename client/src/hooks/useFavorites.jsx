import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useFavorites(page = 1, limit = 10, search = '') {
    const axiosInstance = useAxios(); 
    const [favorites, setFavorites] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getFavorites({page}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [page, limit, search]); 

    // async function getFavorites(range = 'all', page = 1, { signal } = {}) { 
    async function getFavorites(obj, { signal } = {}) { 
        console.log(obj) 
        return axiosInstance.get(`favorites?page=${obj?.page?.page}&limit=${obj?.page?.limit}&search=${obj?.page?.search}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setFavorites(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { favorites, getFavorites }; 
} 
 