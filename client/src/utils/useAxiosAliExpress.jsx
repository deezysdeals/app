import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx';

const baseURL = `${ Constants?.amazonParazunURL }`;
const baseHost = `${ Constants?.amazonParazunHost }`;
const rapidAPIKey = `${ Constants?.rapidAPIKey }`;


const useAxiosAliExpress = () => {
    const axiosInstanceAliExpress = axios.create({
        baseURL,
        params: { region: 'US' },
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'x-rapidapi-ua': 'RapidAPI-Playground', 
            'x-rapidapi-key': rapidAPIKey,
            'x-rapidapi-host': baseHost
        }
    });

    return axiosInstanceAliExpress;
} 


export default useAxiosAliExpress; 