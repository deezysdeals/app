import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useProductReviews(productReviewQuery) {
    const axiosInstance = useAxios(); 
    const [productReviews, setProductReviews] = useState([]); 

    useEffect(() => {
        if (productReviewQuery !== null) {
            const controller = new AbortController(); 
            getProductReviews(productReviewQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [productReviewQuery]); 

    async function getProductReviews(productReviewQuery, { signal } = {}) { 
        console.log(productReviewQuery);
        setProductReviews([]); 
        return axiosInstance.get(`users/${productReviewQuery?.username}/product-reviews?page=${productReviewQuery?.page}&limit=${productReviewQuery?.limit}&stars=${productReviewQuery?.stars}`, { signal }) 
            .then(response => setProductReviews(response?.data))
            .catch(error => console.log(error));
    } 

    return { productReviews, getProductReviews }; 
} 
