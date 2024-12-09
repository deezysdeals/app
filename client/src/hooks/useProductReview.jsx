import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductReview(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductReview(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductReview(productReview) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productReview); 
        return axiosInstance.post('product-reviews', productReview)
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

    async function getProductReview(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-reviews/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductReview(productReview) { 
        console.log('productReview:', productReview); 
        return axiosInstance.patch(`product-reviews/${productReview}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 


    return {
        productReview: { data, setData, errors, loading }, 
        createProductReview, 
        getProductReview, 
        deleteProductReview
    }
}