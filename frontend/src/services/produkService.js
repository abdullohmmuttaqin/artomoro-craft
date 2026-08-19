import axios from 'axios';
import api from './api';

// Base URL untuk request PUBLIC (tanpa token)
const PUBLIC_URL = 'http://localhost:5000/api/produk';

// GET — public, customer bisa lihat produk tanpa login
export const getAllProduk = async () => {
    const response = await axios.get(PUBLIC_URL);
    return response.data;
};

export const getProdukById = async (id) => {
    const response = await axios.get(`${PUBLIC_URL}/${id}`);
    return response.data;
};

// POST, PUT, DELETE — protected, pakai api instance dengan token
export const createProduk = async (data) => {
    const response = await api.post('/api/produk', data);
    return response.data;
};

export const updateProduk = async (id, data) => {
    const response = await api.put(`/api/produk/${id}`, data);
    return response.data;
};

export const deleteProduk = async (id) => {
    const response = await api.delete(`/api/produk/${id}`);
    return response.data;
};