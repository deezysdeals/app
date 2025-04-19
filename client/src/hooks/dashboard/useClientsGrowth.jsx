import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useClientsGrowth(range = 'all') {
    const axiosInstance = useAxios(); 
    const [clientsGrowth, setClientsGrowth] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getClientsGrowth(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getClientsGrowth(range, { signal } = {}) { 
        console.log(range) 
        setClientsGrowth([]);
        return axiosInstance.get(`dashboard/client-growth?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setClientsGrowth(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { clientsGrowth, getClientsGrowth }; 
} 
 