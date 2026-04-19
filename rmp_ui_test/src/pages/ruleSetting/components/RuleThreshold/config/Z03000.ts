import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 10029-剩余有效申报金额，比较方向支持：大于、大于等于，单位万元 */
  {
    conditionType: '34000',
    conditionTypeName: conditionTypeNameMap['34000'],
    inputNumberProp: { ...unitCodeToConfigMap.TEN_THOUSAND_YUAN, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 10030-剩余有效申报数量，比较方向支持：大于、大于等于，单位万股 */
  {
    conditionType: '33000',
    conditionTypeName: conditionTypeNameMap['33000'],
    inputNumberProp: { ...unitCodeToConfigMap.TEN_THOUSAND_SHARES, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z03101 开盘集合竞价阶段虚假申报控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
