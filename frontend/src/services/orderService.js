import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// Ambil semua order
export const getAllOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Ambil satu order by id
export const getOrderById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Buat order baru
export const createOrder = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

// Update status order
export const updateStatusOrder = async (id, status) => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
};

// Hapus order
export const deleteOrder = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};