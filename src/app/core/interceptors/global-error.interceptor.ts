// ===============================
// src/app/core/interceptors/global-error.interceptor.ts
// ===============================

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import {
  ApiErrorResponse,
  ERROR_CODE_LABELS,
  HTTP_STATUS_LABELS,
} from '../models/api-error.model';

/**
 * Danh sách các endpoint không cần hiển thị lỗi global
 * (đã được xử lý riêng trong từng service/component)
 */
const EXCLUDED_ENDPOINTS = [
  '/api/v1/auth/', // Auth endpoints đã xử lý trong authInterceptor
];

/**
 * Danh sách các status code không cần hiển thị lỗi global
 * (ví dụ: 401 đã được xử lý bởi authInterceptor)
 */
const EXCLUDED_STATUS_CODES = [401];

/**
 * Global Error Interceptor
 *
 * Bắt tất cả các lỗi HTTP không được xử lý cụ thể và hiển thị thông báo
 * Sử dụng message từ API response hoặc fallback sang message mặc định
 */
export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alerts = inject(TuiAlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Bỏ qua các endpoint đã có xử lý riêng
      const isExcludedEndpoint = EXCLUDED_ENDPOINTS.some((endpoint) =>
        req.url.includes(endpoint),
      );

      // Bỏ qua các status code đã xử lý ở nơi khác
      const isExcludedStatus = EXCLUDED_STATUS_CODES.includes(error.status);

      if (isExcludedEndpoint || isExcludedStatus) {
        return throwError(() => error);
      }

      // Parse error response từ API
      const apiError = parseApiError(error);

      // Hiển thị thông báo lỗi
      const message = getErrorMessage(apiError, error.status);
      const title = getErrorTitle(apiError, error.status);

      alerts
        .open(message, {
          label: title,
          appearance: 'error',
          autoClose: 5000,
          closeable: true,
        })
        .subscribe();

      // Log lỗi ra console để debug
      console.error('[GlobalErrorInterceptor]', {
        url: req.url,
        method: req.method,
        status: error.status,
        apiError,
      });

      return throwError(() => error);
    }),
  );
};

/**
 * Parse error response từ API
 */
function parseApiError(error: HttpErrorResponse): ApiErrorResponse | null {
  try {
    // Kiểm tra nếu error.error là object (API trả về JSON)
    if (error.error && typeof error.error === 'object') {
      return error.error as ApiErrorResponse;
    }
    // Nếu error.error là string (có thể là JSON string)
    if (typeof error.error === 'string') {
      return JSON.parse(error.error) as ApiErrorResponse;
    }
  } catch {
    // Không parse được, return null
  }
  return null;
}

/**
 * Lấy message hiển thị cho user
 * Ưu tiên: message từ API > message theo error code > message theo HTTP status
 */
function getErrorMessage(
  apiError: ApiErrorResponse | null,
  status: number,
): string {
  // Ưu tiên message từ API (thường là tiếng Việt từ backend)
  if (apiError?.message) {
    return apiError.message;
  }

  // Fallback theo error code
  if (apiError?.code && ERROR_CODE_LABELS[apiError.code]) {
    return ERROR_CODE_LABELS[apiError.code];
  }

  // Fallback theo HTTP status
  if (HTTP_STATUS_LABELS[status]) {
    return HTTP_STATUS_LABELS[status];
  }

  // Default message
  return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
}

/**
 * Lấy title/label cho thông báo lỗi
 */
function getErrorTitle(
  apiError: ApiErrorResponse | null,
  status: number,
): string {
  // Sử dụng error field từ API (Unauthorized, Conflict, etc.)
  if (apiError?.error) {
    return `Lỗi: ${apiError.error}`;
  }

  // Fallback theo status
  if (status >= 500) {
    return 'Lỗi máy chủ';
  }
  if (status >= 400) {
    return 'Lỗi yêu cầu';
  }

  return 'Đã xảy ra lỗi';
}
