import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 44-五档内挂单数量 万股 */
  {
    conditionType: '44',
    conditionTypeName: conditionTypeNameMap['44'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 45-五档内挂单金额 万元 */
  {
    conditionType: '45',
    conditionTypeName: conditionTypeNameMap['45'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 46-五档内挂单市场占比 % */
  {
    conditionType: '46',
    conditionTypeName: conditionTypeNameMap['46'],
    inputNumberProp: unitCodeToConfigMap.PERCENT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 29-累计撤销占比 */
  {
    conditionType: '29',
    conditionTypeName: conditionTypeNameMap['29'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

export const thresholdConditions = [
  /** 50-前置条件发生次数 次 */
  {
    conditionType: '50',
    conditionTypeName: conditionTypeNameMap['50'],
    inputNumberProp: unitCodeToConfigMap.TIMES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z03201 开盘集合竞价阶段虚假申报控制
 */
const Config = {
  preConditions,
  thresholdConditions,
};

export default Config;
