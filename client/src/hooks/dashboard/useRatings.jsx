import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useRatings(range = 'all') {
    const axiosInstance = useAxios(); 
    const [ratings, setRatings] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getRatings(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getRatings(range, { signal } = {}) { 
        console.log(range) 
        return axiosInstance.get(`dashboard/ratings?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setRatings(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { ratings, getRatings }; 
} 
 