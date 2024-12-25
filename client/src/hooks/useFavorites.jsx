import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useFavorites(favoriteQuery) {
    const axiosInstance = useAxios(); 
    const [favorites, setFavorites] = useState([]); 

    useEffect(() => {
        if (favoriteQuery !== null) {
            const controller = new AbortController(); 
            getFavorites(favoriteQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [favoriteQuery]); 

    // async function getFavorites(range = 'all', page = 1, { signal } = {}) { 
    async function getFavorites(favoriteQuery, { signal } = {}) { 
        console.log(favoriteQuery); 
        setFavorites([]); 
        return axiosInstance.get(`favorites?page=${favoriteQuery?.page?.page}&limit=${favoriteQuery?.page?.limit}&search=${favoriteQuery?.page?.search}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setFavorites(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { favorites, getFavorites }; 
} 
 