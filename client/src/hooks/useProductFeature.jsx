import { useState, useEffect } from 'react'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductFeature(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductFeature(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductFeature(productFeature) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productFeature); 
        return axiosInstance.post('product-features', productFeature)
            .then(response => {
                setData(response?.data)
                // console.log(response);
                swal.fire({
                    text: 'Product Feature added.',  
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

    async function getProductFeature(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-features/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductFeature(productFeature) { 
        console.log('productFeature:', productFeature); 
        return axiosInstance.patch(`product-features/${productFeature}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreProductFeature(productFeature) {
        return axiosInstance.patch(`product-features/${productFeature?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyProductFeature(productFeature) {
        return axiosInstance.delete(`product-features/${productFeature?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        productFeature: { data, setData, errors, loading },
        createProductFeature, 
        getProductFeature, 
        deleteProductFeature, 
        restoreProductFeature, 
        destroyProductFeature
    }
}