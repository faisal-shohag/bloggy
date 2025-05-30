import axios from 'axios'

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})

const useAxiosSecure = () => axiosSecure;
export default useAxiosSecure;