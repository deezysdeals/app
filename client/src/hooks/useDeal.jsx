import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useDeal(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getDeal(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createDeal(deal) {
        setLoading(true); 
        setErrors({}); 

        console.log(deal); 
        // return axiosInstance.post(`deals/deal/${deal}`)
        return axiosInstance.postForm('deals', deal)
            .then(response => {
                setData(response?.data); 
                // setLoading(false); 
                console.log(response);
            })
            .catch(error => {
                setErrors(error?.response); 
                // setLoading(false); 
                if (error?.response?.status == 409) {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: An error occured!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
                console.log(error);
            })
            .finally(() => setLoading(false));
    } 

    async function getDeal(id, page, limit) {
        setLoading(true); 

        return axiosInstance.get(`deals/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function updateDeal(deal) {
        setLoading(true); 
        setErrors({}); 
        console.log(deal);

        return axiosInstance.put(`deals/${id}`, deal)
            .then(() => navigate(route('home.deals.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function deleteDeal(deal) { 
        console.log('deal:', deal); 
        return axiosInstance.patch(`deals/${deal}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreDeal(deal) {
        return axiosInstance.patch(`deals/${deal?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyDeal(deal) {
        return axiosInstance.delete(`deals/${deal?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        deal: { data, setData, errors, loading }, 
        createDeal, 
        getDeal, 
        updateDeal, 
        deleteDeal, 
        destroyDeal, 
        restoreDeal
    }
}