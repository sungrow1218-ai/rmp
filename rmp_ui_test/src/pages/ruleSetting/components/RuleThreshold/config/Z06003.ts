import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 64-瞬时撤单次数 次 */
  {
    conditionType: '64',
    conditionTypeName: conditionTypeNameMap['64'],
    inputNumberProp: unitCodeToConfigMap.TIMES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 65-当日瞬时撤单次数占比 % */
  {
    conditionType: '65',
    conditionTypeName: conditionTypeNameMap['65'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 66-当日瞬时撤单金额占比 % */
  {
    conditionType: '66',
    conditionTypeName: conditionTypeNameMap['66'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
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
