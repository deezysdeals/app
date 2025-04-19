import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function usePopularProducts() {
    // const axiosInstance = useAxios(); 
    const [popularProducts, setPopularProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getPopularProducts({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getPopularProducts({}, { signal } = {}) { 
        setPopularProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/products/popular`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPopularProducts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { popularProducts, getPopularProducts }; 
} 
 