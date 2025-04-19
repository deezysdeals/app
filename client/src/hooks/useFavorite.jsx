import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useFavorite(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getFavorite(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createFavorite(favorite) {
        setLoading(true); 
        setErrors({}); 

        console.log(favorite); 
        return axiosInstance.post(`favorites/product/${favorite}`)
            .then(response => {
                setData(response?.data)
                console.log(response);
            })
            .catch(error => {
                setErrors(error?.response); 
                // console.log(error); 
                // console.log(error?.name); 
                if (error?.name == 'InvalidTokenError' || error?.response?.status == 401) {
                    navigate(route('sign-in'));
                    swal.fire({
                        text: `You must be signed in to add a favorite!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else if (error?.response?.status == 409) {
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
            })
            .finally(() => setLoading(false));
    } 

    async function getFavorite(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`favorites/${id}`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function updateFavorite(favorite) {
        setLoading(true); 
        setErrors({}); 
        console.log(favorite);

        return axiosInstance.put(`favorites/${id}`, favorite)
            .then(() => navigate(route('home.favorites.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    }

    async function deleteFavorite(favorite) { 
        console.log('favorite:', favorite); 
        // return axiosInstance.patch(`favorites/${favorite}`)
        return axiosInstance.delete(`favorites/${favorite}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    // async function destroyFavorite(favorite) {
    //     return axiosInstance.delete(`favorites/${favorite?._id}`)
    //         .then(() => {})
    //         .catch(error => setErrors(error?.response))
    //         .finally(() => setLoading(false)); 
    // } 

    // async function restoreFavorite(favorite) {
    //     return axiosInstance.patch(`favorites/${favorite?._id}/restore`)
    //         .then(() => {})
    //         .catch(error => setErrors(error?.response))
    //         .finally(() => setLoading(false)); 
    // } 


    return {
        favorite: { data, setData, errors, loading }, 
        createFavorite, 
        getFavorite, 
        updateFavorite, 
        deleteFavorite, 
        // destroyFavorite, 
        // restoreFavorite
    }
}