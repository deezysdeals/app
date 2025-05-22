import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useAmazonAffiliateProducts() {
    // const axiosInstance = useAxios(); 
    const [amazonAffiliateProducts, setAmazonAffiliateProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getAmazonAffiliateProducts({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getAmazonAffiliateProducts({}, { signal } = {}) { 
        setAmazonAffiliateProducts([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/products/amazon-affiliate-linked`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setAmazonAffiliateProducts(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { amazonAffiliateProducts, getAmazonAffiliateProducts }; 
} 
