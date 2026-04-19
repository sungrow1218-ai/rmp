import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 34-涨跌停价挂单数量 万股 */
  {
    conditionType: '34',
    conditionTypeName: conditionTypeNameMap['34'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 33-涨跌停价挂单金额 万元 */
  {
    conditionType: '33',
    conditionTypeName: conditionTypeNameMap['33'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 48-涨跌幅限制价格占市场成交比例 % */
  {
    conditionType: '48',
    conditionTypeName: conditionTypeNameMap['48'],
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
