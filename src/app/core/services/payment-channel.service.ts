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
import {
  ActiveStatus,
  ChannelStatus,
  CurrencyCode,
  ParaStatusOption,
  WebViewOption,
} from '../../shared/util/payment-channel-create.util';

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

  fetchCurrencyCodes(): Observable<CurrencyCode[]> {
    return this.http
      .get<ApiListResponse<CurrencyCode[]>>(
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

  fetchChannelStatuses(): Observable<ChannelStatus[]> {
    return this.http
      .get<ApiListResponse<ChannelStatus[]>>(
        `${this.BASE_URL}/fetch-all-channel-status`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([]))
      );
  }

  fetchParaStatuses(): Observable<ParaStatusOption[]> {
    return this.http
      .get<ApiListResponse<ParaStatusOption[]>>(
        `${this.BASE_URL}/fetch-all-para-status`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as ParaStatusOption[]))
      );
  }

  fetchWebView(): Observable<WebViewOption[]> {
    return this.http
      .get<ApiListResponse<WebViewOption[]>>(
        `${this.BASE_URL}/fetch-all-web-view`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as WebViewOption[]))
      );
  }

  fetchActiveStatus(): Observable<ActiveStatus[]> {
    return this.http
      .get<ApiListResponse<ActiveStatus[]>>(
        `${this.BASE_URL}/fetch-all-active-status`
      )
      .pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([] as ActiveStatus[]))
      );
  }
}
