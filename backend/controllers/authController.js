const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi field wajib
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi!'
            });
        }

        // Cari admin berdasarkan username
        const result = await pool.query(
            'SELECT * FROM admin WHERE username = $1', [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah!'
            });
        }

        const admin = result.rows[0];

        // Bandingkan password dengan hash di database
        const passwordValid = await bcrypt.compare(password, admin.password);
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah!'
            });
        }

        // Bikin JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login berhasil!',
            token,
            admin: { id: admin.id, username: admin.username }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login };