import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
// import useAxios from '@/utils/useAxios.jsx'; 


export function useMiniTrendings() {
    // const axiosInstance = useAxios(); 
    const [miniTrendings, setMiniTrendings] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getMiniTrendings({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 

    async function getMiniTrendings({}, { signal } = {}) { 
        setMiniTrendings([]); 
        return axios.get(`${ Constants?.serverURL }/api/v1/trendings/mini-trendings`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setMiniTrendings(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { miniTrendings, getMiniTrendings }; 
} 
 