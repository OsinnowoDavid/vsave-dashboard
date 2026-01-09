import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// The Base URL should be stored in an environment variable
const BASE_URL = "https://vsavebackend-31d8.onrender.com";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Request Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
