import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

interface CategoryBody {
  nama?: string;
}

const getCategoryName = (body: CategoryBody) => (body.nama ?? '').trim();

export async function POST(request: NextRequest) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:categories:post');
  if (!rateLimit.ok) return NextResponse.json({ message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' }, { status: 429 });

  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) return NextResponse.json({ message: authError }, { status: 401 });

  let body: CategoryBody;
  try {
    body = (await request.json()) as CategoryBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const nama = getCategoryName(body);
  if (!nama) return NextResponse.json({ message: 'Nama kategori wajib diisi.' }, { status: 400 });
  if (nama.length > 80) return NextResponse.json({ message: 'Nama kategori terlalu panjang (maksimal 80 karakter).' }, { status: 400 });

  try {
    const supabase = createServerSupabaseClient();
    let { error } = await supabase.from('kategori').insert([{ nama }]);
    if (error?.code === 'PGRST204') {
      const fallback = await supabase.from('kategori').insert([{ nama_kategori: nama }]);
      error = fallback.error;
    }
    if (error) throw error;
    writeAdminAuditLog(request, { action: 'admin.category.create', success: true, details: { nama } });
    return NextResponse.json({ message: 'Kategori berhasil dibuat.' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan kategori.';
    writeAdminAuditLog(request, { action: 'admin.category.create', success: false, details: { nama, message } });
    return NextResponse.json({ message }, { status: 500 });
  }
}
