import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
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
  /** 35-反向成交金额 */
  {
    conditionType: '35',
    conditionTypeName: conditionTypeNameMap['35'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
  /** 36-反向成交数量 */
  {
    conditionType: '36',
    conditionTypeName: conditionTypeNameMap['36'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT],
  },
] as const;

/**
 * Z01201 频繁拉抬打压控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
