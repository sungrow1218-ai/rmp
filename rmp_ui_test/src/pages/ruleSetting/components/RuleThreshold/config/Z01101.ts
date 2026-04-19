import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const preConditions = [
  /** 17-委托价格涨跌幅 */
  {
    conditionType: '17',
    conditionTypeName: conditionTypeNameMap['17'],
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
    required: true,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 16-成交数量 万股 */
  {
    conditionType: '16',
    conditionTypeName: conditionTypeNameMap['16'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    required: true,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 18-占市场成交比例 */
  {
    conditionType: '18',
    conditionTypeName: conditionTypeNameMap['18'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 48-涨跌幅限制价格占市场成交比例 % */
  {
    conditionType: '48',
    conditionTypeName: conditionTypeNameMap['48'],
    inputNumberProp: unitCodeToConfigMap.PERCENT,
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
