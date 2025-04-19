import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useTotalExpenditure() {
    const axiosInstance = useAxios(); 
    const [totalExpenditure, setTotalExpenditure] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getTotalExpenditure({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 
 
    async function getTotalExpenditure({}, { signal } = {}) { 
        // console.log(); 
        setTotalExpenditure([])
        return axiosInstance.get(`dashboard/total-expenditure`, { signal }) 
            .then(response => { 
                console.log(response?.data);
                setTotalExpenditure(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { totalExpenditure, getTotalExpenditure }; 
} 
 