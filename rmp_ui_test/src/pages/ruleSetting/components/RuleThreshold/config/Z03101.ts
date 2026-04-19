import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 17-委托价格涨跌幅 */
  {
    conditionType: '49',
    conditionTypeName: conditionTypeNameMap['49'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;
export const thresholdConditions = [
  /** 40-累计申报数量 万股 */
  {
    conditionType: '40',
    conditionTypeName: conditionTypeNameMap['40'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 41-累计申报金额 万元 */
  {
    conditionType: '41',
    conditionTypeName: conditionTypeNameMap['41'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 42-同方向累计申报占比 万元 */
  {
    conditionType: '42',
    conditionTypeName: conditionTypeNameMap['42'],
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
  // /** 49-申报价格偏离度 */
  // {
  //   conditionType: '49',
  //   conditionTypeName: conditionTypeNameMap['49'],
  //   inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
  //   compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  // },
  /** 43-低于申报买入/高于申报卖出价次数 */
  {
    conditionType: '43',
    conditionTypeName: conditionTypeNameMap['43'],
    inputNumberProp: unitCodeToConfigMap.TIMES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z03101 开盘集合竞价阶段虚假申报控制
 */
const Config = {
  thresholdConditions,
  preConditions,
};

export default Config;
