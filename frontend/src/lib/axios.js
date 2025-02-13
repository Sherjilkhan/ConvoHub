import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==="development"? "http://localhost:5001/api":"convo-hub-14ht.vercel.app",
    withCredentials:true,
})
