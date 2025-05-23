import { useState, useEffect } from 'react'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductDescription(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductDescription(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductDescription(productDescription) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productDescription); 
        return axiosInstance.post('product-descriptions', productDescription)
            .then(response => {
                setData(response?.data)
                // console.log(response);
                swal.fire({
                    text: 'Product Description added.',  
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

    async function getProductDescription(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-descriptions/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductDescription(productDescription) { 
        console.log('productDescription:', productDescription); 
        return axiosInstance.patch(`product-descriptions/${productDescription}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreProductDescription(productDescription) {
        return axiosInstance.patch(`product-descriptions/${productDescription?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyProductDescription(productDescription) {
        return axiosInstance.delete(`product-descriptions/${productDescription?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        productDescription: { data, setData, errors, loading },
        createProductDescription, 
        getProductDescription, 
        deleteProductDescription, 
        restoreProductDescription, 
        destroyProductDescription
    }
}