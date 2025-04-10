import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useSitePaymentConfiguration() {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        const controller = new AbortController();
        getSitePaymentConfiguration({}, { signal: controller.signal })
        return () => controller.abort();
    }, []);

    async function getSitePaymentConfiguration({}, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`site-payment-configurations`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => {
                console.log(error); 
                setErrors(error?.response);
            })
            .finally(() => setLoading(false));
    }

    async function updateSitePaymentConfiguration(sitePaymentConfiguration) {
        setLoading(true); 
        setErrors({}); 
        console.log(sitePaymentConfiguration);

        return axiosInstance.patch(`site-payment-configurations`, sitePaymentConfiguration)
            .then(() => {
                swal.fire({
                    text: 'Site Payment Configuration Updated.',  
                    color: '#823c03', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.log(error); 
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


    return {
        sitePaymentConfiguration: { data, setData, errors, loading }, 
        getSitePaymentConfiguration, 
        updateSitePaymentConfiguration, 
    }
}