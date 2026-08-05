import React, { useState, useEffect } from 'react';
import { getAllProduk, createProduk, updateProduk, deleteProduk } from '../services/produkService';

const ProdukPage = () => {
    // State — data yang kalau berubah, komponen otomatis re-render
    const [produk, setProduk] = useState([]);        // daftar semua produk
    const [loading, setLoading] = useState(true);    // status loading
    const [error, setError] = useState(null);        // pesan error
    const [showForm, setShowForm] = useState(false); // tampilkan/sembunyikan form
    const [editId, setEditId] = useState(null);      // id produk yang sedang diedit

    // State form input
    const [form, setForm] = useState({
        nama: '',
        deskripsi: '',
        harga: '',
        stok: '',
        kategori_id: '',
        gambar_url: ''
    });

    // useEffect → jalankan fetchProduk sekali saat komponen pertama kali muncul
    useEffect(() => {
        fetchProduk();
    }, []);

    // Ambil semua produk dari backend
    const fetchProduk = async () => {
        try {
            setLoading(true);
            const result = await getAllProduk();
            setProduk(result.data);
        } catch (err) {
            setError('Gagal memuat data produk');
        } finally {
            setLoading(false);
        }
    };

    // Handle perubahan input form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Reset form ke nilai awal
    const resetForm = () => {
        setForm({ nama: '', deskripsi: '', harga: '', stok: '', kategori_id: '', gambar_url: '' });
        setEditId(null);
        setShowForm(false);
    };

    // Submit form — bisa untuk tambah atau update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateProduk(editId, form);
            } else {
                await createProduk(form);
            }
            fetchProduk();
            resetForm();
        } catch (err) {
            setError('Gagal menyimpan produk');
        }
    };

    // Isi form dengan data produk yang mau diedit
    const handleEdit = (p) => {
        setForm({
            nama: p.nama,
            deskripsi: p.deskripsi || '',
            harga: p.harga,
            stok: p.stok,
            kategori_id: p.kategori_id || '',
            gambar_url: p.gambar_url || ''
        });
        setEditId(p.id);
        setShowForm(true);
    };

    // Hapus produk dengan konfirmasi
    const handleDelete = async (id) => {
        if (window.confirm('Yakin mau hapus produk ini?')) {
            try {
                await deleteProduk(id);
                fetchProduk();
            } catch (err) {
                setError('Gagal menghapus produk');
            }
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🌸 Manajemen Produk Bouquet</h1>
                <button
                    style={styles.btnPrimary}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Tutup Form' : '+ Tambah Produk'}
                </button>
            </div>

            {/* Form Tambah/Edit Produk */}
            {showForm && (
                <div style={styles.formContainer}>
                    <h2>{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGrid}>
                            <input
                                style={styles.input}
                                name="nama"
                                placeholder="Nama Produk *"
                                value={form.nama}
                                onChange={handleChange}
                                required
                            />
                            <input
                                style={styles.input}
                                name="harga"
                                type="number"
                                placeholder="Harga *"
                                value={form.harga}
                                onChange={handleChange}
                                required
                            />
                            <input
                                style={styles.input}
                                name="stok"
                                type="number"
                                placeholder="Stok *"
                                value={form.stok}
                                onChange={handleChange}
                                required
                            />
                            <input
                                style={styles.input}
                                name="kategori_id"
                                type="number"
                                placeholder="ID Kategori"
                                value={form.kategori_id}
                                onChange={handleChange}
                            />
                            <input
                                style={styles.input}
                                name="gambar_url"
                                placeholder="URL Gambar"
                                value={form.gambar_url}
                                onChange={handleChange}
                            />
                            <textarea
                                style={styles.input}
                                name="deskripsi"
                                placeholder="Deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={styles.formButtons}>
                            <button type="submit" style={styles.btnPrimary}>
                                {editId ? 'Update' : 'Simpan'}
                            </button>
                            <button type="button" style={styles.btnSecondary} onClick={resetForm}>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel Produk */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.th}>Nama</th>
                        <th style={styles.th}>Harga</th>
                        <th style={styles.th}>Stok</th>
                        <th style={styles.th}>Kategori</th>
                        <th style={styles.th}>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produk.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.emptyRow}>
                                Belum ada produk. Tambahkan produk pertama!
                            </td>
                        </tr>
                    ) : (
                        produk.map((p) => (
                            <tr key={p.id} style={styles.tableRow}>
                                <td style={styles.td}>{p.nama}</td>
                                <td style={styles.td}>Rp{p.harga.toLocaleString('id-ID')}</td>
                                <td style={styles.td}>{p.stok}</td>
                                <td style={styles.td}>{p.nama_kategori || '-'}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.btnEdit}
                                        onClick={() => handleEdit(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.btnDelete}
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Styles — CSS in JS (inline styling di React)
const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
    center: { textAlign: 'center', marginTop: '50px', fontSize: '18px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { color: '#e91e8c', margin: 0 },
    formContainer: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
    input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
    formButtons: { display: 'flex', gap: '10px' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { background: '#e91e8c', color: 'white' },
    th: { padding: '12px', textAlign: 'left' },
    tableRow: { borderBottom: '1px solid #ddd' },
    td: { padding: '12px' },
    emptyRow: { textAlign: 'center', padding: '20px', color: '#999' },
    btnPrimary: { background: '#e91e8c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    btnSecondary: { background: '#999', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    btnEdit: { background: '#2196F3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    btnDelete: { background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default ProdukPage;