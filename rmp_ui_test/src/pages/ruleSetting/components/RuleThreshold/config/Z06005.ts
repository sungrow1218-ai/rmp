import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 67-指数波动率 % */
  {
    conditionType: '67',
    conditionTypeName: conditionTypeNameMap['67'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 68-指数成分股成交金额 万元 */
  {
    conditionType: '68',
    conditionTypeName: conditionTypeNameMap['68'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 69-本方成交金额市场占比 % */
  {
    conditionType: '69',
    conditionTypeName: conditionTypeNameMap['69'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z06005 短时间大额成交控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
