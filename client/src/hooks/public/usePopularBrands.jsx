import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function usePopularBrands() {
    // const axiosInstance = useAxios(); 
    const [popularBrands, setPopularBrands] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getPopularBrands({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getPopularBrands({}, { signal } = {}) { 
        setPopularBrands([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/brands/popular`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPopularBrands(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { popularBrands, getPopularBrands }; 
} 
 