// src/app/core/services/para-payment-channel.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  PaymentChannelRequest,
  ApiResponse,
  PaymentChannel,
  PaymentChannelCreateRequest,
  PaymentChannelCreateResponse,
  PaymentChannelUpdateResponse,
  PaymentChannelUpdateRequest,
  PaymentChannelDeleteRequest,
  PaymentChannelDeleteResponse,
} from '../models/para-payment-channel.model';

type ApiListResponse<T> = {
  status: number;
  message: string;
  data: T;
};

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:8080/api/v1/payment-channels';

  fetchAll(
    request: PaymentChannelRequest
  ): Observable<ApiResponse<PaymentChannel>> {
    return this.http.post<ApiResponse<PaymentChannel>>(
      `${this.BASE_URL}/fetch-all`,
      request
    );
  }

  create(
    request: PaymentChannelCreateRequest
  ): Observable<PaymentChannelCreateResponse<PaymentChannel>> {
    return this.http.post<PaymentChannelCreateResponse<PaymentChannel>>(
      `${this.BASE_URL}/create`,
      request
    );
  }

  update(
    request: PaymentChannelUpdateRequest
  ): Observable<PaymentChannelUpdateResponse<PaymentChannel>> {
    return this.http.post<PaymentChannelUpdateResponse<PaymentChannel>>(
      `${this.BASE_URL}/update`,
      request
    );
  }

  delete(
    request: PaymentChannelDeleteRequest
  ): Observable<ApiResponse<PaymentChannelDeleteResponse>> {
    return this.http.post<ApiResponse<PaymentChannelDeleteResponse>>(
      `${this.BASE_URL}/delete`,
      request
    );
  }

  getDetail(
    request: PaymentChannelCreateRequest
  ): Observable<ApiResponse<PaymentChannel>> {
    return this.http.post<ApiResponse<PaymentChannel>>(
      `${this.BASE_URL}/detail`,
      request
    );
  }

  fetchConnectionNames(): Observable<string[]> {
    return this.http
      .get<ApiListResponse<string[]>>(
        `${this.BASE_URL}/fetch-all-connection-name`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([]))
      );
  }

  fetchCurrencyCodes(): Observable<string[]> {
    return this.http
      .get<ApiListResponse<string[]>>(
        `${this.BASE_URL}/fetch-all-currency-code`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([]))
      );
  }

  fetchMessageStandards(): Observable<string[]> {
    return this.http
      .get<ApiListResponse<string[]>>(
        `${this.BASE_URL}/fetch-all-message-standard`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([]))
      );
  }

  fetchChannelStatuses(): Observable<string[]> {
    return this.http
      .get<ApiListResponse<string[]>>(
        `${this.BASE_URL}/fetch-all-channel-status`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([]))
      );
  }

  fetchParaStatuses(): Observable<number[]> {
    return this.http
      .get<ApiListResponse<number[]>>(`${this.BASE_URL}/fetch-all-para-status`)
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as number[]))
      );
  }

  fetchWebView(): Observable<number[]> {
    return this.http
      .get<ApiListResponse<number[]>>(`${this.BASE_URL}/fetch-all-web-view`)
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as number[]))
      );
  }

  fetchActiveStatus(): Observable<number[]> {
    return this.http
      .get<ApiListResponse<number[]>>(
        `${this.BASE_URL}/fetch-all-active-status`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as number[]))
      );
  }
}
