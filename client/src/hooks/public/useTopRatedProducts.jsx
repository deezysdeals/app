import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useTopRatedProducts() {
    // const axiosInstance = useAxios(); 
    const [topRatedProducts, setTopRatedProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getTopRatedProducts({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getTopRatedProducts({}, { signal } = {}) { 
        setTopRatedProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/products/top-rated`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setTopRatedProducts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { topRatedProducts, getTopRatedProducts }; 
} 
 