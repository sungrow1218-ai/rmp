import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 11000-自成交比例 % */
  {
    conditionType: '11000',
    conditionTypeName: conditionTypeNameMap['11000'],
    inputNumberProp: unitCodeToConfigMap.PERCENT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 11004-自成交次数 次 */
  {
    conditionType: '11004',
    conditionTypeName: conditionTypeNameMap['11004'],
    inputNumberProp: unitCodeToConfigMap.TIMES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 11005-自成交金额 万元 */
  {
    conditionType: '11005',
    conditionTypeName: conditionTypeNameMap['11005'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z06003 频繁瞬时撤单控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
