import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 38-开（收）盘价涨跌幅 */
  {
    conditionType: '38',
    conditionTypeName: '收盘价涨跌幅',
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

export const thresholdConditions = [
  /** 15-成交金额 万元 */
  {
    conditionType: '15',
    conditionTypeName: conditionTypeNameMap['15'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 16-成交数量 万股 */
  {
    conditionType: '16',
    conditionTypeName: conditionTypeNameMap['16'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 18-占市场成交比例 */
  {
    conditionType: '18',
    conditionTypeName: conditionTypeNameMap['18'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 35-反向成交金额 万元 */
  {
    conditionType: '35',
    conditionTypeName: conditionTypeNameMap['35'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 36-反向成交数量 万股 */
  {
    conditionType: '36',
    conditionTypeName: conditionTypeNameMap['36'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z01101 开盘集合竞价阶段拉抬打压控制
 */
const Config = {
  preConditions,
  thresholdConditions,
};

export default Config;
