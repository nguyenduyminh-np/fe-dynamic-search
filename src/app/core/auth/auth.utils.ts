import { AccessTokenPayload } from '../models/auth.model';

export function decodeJwtPayload(token: string): AccessTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // JWT payload là base64url -> base64
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

    // atob yêu cầu padding để length % 4 === 0
    while (base64.length % 4) base64 += '=';

    const json = atob(base64);
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}
