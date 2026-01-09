export type UserRole = 'USER' | 'ADMIN' | string;

/** ===== Requests ===== */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

/** ===== Responses =====
 * Backend trả record AuthResponse:
 * { accessToken, refreshToken, tokenType, expiresInSeconds, message }
 */
export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: 'Bearer' | string;
  expiresInSeconds?: number;
  message: string;
}

// strict response cho login/register/refresh
export interface AuthTokensResponse extends AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer' | string;
  expiresInSeconds: number;
}

// logout response
export interface LogoutResponse {
  message: string;
}

/** ===== JWT Payload (access token) =====
 * claim:
 * uid, role, status. Subject=sub=username. exp in seconds.
 */
export interface AccessTokenPayload {
  uid?: number;
  role?: UserRole;
  status?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  iss?: string;
  [key: string]: any;
}
