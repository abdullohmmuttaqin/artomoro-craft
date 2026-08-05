import axios from 'axios';

// Base URL backend API kita
const API_URL = 'http://localhost:5000/api/produk';

// Ambil semua produk
export const getAllProduk = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Ambil satu produk berdasarkan id
export const getProdukById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Tambah produk baru
export const createProduk = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

// Update produk
export const updateProduk = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

// Hapus produk
export const deleteProduk = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};