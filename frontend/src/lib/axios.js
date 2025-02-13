import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://convohub-pby8.onrender.com",
    withCredentials:true,
})
