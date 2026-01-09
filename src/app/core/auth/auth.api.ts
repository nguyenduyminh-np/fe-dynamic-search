import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly base = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  register(body: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.base}/register`, body);
  }

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.base}/login`, body);
  }

  refresh(body: RefreshRequest) {
    return this.http.post<AuthResponse>(`${this.base}/refresh`, body);
  }

  logout(body: LogoutRequest) {
    return this.http.post<AuthResponse>(`${this.base}/logout`, body);
  }
}
