import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 11001-买入金额，比较方向支持：大于、大于等于，单位万元 */
  {
    conditionType: '11001',
    conditionTypeName: '买入金额',
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 11002-卖出金额，比较方向支持：大于、大于等于，单位万元 */
  {
    conditionType: '11002',
    conditionTypeName: '卖出金额',
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 11003-累计成交量对日内最大持仓量倍数 % */
  {
    conditionType: '11003',
    conditionTypeName: '累计成交量对日内最大持仓量倍数',
    inputNumberProp: unitCodeToConfigMap.MULTIPLE,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z07201 大量频繁回转交易控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
