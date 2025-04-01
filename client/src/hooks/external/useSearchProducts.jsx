import { useEffect, useState } from 'react'; 
import useAxiosAmazonParazun from '@/utils/useAxiosAmazonParazun.jsx'; 


export function useSearchProducts(productQuery) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const axiosInstanceAmazonParazun = useAxiosAmazonParazun();
    const [searchProducts, setSearchProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getSearchProducts(productQuery, { signal: controller.signal }); 
        return () => { controller.abort() }; 
    }, [productQuery]); 

    async function getSearchProducts({ signal } = {}) {
        setLoading(true);

        // return axiosInstanceAmazonParazun.get(`product-details/?asin=B00FLYWNYQ&country=${ country }`, { signal })
        return axiosInstanceAmazonParazun.get(`search/?keywords=${productQuery?.keywords}&page=${productQuery?.page}`, { signal })
            .then(response => {
                console.log(response);
                setSearchProducts(response);
            })
            .catch(error => { 
                console.log(error);
                setErrors(error);
            })
            .finally(() => setLoading(false));
    }

    return { searchProducts, getSearchProducts }; 
}