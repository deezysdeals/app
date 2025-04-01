import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useProduct(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getProduct(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createProduct(product) {
        setLoading(true); 
        setErrors({}); 

        console.log(product); 
        // return axiosInstance.post(`products/product/${product}`)
        return axiosInstance.postForm('products', product)
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

    async function addToShop(asin) {
        setLoading(true); 
        swal.fire({
            text: 'Please wait a few seconds while we process and add the product to your store.',  
            color: '#823c03', 
            width: 325, 
            position: 'top', 
            showConfirmButton: false
        })

        return axiosInstance.post(`products/add-to-shop/${asin}`)
            .then(response => {
                setData(response?.data); 
                // console.log(response?.data?.success); 
                swal.fire({
                    // text: `${response?.data?.success}`, 
                    text: `Product add successful`, 
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                }); 
            })
            .catch(error => {
                setErrors(error?.response); 
                // console.log(error?.response); 
                if (error?.response?.status == '409') {
                    swal.fire({
                        text: `${error?.response?.status}: Product already in shop`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    })
                } else {
                    console.log(error?.response);
                        swal.fire({
                        text: `${error?.response?.status}: An error occured!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
            })
            .finally(() => setLoading(false)); 
    }

    async function getProduct(id, { signal } = {}) {
        setLoading(true); 

        // return axiosInstance.get(`products/${id}`, { signal })
        return axios.get(`${ Constants?.serverURL }/api/v1/products/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function updateProduct(product) {
        setLoading(true); 
        setErrors({}); 
        console.log(product);

        return axiosInstance.put(`products/${id}`, product)
            .then(() => navigate(route('home.products.index')))
            .catch(error => {
                setErrors(error?.response); 
                console.log(error)
            })
            .finally(() => setLoading(false));
    }

    async function deleteProduct(product) { 
        console.log('product:', product); 
        // return axiosInstance.patch(`products/${product}`)
        return axiosInstance.delete(`products/${product}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function destroyProduct(product) {
        return axiosInstance.delete(`products/${product?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function restoreProduct(product) {
        return axiosInstance.patch(`products/${product?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        product: { data, setData, errors, loading }, 
        createProduct, 
        addToShop, 
        getProduct, 
        updateProduct, 
        deleteProduct, 
        destroyProduct, 
        restoreProduct
    }
}