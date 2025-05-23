import { useState, useEffect } from 'react'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductCategory(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductCategory(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductCategory(productCategory) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productCategory); 
        return axiosInstance.post('product-categories', productCategory)
            .then(response => {
                setData(response?.data)
                // console.log(response);
                swal.fire({
                    text: 'Product Category added.',  
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
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

    async function getProductCategory(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-categories/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductCategory(productCategory) { 
        console.log('productCategory:', productCategory); 
        return axiosInstance.patch(`product-categories/${productCategory}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreProductCategory(productCategory) {
        return axiosInstance.patch(`product-categories/${productCategory?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyProductCategory(productCategory) {
        return axiosInstance.delete(`product-categories/${productCategory?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        productCategory: { data, setData, errors, loading },
        createProductCategory, 
        getProductCategory, 
        deleteProductCategory, 
        restoreProductCategory, 
        destroyProductCategory
    }
}