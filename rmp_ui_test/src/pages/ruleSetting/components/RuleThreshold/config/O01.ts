import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 22-撤单笔数 笔 */
  {
    conditionType: '22',
    conditionTypeName: conditionTypeNameMap['22'],
    inputNumberProp: unitCodeToConfigMap.AMOUNT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

export const thresholdConditions = [
  /** 23-撤单委托比 */
  {
    conditionType: '23',
    conditionTypeName: conditionTypeNameMap['23'],
    inputNumberProp: unitCodeToConfigMap.PERCENT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * O01 委托撤单比控制
 */
const Config = {
  preConditions,
  thresholdConditions,
};

export default Config;
