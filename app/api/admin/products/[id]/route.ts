import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { validateProductPayload } from '@/lib/admin-product-validation';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface UpdateProductBody {
  archived?: boolean;
  nama?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string | null;
  gambar_url?: string | null;
  kategori_id?: number | null;
}

const getProductIdFromContext = async (context: RouteContext) => {
  const { id } = await context.params;
  const productId = Number.parseInt(id, 10);
  if (Number.isNaN(productId) || productId <= 0) {
    return { productId: null, rawId: id };
  }
  return { productId, rawId: id };
};

const getDatabaseErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null) {
    const databaseError = error as { message?: unknown; details?: unknown; hint?: unknown };
    if (typeof databaseError.message === 'string' && databaseError.message.trim()) return databaseError.message;
    if (typeof databaseError.details === 'string' && databaseError.details.trim()) return databaseError.details;
    if (typeof databaseError.hint === 'string' && databaseError.hint.trim()) return databaseError.hint;
  }
  return fallback;
};

const isForeignKeyViolation = (error: unknown) => {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === '23503';
};

const isMissingArchiveColumn = (error: unknown) => {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === '42703';
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:products:update');
  if (!rateLimit.ok) {
    writeAdminAuditLog(request, {
      action: 'admin.rate_limited',
      success: false,
      details: { retryAfterSeconds: rateLimit.retryAfterSeconds, remaining: rateLimit.remaining, limit: rateLimit.limit },
    });
    return NextResponse.json(
      { message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: authError },
    });
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  const { productId, rawId } = await getProductIdFromContext(context);
  if (!productId) {
    writeAdminAuditLog(request, {
      action: 'admin.product.update',
      success: false,
      details: { reason: 'ID produk tidak valid', rawId },
    });
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  let body: UpdateProductBody;
  try {
    body = (await request.json()) as UpdateProductBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const nama = (body.nama ?? '').trim();
  const validationError = validateProductPayload({
    nama,
    harga: body.harga,
    stok: body.stok,
    deskripsi: body.deskripsi,
    gambar_url: body.gambar_url,
    kategori_id: body.kategori_id,
  });

  if (validationError) {
    writeAdminAuditLog(request, {
      action: 'admin.product.update',
      success: false,
      details: { reason: validationError, productId },
    });
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    if (typeof body.archived === 'boolean') {
      const { error } = await supabase.from('produk').update({ is_active: !body.archived }).eq('id', productId);
      if (error) throw error;
      writeAdminAuditLog(request, { action: 'admin.product.update', success: true, details: { productId, archived: body.archived } });
      return NextResponse.json({ message: body.archived ? 'Produk berhasil diarsipkan.' : 'Produk berhasil dipulihkan.' });
    }

    const { data: existingProduct, error: existingError } = await supabase.from('produk').select('*').eq('id', productId).maybeSingle();

    if (existingError) throw existingError;
    if (!existingProduct) {
      return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {
      harga: body.harga,
      stok: body.stok,
      deskripsi: body.deskripsi ?? null,
      gambar_url: body.gambar_url ?? null,
      kategori_id: typeof body.kategori_id === 'number' ? body.kategori_id : null,
    };

    if ('nama' in existingProduct || Object.prototype.hasOwnProperty.call(existingProduct, 'nama')) {
      updatePayload.nama = nama;
    } else if ('nama_produk' in existingProduct || Object.prototype.hasOwnProperty.call(existingProduct, 'nama_produk')) {
      updatePayload.nama_produk = nama;
    }

    const { error } = await supabase.from('produk').update(updatePayload).eq('id', productId);
    if (error) throw error;

    writeAdminAuditLog(request, {
      action: 'admin.product.update',
      success: true,
      details: { productId, nama },
    });

    return NextResponse.json({ message: 'Produk berhasil diperbarui.' });
  } catch (error: unknown) {
    if (isMissingArchiveColumn(error)) {
      const message = 'Fitur arsip belum siap. Jalankan migration supabase/migrations/20260902_add_product_archive.sql terlebih dahulu.';
      writeAdminAuditLog(request, { action: 'admin.product.update', success: false, details: { productId, reason: 'archive_column_missing' } });
      return NextResponse.json({ message }, { status: 503 });
    }

    const message = getDatabaseErrorMessage(error, 'Gagal memperbarui produk.');
    writeAdminAuditLog(request, {
      action: 'admin.product.update',
      success: false,
      details: { productId, message },
    });
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:products:delete');
  if (!rateLimit.ok) {
    writeAdminAuditLog(request, {
      action: 'admin.rate_limited',
      success: false,
      details: { retryAfterSeconds: rateLimit.retryAfterSeconds, remaining: rateLimit.remaining, limit: rateLimit.limit },
    });
    return NextResponse.json(
      { message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: authError },
    });
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  const { productId, rawId } = await getProductIdFromContext(context);
  if (!productId) {
    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: false,
      details: { reason: 'ID produk tidak valid', rawId },
    });
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from('produk').delete().eq('id', productId);

    if (error) throw error;

    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: true,
      details: { productId },
    });

    return NextResponse.json({ message: 'Produk berhasil dihapus.' });
  } catch (error: unknown) {
    if (isForeignKeyViolation(error)) {
      const message = 'Produk tidak dapat dihapus karena sudah digunakan pada pesanan. Ubah stok menjadi 0 atau arsipkan produk tersebut.';
      writeAdminAuditLog(request, {
        action: 'admin.product.delete',
        success: false,
        details: { productId, reason: 'product_referenced_by_order' },
      });
      return NextResponse.json({ message }, { status: 409 });
    }

    const message = getDatabaseErrorMessage(error, 'Gagal menghapus produk.');
    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: false,
      details: { productId, message },
    });
    return NextResponse.json({ message }, { status: 500 });
  }
}
