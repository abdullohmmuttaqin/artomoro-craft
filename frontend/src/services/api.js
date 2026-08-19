import axios from 'axios';

// Base URL backend
const BASE_URL = 'http://localhost:5000';

// Bikin axios instance khusus untuk request yang butuh token
// Setiap request otomatis nyertakan JWT token dari localStorage
const api = axios.create({
    baseURL: BASE_URL,
});

// Interceptor — dijalankan SEBELUM setiap request dikirim
// Fungsinya: otomatis tambahin header Authorization ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Format header Authorization: "Bearer <token>"
        // Ini format standar JWT yang dibaca oleh authMiddleware kita
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;