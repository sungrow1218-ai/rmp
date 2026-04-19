// utils/date.ts
import dayjs from 'dayjs';

export const parseDateToDayjs = (dateValue: any) => {
  if (!dateValue) return null;
  if (dayjs.isDayjs(dateValue)) return dateValue;

  if (typeof dateValue === 'number') {
    const s = String(dateValue);
    if (/^\d{8}$/.test(s)) return dayjs(s, 'YYYYMMDD');
    return dayjs(dateValue);
  }

  if (typeof dateValue === 'string') {
    if (dateValue.includes('T') || dateValue.includes('-'))
      return dayjs(dateValue);
    if (/^\d{8}$/.test(dateValue)) return dayjs(dateValue, 'YYYYMMDD');
    return dayjs(dateValue);
  }

  return dayjs(dateValue);
};

export const formatDateToInt = (dateValue: any): number | undefined => {
  if (!dateValue) return undefined;
  if (typeof dateValue === 'number') return dateValue;

  if (dayjs.isDayjs(dateValue)) return Number(dateValue.format('YYYYMMDD'));

  if (dateValue?.format && typeof dateValue.format === 'function') {
    return Number(dateValue.format('YYYYMMDD'));
  }

  if (typeof dateValue === 'string') {
    if (/^\d{8}$/.test(dateValue)) return Number(dateValue);
    return Number(dateValue.replace(/-/g, ''));
  }

  if (dateValue instanceof Date) {
    return Number(dayjs(dateValue).format('YYYYMMDD'));
  }

  return undefined;
};
