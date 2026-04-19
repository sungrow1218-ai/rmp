import { COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { conditionTypeNameMap, unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  /** 33-剩余有效申报金额，比较方向支持：大于、大于等于，单位万元 */
  {
    conditionType: '33',
    conditionTypeName: conditionTypeNameMap['33'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 34-剩余有效申报数量，比较方向支持：大于、大于等于，单位万股 */
  {
    conditionType: '34',
    conditionTypeName: conditionTypeNameMap['34'],
    inputNumberProp: unitCodeToConfigMap.TEN_THOUSAND_SHARES,
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
  /** 48-占市场剩余有效申报数量比例，比较方向支持：大于、大于等于，单位% 阈值条件计算公式：($1|$2)&$3 */
  {
    conditionType: '48',
    conditionTypeName: conditionTypeNameMap['48'],
    inputNumberProp: { ...unitCodeToConfigMap.PERCENT, min: 0 },
    compareOperation: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  },
] as const;

/**
 * Z05201 连续竞价阶段维持涨跌幅价格限制控制
 */
const Config = {
  thresholdConditions,
};

export default Config;
