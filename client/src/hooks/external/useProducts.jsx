import { useEffect, useState } from 'react'; 
import useAxiosAmazonParazun from '@/utils/useAxiosAmazonParazun.jsx'; 


export function useProducts(productQuery) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const axiosInstanceAmazonParazun = useAxiosAmazonParazun();
    const [products, setProducts] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getProducts(productQuery, { signal: controller.signal }); 
        return () => { controller.abort() }; 
    }, [productQuery]); 

    async function getProducts({ signal } = {}) {
        setLoading(true);
        // setProducts([]);
        console.log(productQuery?.page);

        // return axiosInstanceAmazonParazun.get(`product-details/?asin=B00FLYWNYQ&country=${ country }`, { signal })
        return axiosInstanceAmazonParazun.get(`deals/?page=${productQuery?.page}`, { signal })
            .then(response => {
                console.log(response);
                setProducts(response);
            })
            .catch(error => { 
                console.log(error);
                setErrors(error);
            })
            .finally(() => setLoading(false));
    }

    return { products, getProducts }; 
}