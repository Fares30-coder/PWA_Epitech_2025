import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
};

export const login = async (userData) => {
    const res = await api.post("/auth/login", userData);
    return res.data;
};

export default api;
