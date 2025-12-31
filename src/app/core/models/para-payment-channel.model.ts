export type JsonData = Record<string, unknown>;

export interface PaymentChannel {
  id: string;
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

export interface PaymentChannelCreateRequest {
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
export interface PaymentChannelDeleteRequest {
  id: string;
}

export interface PaymentChannelCreateResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaymentChannelUpdateRequest {
  id: string;
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

export interface PaymentChannelUpdateResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaymentChannelRequest {
  pageNo: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElements: number;
    items: T[];
  };
}

export interface PaymentChannelDeleteResponse {
  status: number;
  message: string;
}
