import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
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
        // return axiosInstance.get(`brands?page=${brandQuery?.page}&limit=${brandQuery?.limit}&search=${brandQuery?.search}`, { signal }) 
        return axios.get(`${ Constants?.serverURL }/api/v1/brands?page=${brandQuery?.page}&limit=${brandQuery?.limit}&search=${brandQuery?.search}`, { signal }) 
            .then(response => setBrands(response?.data))
            .catch(error => console.log(error));
    } 

    return { brands, getBrands, setBrands }; 
} 
