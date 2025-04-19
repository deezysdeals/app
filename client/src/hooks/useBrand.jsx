import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useBrand(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getBrand(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createBrand(brand) {
        setLoading(true); 
        setErrors({}); 

        // console.log(brand); 
        return axiosInstance.post('brands', brand)
            .then(response => {
                setData(response?.data)
                console.log(response);
            })
            .catch(error => {
                setErrors(error?.response); 
                console.log(error);
            })
            .finally(() => setLoading(false));
    } 

    async function getBrand(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axios.get(`${ Constants?.serverURL }/api/v1/brands/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateBrand(brand) {
        setLoading(true); 
        setErrors({}); 
        console.log(brand);

        return axiosInstance.put(`brands/${id}`, brand)
            .then(() => navigate(route('home.brands.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteBrand(brand) { 
        console.log('brand:', brand); 
        return axiosInstance.patch(`brands/${brand}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreBrand(brand) {
        return axiosInstance.patch(`brands/${brand?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyBrand(brand) {
        return axiosInstance.delete(`brands/${brand?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        brand: { data, setData, errors, loading }, 
        createBrand, 
        getBrand, 
        updateBrand, 
        deleteBrand, 
        restoreBrand, 
        destroyBrand
    }
}