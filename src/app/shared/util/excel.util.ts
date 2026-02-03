export function getFilenameFromContentDisposition(
  contentDisposition: string | null | undefined,
  fallback: string,
) {
  const cd = contentDisposition ?? '';
  // hỗ trợ cả filename*=UTF-8''... và filename="..."
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
  const raw = match?.[1] || match?.[2];
  if (!raw) return fallback;

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
