import { Injectable, computed, signal } from '@angular/core';
import { decodeJwtPayload, isJwtExpired } from './auth.utils';

type AuthPayload = {
  role?: string;
  uid?: string | number;
  sub?: string;
};

@Injectable({ providedIn: 'root' })
export class TokenStore {
  private ACCESS = 'accessToken';
  private REFRESH = 'refreshToken';

  //  persist thêm profile để role không phụ thuộc access token còn/không
  private ROLE = 'auth_role';
  private UID = 'auth_uid';
  private USERNAME = 'auth_username';

  
  private _access = signal<string | null>(sessionStorage.getItem(this.ACCESS));
  private _refresh = signal<string | null>(
    sessionStorage.getItem(this.REFRESH)
  );

  private _role = signal<string | null>(sessionStorage.getItem(this.ROLE));
  private _uid = signal<string | null>(sessionStorage.getItem(this.UID));
  private _username = signal<string | null>(
    sessionStorage.getItem(this.USERNAME)
  );

  accessToken = computed(() => this._access());
  refreshToken = computed(() => this._refresh());

  payload = computed<AuthPayload | null>(() => {
    const t = this._access();
    return t ? (decodeJwtPayload(t) as AuthPayload) : null;
  });

  //  role/uid/username: ưu tiên payload nếu có, fallback sang profile persisted
  role = computed(() => this.payload()?.role ?? this._role());
  uid = computed(() => {
    const v = this.payload()?.uid ?? this._uid();
    return v == null ? null : v;
  });
  username = computed(() => this.payload()?.sub ?? this._username());

  isAccessExpired = computed(() => {
    const t = this._access();
    return !t || isJwtExpired(t);
  });

  hasRefresh = computed(() => !!this._refresh());
  hasAccess = computed(() => !!this._access());

  private setProfileFromAccess(accessToken: string): void {
    const p = decodeJwtPayload(accessToken) as AuthPayload;

    const role = (p?.role ?? null) as string | null;
    const uid = p?.uid != null ? String(p.uid) : null;
    const username = (p?.sub ?? null) as string | null;

    if (role) sessionStorage.setItem(this.ROLE, role);
    else sessionStorage.removeItem(this.ROLE);

    if (uid) sessionStorage.setItem(this.UID, uid);
    else sessionStorage.removeItem(this.UID);

    if (username) sessionStorage.setItem(this.USERNAME, username);
    else sessionStorage.removeItem(this.USERNAME);

    this._role.set(role);
    this._uid.set(uid);
    this._username.set(username);
  }

  setTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem(this.ACCESS, accessToken);
    sessionStorage.setItem(this.REFRESH, refreshToken);

    this._access.set(accessToken);
    this._refresh.set(refreshToken);

    //  update profile persisted
    this.setProfileFromAccess(accessToken);
  }

  clear(): boolean {
    sessionStorage.removeItem(this.ACCESS);
    sessionStorage.removeItem(this.REFRESH);

    //  clear profile persisted
    sessionStorage.removeItem(this.ROLE);
    sessionStorage.removeItem(this.UID);
    sessionStorage.removeItem(this.USERNAME);

    this._access.set(null);
    this._refresh.set(null);

    this._role.set(null);
    this._uid.set(null);
    this._username.set(null);

    return true;
  }
}
