import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useSuggestedProducts() {
    // const axiosInstance = useAxios(); 
    const [suggestedProducts, setSuggestedProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getSuggestedProducts({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getSuggestedProducts({}, { signal } = {}) { 
        setSuggestedProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/products/suggested`, { signal }) 
            .then(response => { 
                console.log(response?.data);
                setSuggestedProducts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { suggestedProducts, getSuggestedProducts }; 
} 
 