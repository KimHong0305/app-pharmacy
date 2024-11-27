import axios from "axios";

const api_cartGuest = axios.create({
    baseURL : 'http://localhost:8080/api/v1/pharmacy',
    withCredentials: true,
})

export default api_cartGuest