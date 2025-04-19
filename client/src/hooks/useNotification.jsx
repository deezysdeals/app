import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useNotification(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getNotification(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function getNotification(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`notifications/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function readNotification(notification) { 
        // console.log('notification:', notification); 
        return axiosInstance.put(`notifications/${notification}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function deleteNotification(notification) { 
        // console.log('notification:', notification); 
        return axiosInstance.patch(`notifications/${notification}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreNotification(notification) {
        return axiosInstance.patch(`notifications/${notification?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyNotification(notification) {
        return axiosInstance.delete(`notifications/${notification?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        notification: { data, setData, errors, loading }, 
        getNotification, 
        readNotification, 
        deleteNotification, 
        restoreNotification, 
        destroyNotification, 
    }
}