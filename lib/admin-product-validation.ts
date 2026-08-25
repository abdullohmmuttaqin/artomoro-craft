export const MAX_ADMIN_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_ADMIN_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ProductPayloadValidationInput {
  nama?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string | null;
  gambar_url?: string | null;
  kategori_id?: number | null;
}

const isSafeInteger = (value: number) => Number.isInteger(value) && Number.isSafeInteger(value);

const estimateBase64Bytes = (base64: string) => {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const parseDataUrlImage = (input: string) => {
  const match = /^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/.exec(input);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2],
  };
};

export const validateImageDataUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;

  const parsed = parseDataUrlImage(value);
  if (!parsed) {
    return 'Format gambar tidak valid. Gunakan file JPG, PNG, atau WEBP.';
  }

  if (!ALLOWED_ADMIN_IMAGE_MIME_TYPES.includes(parsed.mimeType)) {
    return 'Tipe gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.';
  }

  const imageBytes = estimateBase64Bytes(parsed.base64);
  if (imageBytes > MAX_ADMIN_IMAGE_BYTES) {
    return 'Ukuran gambar melebihi batas 2MB.';
  }

  return null;
};

export const validateProductPayload = (input: ProductPayloadValidationInput): string | null => {
  const nama = (input.nama ?? '').trim();
  if (!nama) {
    return 'Nama produk wajib diisi.';
  }

  if (nama.length > 120) {
    return 'Nama produk terlalu panjang (maksimal 120 karakter).';
  }

  if (typeof input.harga !== 'number' || !Number.isFinite(input.harga) || input.harga <= 0) {
    return 'Harga harus berupa angka lebih dari 0.';
  }

  if (typeof input.stok !== 'number' || !isSafeInteger(input.stok) || input.stok < 0) {
    return 'Stok harus berupa bilangan bulat 0 atau lebih.';
  }

  if (input.deskripsi && input.deskripsi.length > 2000) {
    return 'Deskripsi terlalu panjang (maksimal 2000 karakter).';
  }

  if (input.kategori_id !== undefined && input.kategori_id !== null && (!isSafeInteger(input.kategori_id) || input.kategori_id <= 0)) {
    return 'Kategori tidak valid.';
  }

  return validateImageDataUrl(input.gambar_url);
};
