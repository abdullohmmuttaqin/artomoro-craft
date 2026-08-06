# 🌸 Bouquet App

Aplikasi manajemen penjualan bouquet berbasis web untuk toko bunga.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js

**Backend:**
- Node.js + Express.js

**Database:**
- PostgreSQL (Supabase)

---

## 📁 Struktur Project

    bouquet-app/
    ├── backend/
    │   ├── config/         # Koneksi database
    │   ├── controllers/    # Logic bisnis API
    │   ├── middleware/     # Auth middleware (JWT)
    │   ├── models/         # Query SQL
    │   ├── routes/         # Definisi endpoint API
    │   ├── index.js        # Entry point server
    │   └── package.json
    └── frontend/
        ├── public/
        └── src/
            ├── components/ # Komponen UI reusable
            ├── pages/      # Halaman utama
            ├── services/   # HTTP request ke API
            └── App.js      # Root component & routing

---

## ✅ Progress

### Backend Setup ✅ SELESAI
- [x] Express server
- [x] Koneksi PostgreSQL (Supabase)
- [x] Struktur folder & environment variables

### Milestone 1 — Manajemen Produk Bouquet ✅ SELESAI
- [x] CRUD produk bouquet
- [x] Kategori bouquet
- [x] Search & filter

### Milestone 2 — Transaksi & Order ✅ SELESAI
- [x] Form order
- [x] Status order
- [x] Riwayat transaksi

### Milestone 3 — Dashboard & Laporan ✅ SELESAI
- [x] Total pemasukan
- [x] Produk terlaris
- [x] Status order summary
- [x] Order terbaru

### Milestone 4 — Authentication ✅ SELESAI
- [x] Login admin
- [x] JWT token
- [x] Proteksi route
- [x] Logout

---

## 👤 Author

**Abd Muttaqin** — [@abdullohmmuttaqin](https://github.com/abdullohmmuttaqin)