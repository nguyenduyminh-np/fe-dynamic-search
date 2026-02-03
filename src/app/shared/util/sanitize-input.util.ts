import { PaymentChannelNativeSearchRequest } from '../../core/models/common.model';

/**
 * BA: Strip empty fields trước khi gửi API
 * - giữ pageNo/pageSize
 * - string: trim, rỗng => bỏ
 * - null/undefined => bỏ
 * - number: giữ cả 0
 * - jsonData: {} => bỏ
 */
export function sanitizeNativeSearchRequest(
  req: PaymentChannelNativeSearchRequest,
): PaymentChannelNativeSearchRequest {
  const out: any = {
    pageNo: req.pageNo,
    pageSize: req.pageSize,
  };

  // Optional sort
  if (typeof req.sortField === 'string' && req.sortField.trim()) {
    out.sortField = req.sortField.trim();
  }
  if (req.sortDir === 'asc' || req.sortDir === 'desc') {
    out.sortDir = req.sortDir;
  }

  // Helper
  const putString = (key: string, v: unknown) => {
    if (typeof v !== 'string') return;
    const s = v.trim();
    if (s) out[key] = s;
  };
  const putNumber = (key: string, v: unknown) => {
    if (typeof v === 'number' && Number.isFinite(v)) out[key] = v;
  };

  putString('paymentChannel', req.paymentChannel);
  putString('connectionName', req.connectionName);
  putString('channelStatus', req.channelStatus);
  putString('currencyCode', req.currencyCode);
  putString('msgStandard', req.msgStandard);

  putNumber('webView', req.webView);
  putNumber('paraStatus', req.paraStatus);
  putNumber('activeStatus', req.activeStatus);

  if (req.jsonData && typeof req.jsonData === 'object') {
    const keys = Object.keys(req.jsonData);
    if (keys.length) out.jsonData = req.jsonData;
  }

  return out as PaymentChannelNativeSearchRequest;
}
