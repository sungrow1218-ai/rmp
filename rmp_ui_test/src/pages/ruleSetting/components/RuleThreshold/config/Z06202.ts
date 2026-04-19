import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 57-每秒申报数量 笔 */
  {
    conditionType: '57',
    conditionTypeName: conditionTypeNameMap['57'],
    inputNumberProp: unitCodeToConfigMap.AMOUNT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z06006 瞬时申报速率异常控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
