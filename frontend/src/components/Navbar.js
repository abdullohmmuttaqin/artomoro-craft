import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                {/* Logo & Brand */}
                <Link to="/" style={styles.brand}>
                    <span style={styles.crown}>♛</span>
                    <div>
                        <div style={styles.brandName}>Artomoro Craft</div>
                        <div style={styles.tagline}>Let Your Feelings Blossom</div>
                    </div>
                </Link>

                {/* Nav Links — tombol Admin dihapus dari sini */}
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Beranda</Link>
                    <Link to="/katalog" style={styles.navLink}>Katalog</Link>

                    <a
                        href="https://wa.me/628"
                        style={styles.navLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Pesan Sekarang
                    </a>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        background: 'var(--white)',
        borderBottom: '1px solid var(--cream-dark)',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
    },
    crown: {
        fontSize: '24px',
        color: 'var(--primary)',
    },
    brandName: {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: 'var(--text-dark)',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
    },
    tagline: {
        fontSize: '10px',
        color: 'var(--text-light)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
    },
    navLink: {
        color: 'var(--text-medium)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export default Navbar;