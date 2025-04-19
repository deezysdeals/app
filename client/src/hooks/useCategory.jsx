import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useCategory(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getCategory(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createCategory(category) {
        setLoading(true); 
        setErrors({}); 

        // console.log(category); 
        return axiosInstance.post('categories', category)
            .then(response => {
                setData(response?.data)
                console.log(response);
            })
            .catch(error => {
                setErrors(error?.response); 
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

    async function getCategory(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axios.get(`${ Constants?.serverURL }/api/v1/categories/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateCategory(category) {
        setLoading(true); 
        setErrors({}); 
        console.log(category);

        return axiosInstance.put(`categories/${id}`, category)
            .then(() => navigate(route('home.categories.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteCategory(category) { 
        console.log('category:', category); 
        return axiosInstance.patch(`categories/${category}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreCategory(category) {
        return axiosInstance.patch(`categories/${category?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyCategory(category) {
        return axiosInstance.delete(`categories/${category?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        category: { data, setData, errors, loading }, 
        createCategory, 
        getCategory, 
        updateCategory, 
        deleteCategory, 
        restoreCategory, 
        destroyCategory
    }
}