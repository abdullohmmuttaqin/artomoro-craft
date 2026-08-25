import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';

export async function GET(request: NextRequest) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const [{ data: kategori, error: kategoriError }, { data: produk, error: produkError }] = await Promise.all([
      supabase.from('kategori').select('*'),
      supabase.from('produk').select('*').order('id', { ascending: false }),
    ]);

    if (kategoriError) throw kategoriError;
    if (produkError) throw produkError;

    return NextResponse.json({
      kategori: kategori ?? [],
      produk: produk ?? [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat data admin.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
