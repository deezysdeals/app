import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function usePopularCategories() {
    // const axiosInstance = useAxios(); 
    const [popularCategories, setPopularCategories] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getPopularCategories({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getPopularCategories({}, { signal } = {}) { 
        setPopularCategories([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/categories/popular`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPopularCategories(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { popularCategories, getPopularCategories }; 
} 
 