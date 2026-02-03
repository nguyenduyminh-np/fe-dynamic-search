// ===============================
// src/app/core/services/para-payment-channel.service.ts
// ===============================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import {
  ApiSuccessResponse,
  PaymentChannel,
  PaymentChannelCreateRequest,
  PaymentChannelUpdateResponse,
  PaymentChannelUpdateRequest,
  PaymentChannelDeleteRequest,
  PaymentChannelDeleteResponse,
  PaymentChannelCreatedResponse,
  ListPaymentChannelResponse,
  ListPaymentChannelRequest,
  PaymentChannelDetailRequest,
  PaymentChannelDetailResponse,
  PaymentChannelTableData,
} from '../models/para-payment-channel.model';

import {
  ActiveStatusOption,
  ChannelStatusOption,
  CurrencyCodeOption,
  Option,
  ParaStatusOption,
  PaymentChannelNativeSearchRequest,
  WebViewOption,
} from '../models/common.model';
import {
  ApprovalParaStatusRequest,
  ApprovalParaStatusResponse,
  ApprovalParaStatusResponseData,
} from '../models/approve.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:8080/api/v1/payment-channels';

  fetchAll(
    request: ListPaymentChannelRequest,
  ): Observable<ListPaymentChannelResponse<PaymentChannel>> {
    return this.http.post<ListPaymentChannelResponse<PaymentChannel>>(
      `${this.BASE_URL}/fetch-all`,
      request,
    );
  }

  // approveParaStatus(
  //   request: ApprovalParaStatusRequest,
  // ): Observable<ApiSuccessResponse<ApprovalParaStatusResponse>> {
  //   return this.http.post<ApiSuccessResponse<ApprovalParaStatusResponse>>(
  //     `${this.BASE_URL}/approval`,
  //     request,
  //   );
  // }
  approveParaStatus(
    request: ApprovalParaStatusRequest,
  ): Observable<ApiSuccessResponse<ApprovalParaStatusResponseData>> {
    return this.http.post<ApiSuccessResponse<ApprovalParaStatusResponseData>>(
      `${this.BASE_URL}/approval`,
      request,
    );
  }

  nativeSearch(
    request: PaymentChannelNativeSearchRequest,
  ): Observable<ListPaymentChannelResponse<PaymentChannelTableData>> {
    return this.http.post<ListPaymentChannelResponse<PaymentChannelTableData>>(
      `${this.BASE_URL}/native-search`,
      request,
    );
  }

  // importExcel(file: File): Observable<HttpResponse<Blob>> {
  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(`${this.BASE_URL}/excel/import`, formData, {
  //     observe: 'response',
  //     responseType: 'blob',
  //   });
  // }

  importExcel(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.BASE_URL}/excel/import`, formData, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  exportExcel(
    request: PaymentChannelNativeSearchRequest,
  ): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.BASE_URL}/excel/export`, request, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  exportTemplate(): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.BASE_URL}/excel/template`, null, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  create(
    request: PaymentChannelCreateRequest,
  ): Observable<PaymentChannelCreatedResponse<PaymentChannel>> {
    return this.http.post<PaymentChannelCreatedResponse<PaymentChannel>>(
      `${this.BASE_URL}/create`,
      request,
    );
  }

  getDetail(
    request: PaymentChannelDetailRequest,
  ): Observable<PaymentChannelDetailResponse> {
    return this.http.post<PaymentChannelDetailResponse>(
      `${this.BASE_URL}/detail`,
      request,
    );
  }

  update(
    request: PaymentChannelUpdateRequest,
  ): Observable<PaymentChannelUpdateResponse<PaymentChannel>> {
    return this.http.post<PaymentChannelUpdateResponse<PaymentChannel>>(
      `${this.BASE_URL}/update`,
      request,
    );
  }

  delete(
    request: PaymentChannelDeleteRequest,
  ): Observable<PaymentChannelDeleteResponse> {
    return this.http.post<PaymentChannelDeleteResponse>(
      `${this.BASE_URL}/delete`,
      request,
    );
  }

  // =========================
  // Input sources (ALL return Option[])
  // =========================

  /** API trả string[] => map sang Option<string>[] */
  fetchConnectionNames(): Observable<Option<string>[]> {
    return this.http
      .get<
        ApiSuccessResponse<string[]>
      >(`${this.BASE_URL}/fetch-all-connection-name`)
      .pipe(
        map((res) => this.toStringOptions(res.data)),
        catchError(() => of([])),
      );
  }

  /** API đã trả {value,label}[] */
  fetchCurrencyCodes(): Observable<CurrencyCodeOption[]> {
    return this.http
      .get<
        ApiSuccessResponse<CurrencyCodeOption[]>
      >(`${this.BASE_URL}/fetch-all-currency-code`)
      .pipe(
        map((res) => this.normalizeArray<CurrencyCodeOption>(res.data)),
        catchError(() => of([])),
      );
  }

  /** API trả string[] => map sang Option<string>[] */
  fetchMessageStandards(): Observable<Option<string>[]> {
    return this.http
      .get<
        ApiSuccessResponse<string[]>
      >(`${this.BASE_URL}/fetch-all-message-standard`)
      .pipe(
        map((res) => this.toStringOptions(res.data)),
        catchError(() => of([])),
      );
  }

  fetchChannelStatuses(): Observable<ChannelStatusOption[]> {
    return this.http
      .get<
        ApiSuccessResponse<ChannelStatusOption[]>
      >(`${this.BASE_URL}/fetch-all-channel-status`)
      .pipe(
        map((res) => this.normalizeArray<ChannelStatusOption>(res.data)),
        catchError(() => of([])),
      );
  }

  fetchParaStatuses(): Observable<ParaStatusOption[]> {
    return this.http
      .get<
        ApiSuccessResponse<ParaStatusOption[]>
      >(`${this.BASE_URL}/fetch-all-para-status`)
      .pipe(
        map((res) => this.normalizeArray<ParaStatusOption>(res.data)),
        catchError(() => of([] as ParaStatusOption[])),
      );
  }

  fetchWebView(): Observable<WebViewOption[]> {
    return this.http
      .get<
        ApiSuccessResponse<WebViewOption[]>
      >(`${this.BASE_URL}/fetch-all-web-view`)
      .pipe(
        map((res) => this.normalizeArray<WebViewOption>(res.data)),
        catchError(() => of([] as WebViewOption[])),
      );
  }

  fetchActiveStatus(): Observable<ActiveStatusOption[]> {
    return this.http
      .get<
        ApiSuccessResponse<ActiveStatusOption[]>
      >(`${this.BASE_URL}/fetch-all-active-status`)
      .pipe(
        map((res) => this.normalizeArray<ActiveStatusOption>(res.data)),
        catchError(() => of([] as ActiveStatusOption[])),
      );
  }

  // =========================
  // Helpers (normalize)
  // =========================
  private normalizeArray<T>(data: unknown): T[] {
    return Array.isArray(data) ? (data as T[]) : [];
  }

  /** string[] -> Option<string>[] */
  private toStringOptions(data: unknown): Option<string>[] {
    return this.normalizeArray<string>(data).map((x) => ({
      value: x,
      label: x,
    }));
  }
}
