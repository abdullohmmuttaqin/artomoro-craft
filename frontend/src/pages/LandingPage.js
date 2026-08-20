import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllProduk } from '../services/produkService';

const LandingPage = () => {
    const [produkUnggulan, setProdukUnggulan] = useState([]);

    useEffect(() => {
        fetchProduk();
    }, []);

    const fetchProduk = async () => {
        try {
            const result = await getAllProduk();
            setProdukUnggulan(result.data.slice(0, 4));
        } catch (err) {
            console.error('Gagal memuat produk');
        }
    };

    const kategori = [
        { nama: 'Wisuda', emoji: '🎓', deskripsi: 'Rayakan momen kelulusan' },
        { nama: 'Pernikahan', emoji: '💍', deskripsi: 'Indah di hari istimewa' },
        { nama: 'Anniversary', emoji: '💑', deskripsi: 'Ungkapkan rasa cinta' },
        { nama: 'Ulang Tahun', emoji: '🎂', deskripsi: 'Kejutkan orang tersayang' },
    ];

    return (
        <div>
            <Navbar />

            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <p style={styles.heroLabel}>✦ Buket dan Hantaran Eksklusif ✦</p>
                    <h1 style={styles.heroTitle}>
                        Let Your Feelings
                        <br />
                        <span style={styles.heroTitleAccent}>Blossom</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Hadirkan keindahan dalam setiap momen spesialmu dengan rangkaian buket custom eksklusif dari Artomoro Craft, Cilacap.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/katalog" style={styles.btnPrimary}>Lihat Katalog</Link>
                        <a href="https://wa.me/628" target="_blank" rel="noreferrer" style={styles.btnOutline}>Pesan Custom</a>
                    </div>
                    <div style={styles.heroInfo}>
                        <span>📍 Cilacap</span>
                        <span>✂️ Custom Design</span>
                        <span>🔥 Free ongkir di bawah 5km</span>
                    </div>
                </div>
                <div style={styles.heroImage}>
                    <div style={styles.heroImagePlaceholder}>🌸</div>
                </div>
            </section>

            <section style={styles.sectionWhite}>
                <div className="container">
                    <h2 className="section-title">Koleksi Kami</h2>
                    <p className="section-subtitle">Pilih buket sesuai momen spesialmu</p>
                    <div style={styles.kategoriGrid}>
                        {kategori.map((k, i) => (
                            <Link to="/katalog" key={i} style={styles.kategoriCard}>
                                <div style={styles.kategoriEmoji}>{k.emoji}</div>
                                <div style={styles.kategoriNama}>{k.nama}</div>
                                <div style={styles.kategoriDesc}>{k.deskripsi}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section style={styles.sectionPink}>
                <div className="container">
                    <h2 className="section-title">Produk Unggulan</h2>
                    <p className="section-subtitle">Pilihan terbaik dari koleksi kami</p>
                    {produkUnggulan.length === 0 ? (
                        <p style={styles.emptyText}>Belum ada produk tersedia</p>
                    ) : (
                        <div style={styles.produkGrid}>
                            {produkUnggulan.map((p) => (
                                <div key={p.id} style={styles.produkCard}>
                                    <div style={styles.produkImagePlaceholder}>🌸</div>
                                    <div style={styles.produkInfo}>
                                        <div style={styles.produkKategori}>{p.nama_kategori || 'Buket'}</div>
                                        <div style={styles.produkNama}>{p.nama}</div>
                                        <div style={styles.produkHarga}>Rp{parseInt(p.harga).toLocaleString('id-ID')}</div>
                                        <a href="https://wa.me/628" target="_blank" rel="noreferrer" style={styles.btnPesan}>Pesan via WA</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={styles.lihatSemua}>
                        <Link to="/katalog" style={styles.btnOutline}>Lihat Semua Produk</Link>
                    </div>
                </div>
            </section>

            <section style={styles.sectionWhite}>
                <div className="container">
                    <h2 className="section-title">Mengapa Artomoro Craft?</h2>
                    <p className="section-subtitle">Kami hadir untuk membuat momenmu tak terlupakan</p>
                    <div style={styles.keunggulanGrid}>
                        {[
                            { icon: '✂️', judul: 'Custom Design', desc: 'Desain sesuai keinginanmu' },
                            { icon: '⭐', judul: 'Kualitas Premium', desc: 'Material pilihan terbaik' },
                            { icon: '🔥', judul: 'Free Ongkir', desc: 'Gratis untuk area 5km' },
                            { icon: '💬', judul: 'Pre-Order', desc: 'Pesan lebih awal, hasil memuaskan' },
                        ].map((k, i) => (
                            <div key={i} style={styles.keunggulanCard}>
                                <div style={styles.keunggulanIcon}>{k.icon}</div>
                                <div style={styles.keunggulanJudul}>{k.judul}</div>
                                <div style={styles.keunggulanDesc}>{k.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={styles.ctaSection}>
                <div className="container" style={styles.ctaContent}>
                    <h2 style={styles.ctaTitle}>Siap Membuat Momen Spesialmu?</h2>
                    <p style={styles.ctaSubtitle}>Hubungi kami sekarang dan wujudkan buket impianmu</p>
                    <a href="https://wa.me/628" target="_blank" rel="noreferrer" style={styles.ctaBtn}>
                        💬 Chat via WhatsApp
                    </a>
                </div>
            </section>

            <footer style={styles.footer}>
                <div className="container" style={styles.footerContent}>
                    <div>
                        <div style={styles.footerBrand}>♛ ArtomoroCraft</div>
                        <div style={styles.footerTagline}>Let Your Feelings Blossom</div>
                    </div>
                    <div style={styles.footerInfo}>
                        <div>📍 Cilacap, Jawa Tengah</div>
                        <div>📱 Instagram: @artomorocraft.id</div>
                        <div>Non COD | Pre-Order</div>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    2026 Avanti Dev. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const styles = {
    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 10%',
        background: 'linear-gradient(135deg, var(--cream) 0%, var(--primary-light) 100%)',
        minHeight: '90vh',
    },
    heroContent: {
        maxWidth: '520px',
    },
    heroLabel: {
        color: 'var(--primary)',
        fontSize: '13px',
        letterSpacing: '2px',
        marginBottom: '16px',
        fontWeight: '600',
    },
    heroTitle: {
        fontFamily: 'Georgia, serif',
        fontSize: '52px',
        lineHeight: '1.2',
        color: 'var(--text-dark)',
        marginBottom: '20px',
    },
    heroTitleAccent: {
        color: 'var(--primary)',
        fontStyle: 'italic',
    },
    heroSubtitle: {
        color: 'var(--text-medium)',
        fontSize: '16px',
        lineHeight: '1.8',
        marginBottom: '32px',
    },
    heroButtons: {
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
    },
    btnPrimary: {
        background: 'var(--primary)',
        color: 'var(--white)',
        padding: '14px 32px',
        borderRadius: 'var(--radius)',
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        display: 'inline-block',
    },
    btnOutline: {
        background: 'transparent',
        color: 'var(--primary)',
        border: '2px solid var(--primary)',
        padding: '12px 30px',
        borderRadius: 'var(--radius)',
        fontSize: '15px',
        fontWeight: '600',
        textDecoration: 'none',
        display: 'inline-block',
    },
    heroInfo: {
        display: 'flex',
        gap: '20px',
        color: 'var(--text-light)',
        fontSize: '13px',
    },
    heroImage: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImagePlaceholder: {
        width: '380px',
        height: '380px',
        background: 'var(--primary-light)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '120px',
        border: '3px solid var(--secondary-light)',
    },
    sectionWhite: {
        padding: '80px 0',
        background: 'var(--white)',
    },
    sectionPink: {
        padding: '80px 0',
        background: 'var(--primary-light)',
    },
    kategoriGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
    },
    kategoriCard: {
        background: 'var(--cream)',
        padding: '30px 20px',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        textDecoration: 'none',
        border: '1px solid var(--cream-dark)',
        display: 'block',
    },
    kategoriEmoji: {
        fontSize: '40px',
        marginBottom: '12px',
    },
    kategoriNama: {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: 'var(--text-dark)',
        fontWeight: 'bold',
        marginBottom: '6px',
    },
    kategoriDesc: {
        fontSize: '13px',
        color: 'var(--text-light)',
    },
    produkGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px',
    },
    produkCard: {
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
    },
    produkImagePlaceholder: {
        height: '200px',
        background: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '60px',
    },
    produkInfo: {
        padding: '16px',
    },
    produkKategori: {
        fontSize: '11px',
        color: 'var(--primary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '4px',
    },
    produkNama: {
        fontFamily: 'Georgia, serif',
        fontSize: '15px',
        color: 'var(--text-dark)',
        fontWeight: 'bold',
        marginBottom: '8px',
    },
    produkHarga: {
        fontSize: '16px',
        color: 'var(--primary-dark)',
        fontWeight: '700',
        marginBottom: '12px',
    },
    btnPesan: {
        display: 'block',
        background: 'var(--primary)',
        color: 'var(--white)',
        padding: '8px',
        borderRadius: 'var(--radius)',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
    },
    lihatSemua: {
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: 'var(--text-light)',
        padding: '40px',
    },
    keunggulanGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
    },
    keunggulanCard: {
        textAlign: 'center',
        padding: '30px 20px',
        background: 'var(--cream)',
        borderRadius: 'var(--radius-lg)',
    },
    keunggulanIcon: {
        fontSize: '36px',
        marginBottom: '12px',
    },
    keunggulanJudul: {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: 'var(--text-dark)',
        fontWeight: 'bold',
        marginBottom: '8px',
    },
    keunggulanDesc: {
        fontSize: '13px',
        color: 'var(--text-medium)',
        lineHeight: '1.6',
    },
    ctaSection: {
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        padding: '80px 0',
    },
    ctaContent: {
        textAlign: 'center',
    },
    ctaTitle: {
        fontFamily: 'Georgia, serif',
        fontSize: '36px',
        color: 'var(--white)',
        marginBottom: '12px',
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '16px',
        marginBottom: '32px',
    },
    ctaBtn: {
        background: 'var(--white)',
        color: 'var(--primary)',
        padding: '16px 40px',
        borderRadius: 'var(--radius)',
        fontSize: '16px',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
    },
    footer: {
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '40px 0 0',
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: '40px',
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
    },
    footerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
    },
    footerBottom: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.4)',
    },
};

export default LandingPage;