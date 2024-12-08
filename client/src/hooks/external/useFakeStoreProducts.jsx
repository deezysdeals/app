import { useEffect, useState } from 'react'; 
import useAxiosFakeStore from '@/utils/useAxiosFakeStore.jsx'; 


export function useProductsExt(limit = '10') {
    const axiosFakeStoreInstance = useAxiosFakeStore();
    const [productsExt, setProductsExt] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getProductsExt({ signal: controller.signal }); 
        return () => { controller.abort() }; 
    }, []); 

    async function getProductsExt({ signal } = {}) {
        // return axiosFakeStoreInstance.get(`/products?limit=${limit}`, { signal })
        return axiosFakeStoreInstance.get(`/products`, { signal })
            .then(response => {
                console.log(response);
                setProductsExt(response);
            })
            .catch(error => { console.log(error) });
    } 

    return { productsExt, getProductsExt }; 
}