import { ApiSuccessResponse } from './para-payment-channel.model';


// API
export interface ApprovalParaStatusRequest {
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'CANCEL';
  ids: number[];
}

export interface ApprovalParaStatusResponseData {
  totalUpdated: number;
  targetStatus: number;
}

export type ApprovalParaStatusResponse =
  ApiSuccessResponse<ApprovalParaStatusResponseData>;


// Util
export const PARA_STATUS = {
  NEW: 0,
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  DELETED: 4,
} as const;

export const PARA_STATUS_LABELS: Record<number, string> = {
  [PARA_STATUS.NEW]: 'Mới',
  [PARA_STATUS.PENDING]: 'Chờ',
  [PARA_STATUS.APPROVED]: 'Đã phê duyệt',
  [PARA_STATUS.REJECTED]: 'Từ chối',
  [PARA_STATUS.DELETED]: 'Xóa',
};

export type ApprovalAction = 'SUBMIT' | 'APPROVE' | 'REJECT' | 'CANCEL';

export const ACTION_REQUIRED_STATUS: Record<ApprovalAction, number> = {
  SUBMIT: PARA_STATUS.NEW,
  APPROVE: PARA_STATUS.PENDING,
  REJECT: PARA_STATUS.PENDING,
  CANCEL: PARA_STATUS.APPROVED,
};
