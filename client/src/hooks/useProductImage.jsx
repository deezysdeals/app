import { useState, useEffect } from 'react'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductImage(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductImage(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductImage(productImage) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productReview); 
        return axiosInstance.post('product-images', productImage)
            .then(response => {
                setData(response?.data)
                // console.log(response);
                swal.fire({
                    text: 'Product Image added.',  
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

    async function getProductImage(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-images/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductImage(productImage) { 
        console.log('productImage:', productImage); 
        return axiosInstance.patch(`product-images/${productImage}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreProductImage(productImage) {
        return axiosInstance.patch(`product-images/${productImage?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyProductImage(productImage) {
        return axiosInstance.delete(`product-images/${productImage?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        productImage: { data, setData, errors, loading },
        createProductImage, 
        getProductImage, 
        deleteProductImage, 
        restoreProductImage, 
        destroyProductImage
    }
}