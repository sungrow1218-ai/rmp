import { UNITS__MAP } from '@/utils/dict';

/**
 * 单位字典 code 到单位对应配置的映射，主要包含，max，min，precision
 */
export const unitCodeToConfigMap = {
  /**
   * 笔
   */
  AMOUNT: {
    name: UNITS__MAP.AMOUNT.name,
    code: UNITS__MAP.AMOUNT.code,
    min: 1,
    max: 99999999,
    precision: 0,
  },
  /**
   * %
   */
  PERCENT: {
    name: UNITS__MAP.PERCENT.name,
    code: UNITS__MAP.PERCENT.code,
    min: -100,
    max: 100,
    precision: 2,
  },
  /**
   * 股
   */
  SHARES: {
    name: UNITS__MAP.SHARES.name,
    code: UNITS__MAP.SHARES.code,
    min: 1,
    max: 99999999,
    precision: 0,
  },
  /**
   * 万股
   */
  TEN_THOUSAND_SHARES: {
    name: UNITS__MAP.TEN_THOUSAND_SHARES.name,
    code: UNITS__MAP.TEN_THOUSAND_SHARES.code,
    min: 0.0001,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 元
   */
  YUAN: {
    name: UNITS__MAP.YUAN.name,
    code: UNITS__MAP.YUAN.code,
    min: 0.0001,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 万元
   */
  TEN_THOUSAND_YUAN: {
    name: UNITS__MAP.TEN_THOUSAND_YUAN.name,
    code: UNITS__MAP.TEN_THOUSAND_YUAN.code,
    min: 0.0001,
    max: 99999999.9999,
    precision: 4,
  },
  /**
   * 次
   */
  TIMES: {
    name: UNITS__MAP.TIMES.name,
    code: UNITS__MAP.TIMES.code,
    min: 1,
    max: 99999999,
    precision: 0,
  },
} as const;
