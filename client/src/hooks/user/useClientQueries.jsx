import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useClientQueries(clientQueryQuery) {
    const axiosInstance = useAxios(); 
    const [clientQueries, setClientQueries] = useState([]); 

    useEffect(() => {
        if (clientQueryQuery !== null) {
            const controller = new AbortController(); 
            getClientQueries(clientQueryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [clientQueryQuery]); 

    async function getClientQueries(clientQueryQuery, { signal } = {}) { 
        console.log(clientQueryQuery);
        setClientQueries([]); 
        return axiosInstance.get(`users/${clientQueryQuery?.username}/client-queries?page=${clientQueryQuery?.page}&limit=${clientQueryQuery?.limit}`, { signal }) 
            .then(response => setClientQueries(response?.data))
            .catch(error => console.log(error));
    } 

    return { clientQueries, getClientQueries }; 
} 
