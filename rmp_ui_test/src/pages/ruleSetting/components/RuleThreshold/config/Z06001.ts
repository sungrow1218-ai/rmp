import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 58-单日申报数量 笔 */
  {
    conditionType: '58',
    conditionTypeName: conditionTypeNameMap['58'],
    inputNumberProp: unitCodeToConfigMap.AMOUNT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z06001 单日申报数量控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
