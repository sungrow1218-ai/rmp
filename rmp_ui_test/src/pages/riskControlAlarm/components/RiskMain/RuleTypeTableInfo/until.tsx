import { FactorResult, WarnRemarkData } from '@/services/riskControlAlarm';
import {
  ALARM_REACTIONS,
  ENTRUST_DIRECTION,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import React from 'react';

export const showWarnType = (value: number) => {
  return transformDictCodeToNameHelper(String(value), ALARM_REACTIONS) ?? '';
};

export const colorSpan = (value: any) => {
  return <span style={{ color: 'red' }}>{value}</span>;
};

// 基础指标阈值
/**
 *
 * @param data
 * @param isT  1百分比 2万 3默认
 * @returns
 */
export const warnValue = (data: any, isT = 3, unit: string) => {
  if (
    data?.operation &&
    data.operation === 1 &&
    (data.warnThreshold || data.warnThreshold === 0)
  ) {
    if (data.warnThreshold === 'inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === '-inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.warnThreshold === 'number') {
      const value = (data.warnThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data?.warnThreshold === 'number') {
      const value = (data.warnThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data?.warnThreshold === 'number') {
      const value = data?.warnThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  if (
    data?.operation &&
    data.operation === 2 &&
    (data.banThreshold || data.banThreshold === 0)
  ) {
    if (data.banThreshold === '-inf' || data.banThreshold === 'inf') {
      return ',默认触警';
    }
    if (data.banThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.banThreshold === 'number') {
      const value = (data.banThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data.banThreshold === 'number') {
      const value = (data.banThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data.banThreshold === 'number') {
      const value = data.banThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  if (
    data?.operation &&
    data.operation === 3 &&
    (data.ignoreThreshold || data.ignoreThreshold === 0)
  ) {
    if (data.ignoreThreshold === 'inf' || data.ignoreThreshold === '-inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.banThreshold === 'number') {
      const value = (data.ignoreThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data.ignoreThreshold === 'number') {
      const value = (data.ignoreThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data.ignoreThreshold === 'number') {
      const value = data.ignoreThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  return '';
};

export const showIndexValue = (data: any, isT: number, unit: string) => {
  if (data === 'inf') {
    return '默认触警';
  }
  if (data === '-inf') {
    return '默认触警';
  }
  if (data === 'nan') {
    return '无效';
  }
  if (isT === 1 && typeof data === 'number') {
    const value = Number((data * 100).toFixed(2));
    return `${value}${unit}`;
  }
  if (isT === 2 && typeof data === 'number') {
    const value = (data / 10000).toFixed(6);
    return `${value}${unit}`;
  }
  if (isT === 3 && typeof data === 'number') {
    const value = data;
    if (unit === '倍') {
      const value1 = value.toFixed(2);
      return `${value1}${unit}`;
    }
    return `${value}${unit}`;
  }
  return '--';
};

// 委托方向

export const orderDirection = (value: number) => {
  if (value === 1) return '买入';
  if (value === 2) return '卖出';
  return '';
};

export const factorTypeWarn = (
  data: any,
  isT = 3,
  unit: string,
  operation: number
) => {
  if (
    operation &&
    operation === 1 &&
    (data.warnThreshold || data.warnThreshold === 0)
  ) {
    if (data.warnThreshold === 'inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === '-inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.warnThreshold === 'number') {
      const value = (data.warnThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data?.warnThreshold === 'number') {
      const value = (data.warnThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data?.warnThreshold === 'number') {
      const value = data?.warnThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  if (
    operation &&
    operation === 2 &&
    (data.banThreshold || data.banThreshold === 0)
  ) {
    if (data.banThreshold === '-inf' || data.banThreshold === 'inf') {
      return ',默认触警';
    }
    if (data.banThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.banThreshold === 'number') {
      const value = (data.banThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data.banThreshold === 'number') {
      const value = (data.banThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data.banThreshold === 'number') {
      const value = data.banThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  if (
    operation &&
    operation === 3 &&
    (data.ignoreThreshold || data.ignoreThreshold === 0)
  ) {
    if (data.ignoreThreshold === 'inf' || data.ignoreThreshold === '-inf') {
      return ',默认触警';
    }
    if (data.warnThreshold === 'nan') {
      return ',阈值无效';
    }
    if (isT === 1 && typeof data.banThreshold === 'number') {
      const value = (data.ignoreThreshold * 100).toFixed(2);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 2 && typeof data.ignoreThreshold === 'number') {
      const value = (data.ignoreThreshold / 10000).toFixed(6);
      return `,触达阈值=${value}${unit}`;
    }
    if (isT === 3 && typeof data.ignoreThreshold === 'number') {
      const value = data.ignoreThreshold;
      if (unit === '倍') {
        const value1 = value.toFixed(2);
        return `,触达阈值=${value1}${unit}`;
      }
      return `,触达阈值=${value}${unit}`;
    }
    return '';
  }
  return '';
};
