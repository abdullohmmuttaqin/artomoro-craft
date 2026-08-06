const jwt = require('jsonwebtoken');

// Middleware — dijalankan SEBELUM controller, buat cek token
const verifyToken = (req, res, next) => {
    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak! Token tidak ditemukan.'
        });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // simpan data admin ke req buat dipakai controller
        next(); // lanjut ke controller
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah expired!'
        });
    }
};

module.exports = { verifyToken };