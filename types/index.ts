// Tipe Data Kategori Buket
export interface Kategori {
  id: number;
  nama_kategori: string;
  created_at?: string;
}

// Tipe Data Produk Buket
export interface Produk {
  id: number;
  nama_produk: string;
  deskripsi?: string;
  harga: number;
  stok: number;
  gambar_url?: string;
  kategori_id?: number;
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