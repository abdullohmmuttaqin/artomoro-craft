import { NextRequest } from 'next/server';
import { adminSessionCookieName, verifyAdminSessionToken } from '@/lib/admin-session';

export const getAdminAuthError = (request: NextRequest) => {
  const sessionToken = request.cookies.get(adminSessionCookieName)?.value;
  const isValidSession = verifyAdminSessionToken(sessionToken);

  if (!isValidSession) {
    return 'Akses admin ditolak. Sesi login tidak valid atau sudah berakhir.';
  }

  return null;
};
