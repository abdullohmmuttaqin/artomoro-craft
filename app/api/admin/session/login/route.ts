import { NextRequest, NextResponse } from 'next/server';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { AdminSessionRole, createAdminSessionToken, setAdminSessionCookie } from '@/lib/admin-session';

interface LoginBody {
  key?: string;
  username?: string;
  password?: string;
  role?: AdminSessionRole;
}

const hasPasswordCredentials = (role: AdminSessionRole) => {
  if (role === 'founder') {
    return Boolean(process.env.FOUNDER_USERNAME && process.env.FOUNDER_PASSWORD);
  }

  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
};

const getPasswordCredentials = (role: AdminSessionRole) => {
  if (role === 'founder') {
    return {
      username: process.env.FOUNDER_USERNAME?.trim(),
      password: process.env.FOUNDER_PASSWORD?.trim(),
    };
  }

  return {
    username: process.env.ADMIN_USERNAME?.trim(),
    password: process.env.ADMIN_PASSWORD?.trim(),
  };
};

export async function POST(request: NextRequest) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:session:login');
  if (!rateLimit.ok) {
    writeAdminAuditLog(request, {
      action: 'admin.rate_limited',
      success: false,
      details: { retryAfterSeconds: rateLimit.retryAfterSeconds, remaining: rateLimit.remaining, limit: rateLimit.limit },
    });
    return NextResponse.json(
      { message: 'Terlalu banyak percobaan login. Coba lagi beberapa saat.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const requestedRole = body.role === 'founder' ? 'founder' : 'admin';
  const hasSubmittedPasswordCredentials = Boolean(body.username || body.password);
  const isPasswordLogin = hasSubmittedPasswordCredentials && hasPasswordCredentials(requestedRole);

  if (isPasswordLogin) {
    const username = (body.username ?? '').trim();
    const password = (body.password ?? '').trim();
    const configured = getPasswordCredentials(requestedRole);

    if (!username || !password) {
      return NextResponse.json({ message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    if (configured.username !== username || configured.password !== password) {
      writeAdminAuditLog(request, {
        action: 'admin.auth.failed',
        success: false,
        details: { reason: 'Username/password mismatch', role: requestedRole },
      });
      return NextResponse.json({ message: 'Username atau password tidak valid.' }, { status: 401 });
    }

    try {
      const token = createAdminSessionToken(requestedRole);
      const response = NextResponse.json({ message: `Login ${requestedRole} berhasil.` });
      setAdminSessionCookie(response, token);

      writeAdminAuditLog(request, {
        action: 'admin.session.login',
        success: true,
        details: { role: requestedRole },
      });

      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal membuat sesi admin.';
      return NextResponse.json({ message }, { status: 500 });
    }
  }

  const configuredKey = requestedRole === 'founder' ? process.env.FOUNDER_DASHBOARD_KEY : process.env.ADMIN_DASHBOARD_KEY;
  if (!configuredKey) {
    return NextResponse.json(
      { message: `${requestedRole === 'founder' ? 'FOUNDER_DASHBOARD_KEY' : 'ADMIN_DASHBOARD_KEY'} belum dikonfigurasi di server.` },
      { status: 500 },
    );
  }

  const submittedKey = (body.key ?? '').trim();
  if (!submittedKey) {
    return NextResponse.json({ message: 'Kunci dashboard wajib diisi.' }, { status: 400 });
  }

  if (submittedKey !== configuredKey) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: 'Dashboard key mismatch', role: requestedRole },
    });
    return NextResponse.json({ message: 'Kunci dashboard tidak valid.' }, { status: 401 });
  }

  try {
    const token = createAdminSessionToken(requestedRole);
    const response = NextResponse.json({ message: `Login ${requestedRole} berhasil.` });
    setAdminSessionCookie(response, token);

    writeAdminAuditLog(request, {
      action: 'admin.session.login',
      success: true,
      details: { role: requestedRole },
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat sesi admin.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
