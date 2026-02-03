// ===============================
// src/app/core/models/api-error.model.ts
// ===============================

/**
 * Interface định nghĩa cấu trúc response lỗi từ API
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  details: string | null;
  path: string;
}

/**
 * Mapping mã lỗi -> thông báo (nếu cần override message từ server)
 */
export const ERROR_CODE_LABELS: Record<string, string> = {
  AUTH_UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
  DUPLICATE_RESOURCE: 'Dữ liệu bị trùng lặp',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  INTERNAL_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau',
};

/**
 * Mapping HTTP status -> thông báo mặc định
 */
export const HTTP_STATUS_LABELS: Record<number, string> = {
  400: 'Yêu cầu không hợp lệ',
  401: 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn',
  403: 'Bạn không có quyền truy cập',
  404: 'Không tìm thấy tài nguyên',
  409: 'Dữ liệu bị xung đột',
  422: 'Dữ liệu không thể xử lý',
  500: 'Lỗi máy chủ nội bộ',
  502: 'Máy chủ không phản hồi',
  503: 'Dịch vụ tạm thời không khả dụng',
};
