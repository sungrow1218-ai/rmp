import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 16-成交数量 万股 */
  {
    conditionType: '16',
    conditionTypeName: conditionTypeNameMap['16'],
    inputNumberProp: {
      ...unitCodeToConfigMap.TEN_THOUSAND_SHARES,
      min: 0.0,
      max: 9999.9999,
    },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

export const thresholdConditions = [
  /** 11003-累计成交量对日内最大持仓量倍数 % */
  {
    conditionType: '11003',
    conditionTypeName: '累计成交量对日内最大持仓量倍数',
    inputNumberProp: unitCodeToConfigMap.MULTIPLE,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z07301 频繁日内回转控制
 */
const Config = {
  preConditions,
  thresholdConditions,
};

export default Config;
