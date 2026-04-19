import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 33-剩余有效申报金额，比较方向支持：大于、大于等于，单位万元 */
  {
    conditionType: '33',
    conditionTypeName: '涨跌停价新增申报金额',
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 34-剩余有效申报数量，比较方向支持：大于、大于等于，单位万股 */
  {
    conditionType: '34',
    conditionTypeName: '涨跌停价新增申报数量',
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 48-涨跌幅限制价格占市场成交比例 % */
  {
    conditionType: '48',
    conditionTypeName: '收盘涨跌停价剩余申报市场占比',
    inputNumberProp: unitCodeToConfigMap.PERCENT,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 51-市场涨跌停价剩余申报数量 万股 */
  {
    conditionType: '51',
    conditionTypeName: conditionTypeNameMap['51'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 52-市场涨跌停价剩余申报金额 万元 */
  {
    conditionType: '52',
    conditionTypeName: conditionTypeNameMap['52'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z05301 收盘集合竞价阶段维持涨跌幅价格限制控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
