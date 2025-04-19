import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useProfits(profitQuery) {
    const axiosInstance = useAxios(); 
    const [profits, setProfits] = useState([]); 

    useEffect(() => {
        if (profitQuery !== null) {
            const controller = new AbortController(); 
            getProfits(profitQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [profitQuery]); 

    async function getProfits(profitQuery, { signal } = {}) { 
        // console.log(profitQuery); 
        // setProfits([]); 
        return axiosInstance.get(`profits?page=${profitQuery?.page}&limit=${profitQuery?.limit}`, { signal }) 
            .then(response => { 
                // console.log(response?.data);
                setProfits(response?.data);
            })
            .catch(error => {
                // console.log(error);
            }); 
    } 

    return { profits, getProfits }; 
} 
 