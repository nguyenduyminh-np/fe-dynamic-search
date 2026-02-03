import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { AuthApi } from '../auth/auth.api';
import { TokenStore } from '../auth/token.store';
import {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  // inject kiểu constructor
  constructor(
    private api: AuthApi,
    private tokens: TokenStore,
    private router: Router
  ) {}

  private requireTokens(res: AuthResponse) {
    if (!res.accessToken || !res.refreshToken) {
      throw new Error(`AUTH_RESPONSE_MISSING_TOKENS: ${res.message}`);
    }
    this.tokens.setTokens(res.accessToken, res.refreshToken);
  }

  login(body: LoginRequest) {
    return this.api.login(body).pipe(tap((res) => this.requireTokens(res)));
  }

  register(body: RegisterRequest) {
    return this.api.register(body).pipe(tap((res) => this.requireTokens(res)));
  }

  refresh() {
    const refreshToken = this.tokens.refreshToken();
    if (!refreshToken) return throwError(() => new Error('NO_REFRESH_TOKEN'));

    const body: RefreshRequest = { refreshToken };
    return this.api.refresh(body).pipe(tap((res) => this.requireTokens(res)));
  }

  logout() {
    const refreshToken = this.tokens.refreshToken();

    const finalizeLogout = () => {
      this.tokens.clear();
      this.router.navigateByUrl('/login');
    };

    if (!refreshToken) {
      finalizeLogout();
      return of(null);
    }

    const body: LogoutRequest = { refreshToken };
    return this.api.logout(body).pipe(
      map(() => null),
      catchError(() => of(null)),
      tap(() => finalizeLogout())
    );
  }
}
