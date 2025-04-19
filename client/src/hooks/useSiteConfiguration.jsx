import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useSiteConfiguration() {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        const controller = new AbortController();
        getSiteConfiguration({}, { signal: controller.signal })
        return () => controller.abort();
    }, []);

    async function getSiteConfiguration({}, { signal } = {}) {
        setLoading(true); 

        return axios.get(`${ Constants?.serverURL }/api/v1/site-configurations`, { signal })
            .then(response => setData(response?.data?.data))
            .catch(error => {
                console.log(error); 
                setErrors(error?.response);
            })
            .finally(() => setLoading(false));
    }

    async function updateSiteConfiguration(siteConfiguration) {
        setLoading(true); 
        setErrors({}); 
        console.log(siteConfiguration);

        return axiosInstance.patch(`site-configurations`, siteConfiguration)
            .then(() => {})
            .catch(error => {
                console.log(error); 
                setErrors(error?.response);
            })
            .finally(() => setLoading(false));
    }


    return {
        siteConfiguration: { data, setData, errors, loading }, 
        getSiteConfiguration, 
        updateSiteConfiguration, 
    }
}