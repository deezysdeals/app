import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useNotifications(notificationQuery) {
    const axiosInstance = useAxios(); 
    const [notifications, setNotifications] = useState([]); 

    useEffect(() => {
        if (notificationQuery !== null) {
            const controller = new AbortController(); 
            getNotifications(notificationQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [notificationQuery]); 

    async function getNotifications(notificationQuery, { signal } = {}) { 
        // console.log(notificationQuery); 
        // setNotifications([]); 
        return axiosInstance.get(`notifications?page=${notificationQuery?.page}&limit=${notificationQuery?.limit}`, { signal }) 
            .then(response => { 
                // console.log(response?.data);
                setNotifications(response?.data);
            })
            .catch(error => console.log(error)); 
    } 

    return { notifications, getNotifications, setNotifications }; 
} 
 