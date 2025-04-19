import { useState, useEffect } from 'react'; 
// import { useNavigate } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useTwitterX(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    // const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getTwitterX(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createTwitterX(tweet) {
        setLoading(true); 
        setErrors({}); 

        console.log(); 
        return axiosInstance.postForm('social-media/twitter-x/post-tweet', tweet)
            .then(response => {
                setData(response?.data); 
                swal.fire({
                    text: 'Tweet added.',  
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
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

    async function getTwitterX(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`social-media/twitter-x/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function updateTwitterX(tweet) {
        setLoading(true); 
        setErrors({}); 
        console.log(tweet);

        return axiosInstance.put(`social-media/twitter-x/${id}`, tweet)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function deleteTwitterX(tweet) {
        return axiosInstance.patch(`social-media/twitter-x/${tweet?._id}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response);
                setErrors(error?.response);
            })
            .finally(() => setLoading(false)); 
    } 

    async function destroyTwitterX(tweet) {
        return axiosInstance.delete(`social-media/twitter-x/${tweet?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function restoreTwitterX(tweet) {
        return axiosInstance.patch(`social-media/twitter-x/${tweet?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        twitterX: { data, setData, errors, loading }, 
        getTwitterX, 
        createTwitterX, 
        updateTwitterX, 
        deleteTwitterX, 
        destroyTwitterX, 
        restoreTwitterX
    }
}