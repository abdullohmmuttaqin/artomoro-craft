import { NextRequest } from 'next/server';

type AdminAuditAction =
  | 'admin.bootstrap'
  | 'admin.product.create'
  | 'admin.product.update'
  | 'admin.product.delete'
  | 'admin.category.create'
  | 'admin.category.update'
  | 'admin.category.delete'
  | 'admin.session.login'
  | 'admin.session.logout'
  | 'admin.auth.failed'
  | 'admin.rate_limited';

interface AdminAuditPayload {
  action: AdminAuditAction;
  success: boolean;
  details?: Record<string, unknown>;
}

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
};

export const writeAdminAuditLog = (request: NextRequest, payload: AdminAuditPayload) => {
  const entry = {
    time: new Date().toISOString(),
    ip: getClientIp(request),
    method: request.method,
    path: request.nextUrl.pathname,
    action: payload.action,
    success: payload.success,
    details: payload.details ?? {},
  };

  console.info('[ADMIN_AUDIT]', JSON.stringify(entry));
};
