import { NextRequest } from 'next/server';
import { AdminSessionRole, adminSessionCookieName, getAdminSessionPayload } from '@/lib/admin-session';

export const getAdminAuthError = (request: NextRequest, allowedRoles: AdminSessionRole[] = ['admin', 'founder']) => {
  const sessionToken = request.cookies.get(adminSessionCookieName)?.value;
  const session = getAdminSessionPayload(sessionToken);

  if (!session) {
    return 'Akses admin ditolak. Sesi login tidak valid atau sudah berakhir.';
  }

  if (!allowedRoles.includes(session.role)) {
    return `Akses ditolak. Role ${allowedRoles.join(' atau ')} diperlukan.`;
  }

  return null;
};
