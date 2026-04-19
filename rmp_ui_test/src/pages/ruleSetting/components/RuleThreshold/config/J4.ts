import { unitCodeToConfigMap } from './const';

export const thresholdConditions = [
  // 11000-自成交数量市场占比，单位：%，取值范围：0~100%；
  {
    conditionType: '11000',
    conditionTypeName: '自成交数量市场占比',
    inputNumberProp: unitCodeToConfigMap.PERCENT,
  },
  // 11004-单证券自成交次数，单位：次，取值范围：0~99999999；
  {
    conditionType: '11004',
    conditionTypeName: '单证券自成交次数',
    inputNumberProp: unitCodeToConfigMap.TIMES,
  },
  // 11003-单市场自成交次数，单位：次，取值范围：0~99999999；
  {
    conditionType: '11003',
    conditionTypeName: '单市场自成交次数',
    inputNumberProp: unitCodeToConfigMap.TIMES,
  },
] as const;

/**
 * J4 自买自卖或互为对手方控制(单向豁免)
 */
const Config = {
  thresholdConditions,
};

export default Config;
