import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAllProduk } from '../services/produkService';

const KatalogPage = () => {
    const [produk, setProduk] = useState([]);
    const [produkFilter, setProdukFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [kategoriAktif, setKategoriAktif] = useState('Semua');

    const kategoriList = ['Semua', 'Wisuda', 'Pernikahan', 'Anniversary', 'Ulang Tahun', 'Lainnya'];

    useEffect(() => {
        fetchProduk().catch(console.error);
    }, []);

    useEffect(() => {
        filterProduk();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, kategoriAktif, produk]);

    const fetchProduk = async () => {
        try {
            const result = await getAllProduk();
            setProduk(result.data);
            setProdukFilter(result.data);
        } catch (err) {
            console.error('Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    };

    const filterProduk = () => {
        let hasil = [...produk];
        if (kategoriAktif !== 'Semua') {
            hasil = hasil.filter(p => p.nama_kategori === kategoriAktif);
        }
        if (search.trim() !== '') {
            hasil = hasil.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()));
        }
        setProdukFilter(hasil);
    };

    return (
        <div>
            <Navbar />
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>Katalog Produk</h1>
                <p style={styles.headerSubtitle}>Temukan buket impianmu untuk setiap momen spesial</p>
            </div>
            <div className="container" style={styles.mainContent}>
                <div style={styles.searchContainer}>
                    <input
                        style={styles.searchInput}
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={styles.filterContainer}>
                    {kategoriList.map((kat) => (
                        <button
                            key={kat}
                            style={kategoriAktif === kat
                                ? {...styles.filterBtn, ...styles.filterBtnAktif}
                                : styles.filterBtn
                            }
                            onClick={() => setKategoriAktif(kat)}
                        >
                            {kat}
                        </button>
                    ))}
                </div>
                <div style={styles.infoHasil}>
                    {loading ? 'Memuat produk...' : produkFilter.length + ' produk ditemukan'}
                </div>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <p>Memuat produk...</p>
                    </div>
                ) : produkFilter.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyIcon}>🌸</p>
                        <p style={styles.emptyText}>Produk tidak ditemukan</p>
                        <p style={styles.emptySubtext}>Coba kata kunci atau kategori lain</p>
                    </div>
                ) : (
                    <div style={styles.produkGrid}>
                        {produkFilter.map((p) => (
                            <div key={p.id} style={styles.produkCard}>
                                <div style={styles.produkImage}>
                                    {p.gambar_url && p.gambar_url.trim() !== ''
                                        ? <img src={p.gambar_url} alt={p.nama} style={styles.gambar} />
                                        : <div style={styles.gambarPlaceholder}>🌸</div>
                                    }
                                </div>
                                <div style={styles.produkInfo}>
                                    <div style={styles.produkKategori}>{p.nama_kategori || 'Buket'}</div>
                                    <div style={styles.produkNama}>{p.nama}</div>
                                    {p.deskripsi && (
                                        <div style={styles.produkDeskripsi}>{p.deskripsi}</div>
                                    )}
                                    <div style={styles.produkHarga}>
                                        {'Rp' + parseInt(p.harga).toLocaleString('id-ID')}
                                    </div>
                                    <div style={styles.produkStok}>
                                        {p.stok > 0
                                            ? <span style={styles.stokAda}>Tersedia ({p.stok} pcs)</span>
                                            : <span style={styles.stokHabis}>Stok habis</span>
                                        }
                                    </div>
                                    <a
                                    href="https://wa.me/628"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={p.stok > 0 ? styles.btnPesan : styles.btnPesanDisabled}
                                    >
                                    {p.stok > 0 ? 'Pesan via WhatsApp' : 'Stok Habis'}
                                </a>
                            </div>
                            </div>
                            ))}
                    </div>
                    )}
            </div>
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <div style={styles.footerBrand}>ArtomoroCraft</div>
                    <div style={styles.footerTagline}>Let Your Feelings Blossom</div>
                    <div style={styles.footerInfo}>Cilacap | @artomorocraft.id | Non COD | Pre-Order</div>
                </div>
                <div style={styles.footerBottom}>2026 Avanti Dev. All rights reserved.</div>
            </footer>
        </div>
    );
};

const styles = {
    header: {
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--cream) 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        borderBottom: '1px solid var(--cream-dark)',
    },
    headerTitle: {
        fontFamily: 'Georgia, serif',
        fontSize: '36px',
        color: 'var(--text-dark)',
        marginBottom: '8px',
    },
    headerSubtitle: {
        color: 'var(--text-medium)',
        fontSize: '16px',
    },
    mainContent: {
        padding: '40px 20px',
    },
    searchContainer: {
        marginBottom: '24px',
    },
    searchInput: {
        width: '100%',
        padding: '14px 20px',
        border: '2px solid var(--cream-dark)',
        borderRadius: 'var(--radius-lg)',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        background: 'var(--white)',
    },
    filterContainer: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '24px',
    },
    filterBtn: {
        padding: '8px 20px',
        border: '2px solid var(--cream-dark)',
        borderRadius: '20px',
        background: 'var(--white)',
        color: 'var(--text-medium)',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
    filterBtnAktif: {
        background: 'var(--primary)',
        borderColor: 'var(--primary)',
        color: 'var(--white)',
    },
    infoHasil: {
        color: 'var(--text-light)',
        fontSize: '14px',
        marginBottom: '24px',
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '80px',
        color: 'var(--text-light)',
    },
    emptyContainer: {
        textAlign: 'center',
        padding: '80px 20px',
    },
    emptyIcon: {
        fontSize: '60px',
        marginBottom: '16px',
    },
    emptyText: {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: 'var(--text-dark)',
        marginBottom: '8px',
    },
    emptySubtext: {
        color: 'var(--text-light)',
        fontSize: '14px',
    },
    produkGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
    },
    produkCard: {
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
    },
    produkImage: {
        height: '240px',
        overflow: 'hidden',
    },
    gambar: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    gambarPlaceholder: {
        width: '100%',
        height: '100%',
        background: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '70px',
    },
    produkInfo: {
        padding: '20px',
    },
    produkKategori: {
        fontSize: '11px',
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '6px',
        fontWeight: '600',
    },
    produkNama: {
        fontFamily: 'Georgia, serif',
        fontSize: '17px',
        color: 'var(--text-dark)',
        fontWeight: 'bold',
        marginBottom: '8px',
        lineHeight: '1.4',
    },
    produkDeskripsi: {
        fontSize: '13px',
        color: 'var(--text-medium)',
        lineHeight: '1.6',
        marginBottom: '12px',
    },
    produkHarga: {
        fontSize: '20px',
        color: 'var(--primary)',
        fontWeight: '700',
        marginBottom: '8px',
    },
    produkStok: {
        marginBottom: '16px',
        fontSize: '13px',
    },
    stokAda: {
        color: 'var(--success)',
        fontWeight: '500',
    },
    stokHabis: {
        color: 'var(--danger)',
        fontWeight: '500',
    },
    btnPesan: {
        display: 'block',
        background: 'var(--primary)',
        color: 'var(--white)',
        padding: '12px',
        borderRadius: 'var(--radius)',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
    },
    btnPesanDisabled: {
        display: 'block',
        background: 'var(--cream-dark)',
        color: 'var(--text-light)',
        padding: '12px',
        borderRadius: 'var(--radius)',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none',
        cursor: 'not-allowed',
    },
    footer: {
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '40px 20px 0',
        marginTop: '60px',
    },
    footerContent: {
        textAlign: 'center',
        paddingBottom: '32px',
    },
    footerBrand: {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        marginBottom: '6px',
    },
    footerTagline: {
        fontSize: '11px',
        color: 'var(--text-light)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '12px',
    },
    footerInfo: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.6)',
    },
    footerBottom: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.4)',
    },
};

export default KatalogPage;