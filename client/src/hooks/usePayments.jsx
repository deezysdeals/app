import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function usePayments(paymentQuery) {
    const axiosInstance = useAxios(); 
    const [payments, setPayments] = useState([]); 

    useEffect(() => {
        if (paymentQuery !== null) {
            const controller = new AbortController(); 
            getPayments(paymentQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [paymentQuery]); 

    async function getPayments(paymentQuery, { signal } = {}) { 
        console.log(paymentQuery); 
        setPayments([]); 
        return axiosInstance.get(`payments?page=${paymentQuery?.page}&limit=${paymentQuery?.limit}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setPayments(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { payments, getPayments }; 
} 
 