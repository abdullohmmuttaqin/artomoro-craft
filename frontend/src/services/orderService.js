import api from './api';

// Semua order endpoint protected — pakai api instance dengan token
export const getAllOrders = async () => {
    const response = await api.get('/api/orders');
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
};

export const createOrder = async (data) => {
    const response = await api.post('/api/orders', data);
    return response.data;
};

export const updateStatusOrder = async (id, status) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data;
};