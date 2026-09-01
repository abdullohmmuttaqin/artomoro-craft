// Tipe Data Kategori Buket
// Dukungan kompatibel untuk field `nama` atau `nama_kategori` agar data lama dan baru tetap bisa dipakai.
export interface Kategori {
  id: number;
  nama?: string;
  nama_kategori?: string;
  created_at?: string;
}

// Tipe Data Produk Buket
// Gunakan `nama` sebagai format utama. `nama_produk` tetap dipertahankan sebagai kompatibilitas data lama.
export interface Produk {
  id: number;
  nama?: string;
  nama_produk?: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  gambar_url?: string;
  kategori_id?: number;
  is_active?: boolean;
  created_at?: string;
}

// Tipe Data Order / Pesanan Customer
export interface Order {
  id: number;
  nama_pemesan: string;
  nomor_wa: string;
  tanggal_pengiriman?: string;
  catatan_ucapan?: string;
  total_harga: number;
  status: 'pending' | 'diproses' | 'selesai' | 'dibatalkan';
  created_at?: string;
}

// Tipe Data Item Order
export interface OrderItem {
  id: number;
  order_id: number;
  produk_id: number;
  jumlah: number;
  harga_satuan: number;
  produk?: Produk;
}