// ===============================
// src/app/core/models/common.model.ts
// ===============================

export interface Option<T = string | number> {
  value: T;
  label: string;
}

export type ParaStatusOption = Option<number>;
export type WebViewOption = Option<number>;
export type ChannelStatusOption = Option<string>;
export type CurrencyCodeOption = Option<string>;
export type ActiveStatusOption = Option<number>;

// Native search
export type JsonData = Record<string, unknown>;

export interface PaymentChannelNativeSearchCriteria {
  paymentChannel?: string;
  connectionName?: string;
  channelStatus?: string;
  currencyCode?: string;
  msgStandard?: string;
  webView?: number;
  paraStatus?: number;
  activeStatus?: number;
  jsonData?: JsonData;
}

export interface PaymentChannelNativeSearchRequest extends PaymentChannelNativeSearchCriteria {
  pageNo: number;
  pageSize: number;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
}
