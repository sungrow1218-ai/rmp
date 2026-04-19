// =============================================
// File: matchers.ts
// =============================================
export function matchAcctCode(code: any, query: any) {
  const q = String(query ?? '').trim();
  if (!q) return true;
  const s = String(code ?? '');
  if (!s) return false;
  if (s.includes(q)) return true;
  const segs = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return segs.includes(q);
}
