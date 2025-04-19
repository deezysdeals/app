import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useQueryResponses(queryResponsesQuery) {
    const axiosInstance = useAxios(); 
    const [queryResponses, setQueryResponses] = useState([]); 

    useEffect(() => {
        if (queryResponsesQuery !== null) {
            const controller = new AbortController(); 
            getQueryResponses(queryResponsesQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [queryResponsesQuery]); 

    async function getQueryResponses(queryResponsesQuery, { signal } = {}) { 
        console.log(queryResponsesQuery);
        setQueryResponses([]); 
        return axiosInstance.get(`users/${queryResponsesQuery?.username}/query-responses?page=${queryResponsesQuery?.page}&limit=${queryResponsesQuery?.limit}`, { signal }) 
            .then(response => setQueryResponses(response?.data))
            .catch(error => console.log(error));
    } 

    return { queryResponses, getQueryResponses }; 
} 
