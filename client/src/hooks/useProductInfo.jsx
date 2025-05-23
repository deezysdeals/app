import { useState, useEffect } from 'react'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProductInfo(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProductInfo(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProductInfo(productInfo) {
        setLoading(true); 
        setErrors({}); 

        // console.log(productInfo); 
        return axiosInstance.post('product-infos', productInfo)
            .then(response => {
                setData(response?.data)
                // console.log(response);
                swal.fire({
                    text: 'Product Info added.',  
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

    async function getProductInfo(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`product-infos/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteProductInfo(productInfo) { 
        console.log('productInfo:', productInfo); 
        return axiosInstance.patch(`product-infos/${productInfo}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreProductInfo(productInfo) {
        return axiosInstance.patch(`product-infos/${productInfo?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyProductInfo(productInfo) {
        return axiosInstance.delete(`product-infos/${productInfo?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        productInfo: { data, setData, errors, loading },
        createProductInfo, 
        getProductInfo, 
        deleteProductInfo, 
        restoreProductInfo, 
        destroyProductInfo
    }
}