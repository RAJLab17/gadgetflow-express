export const BLACK_WEEK_NOTAUS = false;
export const BLACK_WEEK_START = Date.parse('2026-11-18T00:00:00+01:00');
export const BLACK_WEEK_END = Date.parse('2026-11-30T23:59:59+01:00');
let remembered: string | null = null;
export function blackWeekActive(now: number, override: string | null, emergency = BLACK_WEEK_NOTAUS) {
  if (emergency || override === 'aus') return false;
  return override === 'vorschau' || (now >= BLACK_WEEK_START && now <= BLACK_WEEK_END);
}
export function isBlackWeek(): boolean {
  if (typeof window === 'undefined') return blackWeekActive(Date.now(), null);
  const value = new URLSearchParams(window.location.search).get('bw');
  if (value === 'vorschau' || value === 'aus') {
    remembered = value;
    try { sessionStorage.setItem('raj-black-week', value); } catch { /* Memory fallback. */ }
  } else {
    try { remembered = sessionStorage.getItem('raj-black-week') ?? remembered; } catch { /* Memory fallback. */ }
  }
  return blackWeekActive(Date.now(), remembered);
}
export function blackWeekDiscountCodes(codes?: string[], active = isBlackWeek()) {
  return active ? codes?.filter(code => !['MATRIXBUNDLE', 'MATRIX2'].includes(code.toUpperCase())) : codes;
}
export function blackWeekMatrixLines(phoneId: string, caseId: string, quantity: number, includeCase: boolean) {
  return [{ merchandiseId: phoneId, quantity }, ...(includeCase ? [{merchandiseId: caseId, quantity}] : [])];
}