import { Injectable, computed, signal } from '@angular/core';
import { decodeJwtPayload, isJwtExpired } from './auth.utils';

@Injectable({ providedIn: 'root' })
export class TokenStore {
  private ACCESS = 'accessToken';
  private REFRESH = 'refreshToken';

  private _access = signal<string | null>(sessionStorage.getItem(this.ACCESS));
  private _refresh = signal<string | null>(
    sessionStorage.getItem(this.REFRESH)
  );

  accessToken = computed(() => this._access());
  refreshToken = computed(() => this._refresh());

  payload = computed(() => {
    const t = this._access();
    return t ? decodeJwtPayload(t) : null;
  });

  role = computed(() => this.payload()?.role ?? null);
  uid = computed(() => this.payload()?.uid ?? null);
  username = computed(() => this.payload()?.sub ?? null);

  isAccessExpired = computed(() => {
    const t = this._access();
    return !t || isJwtExpired(t);
  });

  hasRefresh = computed(() => !!this._refresh());

  setTokens(accessToken: string, refreshToken: string) {
    sessionStorage.setItem(this.ACCESS, accessToken);
    sessionStorage.setItem(this.REFRESH, refreshToken);
    this._access.set(accessToken);
    this._refresh.set(refreshToken);
  }

  clear() {
    sessionStorage.removeItem(this.ACCESS);
    sessionStorage.removeItem(this.REFRESH);
    this._access.set(null);
    this._refresh.set(null);
  }
}
