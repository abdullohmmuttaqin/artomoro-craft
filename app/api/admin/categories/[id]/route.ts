import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface CategoryBody {
  nama?: string;
}

const getId = async (context: RouteContext) => {
  const { id } = await context.params;
  const categoryId = Number.parseInt(id, 10);
  return { categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null, rawId: id };
};

const isForeignKeyViolation = (error: unknown) => typeof error === 'object' && error !== null && (error as { code?: unknown }).code === '23503';

export async function PATCH(request: NextRequest, context: RouteContext) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:categories:update');
  if (!rateLimit.ok) return NextResponse.json({ message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' }, { status: 429 });
  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) return NextResponse.json({ message: authError }, { status: 401 });
  const { categoryId, rawId } = await getId(context);
  if (!categoryId) return NextResponse.json({ message: `ID kategori tidak valid: ${rawId}.` }, { status: 400 });

  let body: CategoryBody;
  try {
    body = (await request.json()) as CategoryBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }
  const nama = (body.nama ?? '').trim();
  if (!nama) return NextResponse.json({ message: 'Nama kategori wajib diisi.' }, { status: 400 });
  if (nama.length > 80) return NextResponse.json({ message: 'Nama kategori terlalu panjang (maksimal 80 karakter).' }, { status: 400 });

  try {
    const supabase = createServerSupabaseClient();
    const { data: existing, error: existingError } = await supabase.from('kategori').select('*').eq('id', categoryId).maybeSingle();
    if (existingError) throw existingError;
    if (!existing) return NextResponse.json({ message: 'Kategori tidak ditemukan.' }, { status: 404 });
    const payload: Record<string, unknown> = {};
    if ('nama' in existing) payload.nama = nama;
    else payload.nama_kategori = nama;
    const { error } = await supabase.from('kategori').update(payload).eq('id', categoryId);
    if (error) throw error;
    writeAdminAuditLog(request, { action: 'admin.category.update', success: true, details: { categoryId, nama } });
    return NextResponse.json({ message: 'Kategori berhasil diperbarui.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui kategori.';
    writeAdminAuditLog(request, { action: 'admin.category.update', success: false, details: { categoryId, message } });
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:categories:delete');
  if (!rateLimit.ok) return NextResponse.json({ message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' }, { status: 429 });
  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) return NextResponse.json({ message: authError }, { status: 401 });
  const { categoryId, rawId } = await getId(context);
  if (!categoryId) return NextResponse.json({ message: `ID kategori tidak valid: ${rawId}.` }, { status: 400 });

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from('kategori').delete().eq('id', categoryId);
    if (error) throw error;
    writeAdminAuditLog(request, { action: 'admin.category.delete', success: true, details: { categoryId } });
    return NextResponse.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error: unknown) {
    const message = isForeignKeyViolation(error)
      ? 'Kategori tidak dapat dihapus karena masih digunakan oleh produk.'
      : error instanceof Error ? error.message : 'Gagal menghapus kategori.';
    writeAdminAuditLog(request, { action: 'admin.category.delete', success: false, details: { categoryId, message } });
    return NextResponse.json({ message }, { status: isForeignKeyViolation(error) ? 409 : 500 });
  }
}
