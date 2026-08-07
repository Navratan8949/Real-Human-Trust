import axios from "axios";

const api = axios.create({
    baseURL: "https://real-human-trust.onrender.com/api/v1",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Run only in browser
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token"); // adjust key if needed
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;