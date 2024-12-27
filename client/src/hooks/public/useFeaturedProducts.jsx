import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useFeaturedProducts() {
    // const axiosInstance = useAxios(); 
    const [featuredProducts, setFeaturedProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getFeaturedProducts({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getFeaturedProducts({}, { signal } = {}) { 
        setFeaturedProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/products/featured`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setFeaturedProducts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { featuredProducts, getFeaturedProducts }; 
} 
 