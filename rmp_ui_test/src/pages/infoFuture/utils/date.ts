// utils/date.ts
import dayjs from 'dayjs';

export const parseDateToDayjs = (dateValue: any) => {
  if (!dateValue) return null;
  if (dayjs.isDayjs(dateValue)) return dateValue;

  if (typeof dateValue === 'number') {
    const s = String(dateValue);
    if (/^\d{8}$/.test(s)) return dayjs(s, 'YYYYMMDD');
    if (/^\d{6}$/.test(s)) return dayjs(s, 'YYYYMM');
    return dayjs(dateValue);
  }

  if (typeof dateValue === 'string') {
    if (dateValue.includes('T') || dateValue.includes('-'))
      return dayjs(dateValue);
    if (/^\d{8}$/.test(dateValue)) return dayjs(dateValue, 'YYYYMMDD');
    if (/^\d{6}$/.test(dateValue)) return dayjs(dateValue, 'YYYYMM');
    return dayjs(dateValue);
  }

  return dayjs(dateValue);
};

export const toYYYYMMDD = (v: any): number | undefined => {
  if (!v) return undefined;
  if (typeof v === 'number') return v;

  if (dayjs.isDayjs(v)) return Number(v.format('YYYYMMDD'));
  if (v instanceof Date) return Number(dayjs(v).format('YYYYMMDD'));

  if (typeof v === 'string') {
    const d = dayjs(v);
    if (d.isValid()) return Number(d.format('YYYYMMDD'));
    if (/^\d{8}$/.test(v)) return Number(v);
  }

  return undefined;
};
