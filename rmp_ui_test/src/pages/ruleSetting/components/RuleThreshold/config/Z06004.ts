import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 15-成交金额 万元 */
  {
    conditionType: '15',
    conditionTypeName: conditionTypeNameMap['15'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
  /** 16-成交数量 万股 */
  {
    conditionType: '16',
    conditionTypeName: conditionTypeNameMap['16'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
  /** 17-委托价格涨跌幅 */
  {
    conditionType: '17',
    conditionTypeName: conditionTypeNameMap['17'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
  /** 18-占市场成交比例 */
  {
    conditionType: '18',
    conditionTypeName: conditionTypeNameMap['18'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
] as const;

export const thresholdConditions = [
  /** 50-累计触发次数 次 */
  {
    conditionType: '50',
    conditionTypeName: conditionTypeNameMap['50'],
    inputNumberProp: unitCodeToConfigMap.TIMES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z06004 频繁拉抬打压控制
 */
const Config = {
  preConditions,
  thresholdConditions,
};

export default Config;
