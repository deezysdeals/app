import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx';

const baseURL = `${ Constants?.amazonParazunURL }`;
const baseHost = `${ Constants?.amazonParazunHost }`;
const rapidAPIKey = `${ Constants?.rapidAPIKey }`;


const useAxiosAmazonParazun = () => {
    const axiosInstanceAmazonParazun = axios.create({
        baseURL,
        params: { region: 'US' },
        // headers: { 
        //     'Accept': 'application/json', 
        //     'x-rapidapi-ua': 'RapidAPI-Playground', 
        //     'x-rapidapi-key': '', 
        //     // 'x-rapidapi-host': 'parazun-amazon-data.p.rapidapi.com',
        //     'x-rapidapi-host': baseURL
        // },
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'x-rapidapi-ua': 'RapidAPI-Playground', 
            'x-rapidapi-key': rapidAPIKey,
            'x-rapidapi-host': baseHost
        }
    });

    return axiosInstanceAmazonParazun;
} 


export default useAxiosAmazonParazun; 