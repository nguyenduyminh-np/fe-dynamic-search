// ===============================
// src/app/core/models/para-payment-channel.model.ts
// ===============================

export type JsonData = Record<string, unknown>;

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  details: unknown | null;
  path: string;
}

export interface ApiSuccessResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface PaymentChannel {
  id: number;
  paymentChannel: string;
  connectionName: string;
  channelStatus: string;
  currencyCode: string;
  msgStandard: string;
  webView: number;
  paraStatus: number;
  activeStatus: number;
  jsonData: JsonData;
}

export interface PaymentChannelTableData {
  id: number;
  paymentChannel: string;
  connectionName: string;
  channelStatus: string;
  currencyCode: string;
  currencyName: string;
  msgStandard: string;
  webView: string;
  paraStatus: string;
  paraStatusCode: number;
  activeStatus: string;
  jsonData: string;
}

// LIST
export interface ListPaymentChannelRequest {
  pageNo: number;
  pageSize: number;
}

export type ListPaymentChannelResponse<T> = ApiSuccessResponse<{
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: T[];
}>;

// DETAIL
export interface PaymentChannelDetailRequest {
  id: number;
}
export type PaymentChannelDetailResponse = ApiSuccessResponse<PaymentChannel>;

// CREATE
export interface PaymentChannelCreateRequest {
  paymentChannel: string;
  connectionName?: string;
  channelStatus: string;
  currencyCode: string;
  msgStandard?: string;
  webView: number;
  paraStatus: number;
  activeStatus: number;
  jsonData?: JsonData;
}
export type PaymentChannelCreatedResponse<T> = ApiSuccessResponse<T>;

// DELETE
export interface PaymentChannelDeleteRequest {
  id: number;
}
// Backend mới trả data là string message (ví dụ: "ID của kênh thanh toán đã xóa: 123...")
export type PaymentChannelDeleteResponse = ApiSuccessResponse<string>;

// UPDATE
export interface PaymentChannelUpdateRequest {
  id: number;
  paymentChannel: string;
  connectionName: string;
  channelStatus: string;
  currencyCode: string;
  msgStandard: string;
  webView: number;
  paraStatus: number;
  activeStatus: number;
  jsonData?: JsonData;
}
export type PaymentChannelUpdateResponse<T> = ApiSuccessResponse<T>;
