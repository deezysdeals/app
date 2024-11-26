import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useUsers(userRange = 'all', role = 'user', type = 'all',  page = 1, limit = 10) {
    const axiosInstance = useAxios(); 
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        if (page !== null) {
            const controller = new AbortController(); 
            getUsers({userRange}, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [role, userRange, type, page, limit]); 

    async function getUsers(obj, { signal } = {}) { 
        console.log(obj);
        return axiosInstance.get(`users?role=${obj?.userRange?.role}&range=${obj?.userRange?.range}&type=${obj?.userRange?.type}&page=${obj?.userRange?.page}&limit=${obj?.userRange?.limit}`, { signal }) 
            .then(response => setUsers(response?.data))
            .catch(error => console.log(error));
    } 

    return { users, getUsers }; 
} 
