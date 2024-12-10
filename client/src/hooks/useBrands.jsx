import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useBrands(brandQuery) {
    const axiosInstance = useAxios(); 
    const [brands, setBrands] = useState([]); 

    useEffect(() => {
        if (brandQuery !== null) {
            const controller = new AbortController(); 
            getBrands(brandQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [brandQuery]); 

    async function getBrands(brandQuery, { signal } = {}) { 
        // console.log(brandQuery);

        setBrands([]); 
        return axiosInstance.get(`brands?page=${brandQuery?.page}&limit=${brandQuery?.limit}&search=${brandQuery?.search}`, { signal }) 
            .then(response => setBrands(response?.data))
            .catch(error => console.log(error));
    } 

    return { brands, getBrands, setBrands }; 
} 
