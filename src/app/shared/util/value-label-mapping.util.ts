// payment-channel-mapping.util.ts
export type StatusPillVariant = 'success' | 'warning' | 'danger' | 'muted';

const MAPS = {
  connectionName: new Map<string, string>([
    ['API', 'API'],
    ['FTP', 'FTP'],
    ['JMS', 'JMS'],
    ['OTHERS', 'Khác'],
    ['SFTP', 'SFTP'],
    ['SFTP_CONNECTION', 'SFTP Connection'],
    ['SFTP_CONNECTION_V2', 'SFTP Connection V2'],
  ]),
  currencyCode: new Map<string, string>([
    ['EUR', 'Đồng Euro'],
    ['GBP', 'Bảng Anh'],
    ['JPY', 'Yên Nhật'],
    ['USD', 'Đô la Mỹ'],
    ['VND', 'Việt Nam đồng'],
  ]),
  msgStandard: new Map<string, string>([
    ['ISO8583', 'ISO8583'],
    ['JSON', 'JSON'],
    ['SWIFT', 'SWIFT'],
    ['XML', 'XML'],
  ]),
  channelStatus: new Map<string, string>([
    ['ACTIVE', 'Đang hoạt động'],
    ['CLOSED', 'Đã đóng'],
    ['PENDING', 'Chờ xử lý'],
  ]),
  paraStatus: new Map<string, string>([
    ['1', 'Chờ'],
    ['2', 'Đã phê duyệt'],
    ['3', 'Từ chối'],
    ['4', 'Xóa'],
    ['5', 'Xét lại'],
  ]),
  webView: new Map<string, string>([
    ['0', 'Không'],
    ['1', 'Có'],
  ]),
  activeStatus: new Map<string, string>([
    ['0', 'Không'],
    ['1', 'Có'],
  ]),
} as const;

export type PaymentChannelMapKey = keyof typeof MAPS;

export function displayMappedValue<K extends PaymentChannelMapKey>(
  field: K,
  raw: unknown,
  emptyFallback = '—'
): string {
  if (raw === null || raw === undefined || raw === '') return emptyFallback;
  return MAPS[field].get(String(raw)) ?? String(raw);
}

/**
 * Variant mapping cho TẤT CẢ field.
 * - Bạn có thể tinh chỉnh "mức độ" theo nghiệp vụ.
 * - Nếu không match -> fallback 'muted' (vẫn có màu).
 */
const PILL_VARIANTS: Partial<
  Record<PaymentChannelMapKey, Record<string, StatusPillVariant>>
> = {
  // status-like (giữ như cũ)
  channelStatus: {
    ACTIVE: 'success',
    PENDING: 'warning',
    CLOSED: 'danger',
  },
  paraStatus: {
    '2': 'success', // Đã phê duyệt
    '1': 'warning', // Chờ
    '5': 'warning', // Xét lại
    '3': 'danger', // Từ chối
    '4': 'muted', // Xóa
  },
  webView: {
    '1': 'success',
    '0': 'muted',
  },
  activeStatus: {
    '1': 'success',
    '0': 'muted',
  },

  // non-status fields (bạn chỉnh tùy ý)
  connectionName: {
    API: 'success',
    SFTP: 'success',
    SFTP_CONNECTION: 'success',
    SFTP_CONNECTION_V2: 'success',
    FTP: 'warning',
    JMS: 'warning',
    OTHERS: 'muted',
  },
  msgStandard: {
    ISO8583: 'success',
    SWIFT: 'warning',
    JSON: 'muted',
    XML: 'muted',
  },
  currencyCode: {
    VND: 'success',
    USD: 'warning',
    EUR: 'warning',
    GBP: 'warning',
    JPY: 'warning',
  },
};

/** ✅ Luôn trả về 1 variant -> mọi value đều có màu */
export function getPillVariant(
  field: PaymentChannelMapKey,
  raw: unknown
): StatusPillVariant {
  if (raw === null || raw === undefined || raw === '') return 'muted';

  const v = String(raw);
  const byField = PILL_VARIANTS[field];

  if (byField && byField[v]) return byField[v];

  // fallback theo kiểu dữ liệu: boolean-ish thì tô rõ hơn
  if (v === '1') return 'success';
  if (v === '0') return 'muted';

  return 'muted';
}

/** Convert variant -> CSS class name */
export function pillClass(variant: StatusPillVariant): string {
  return `pill--${variant}`;
}
