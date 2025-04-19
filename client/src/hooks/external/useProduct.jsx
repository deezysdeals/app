import { useState, useEffect } from 'react'; 
import useAxiosAmazonParazun from '@/utils/useAxiosAmazonParazun.jsx'; 


export function useProduct(asin = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const axiosInstanceAmazonParazun = useAxiosAmazonParazun();
    const [data, setData] = useState({}); 

    useEffect(() => {
        if (asin !== null) {
            const controller = new AbortController();
            getProduct(asin, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [asin]);

    async function getProduct(asin) {
        setLoading(true); 

        return axiosInstanceAmazonParazun.get(`product/?asin=${asin}`, { signal })
            .then(response => {
                console.log(response?.data);
                setData(response?.data);
            })
            .catch(error => {
                console.log(error?.response);
                setErrors(error?.response);
            })
            .finally(() => setLoading(false));
    }

    return {
        product: { data, setData, errors, loading }, 
        getProduct
    }
}