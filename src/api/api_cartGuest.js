import axios from "axios";

const api_cartGuest = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

export default api_cartGuest;