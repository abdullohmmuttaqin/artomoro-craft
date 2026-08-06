import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                form
            );

            // Simpan token & data admin ke localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('admin', JSON.stringify(response.data.admin));

            // Kasih tau App.js bahwa login berhasil
            onLogin(response.data.admin);

        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <span style={styles.logo}>🌸</span>
                    <h1 style={styles.title}>Bouquet App</h1>
                    <p style={styles.subtitle}>Login Admin</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            name="username"
                            placeholder="Masukkan username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            name="password"
                            type="password"
                            placeholder="Masukkan password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={styles.btnLogin}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
    card: { background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    header: { textAlign: 'center', marginBottom: '30px' },
    logo: { fontSize: '48px' },
    title: { color: '#e91e8c', margin: '10px 0 5px', fontSize: '28px' },
    subtitle: { color: '#999', margin: 0 },
    errorBox: { background: '#ffebee', color: '#f44336', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500', fontSize: '14px' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    btnLogin: { width: '100%', padding: '12px', background: '#e91e8c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
};

export default LoginPage;