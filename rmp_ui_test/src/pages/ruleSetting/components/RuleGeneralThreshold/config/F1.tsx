import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const getConfig = (params?: any) => {
  // 1-按金额计算

  if (params === '1') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
        COMPARE_DIRECTIONS__MAP.LT,
        COMPARE_DIRECTIONS__MAP.LTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.TEN_THOUSAND_YUAN,
        min: 0.0,
        max: 99999999.9999,
        step: 0.0001,
      },
      operations: [
        ALARM_REACTIONS__MAP.WARNING,
        ALARM_REACTIONS__MAP.FORBID,
        ALARM_REACTIONS__MAP.NO_NOTICE,
      ],
    };
  }
  // 2-按数量计算
  if (params === '2') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
        COMPARE_DIRECTIONS__MAP.LT,
        COMPARE_DIRECTIONS__MAP.LTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.TEN_THOUSAND_SHARES,
        min: 0,
        max: 99999999,
        step: 0.0001,
      },
      operations: [
        ALARM_REACTIONS__MAP.WARNING,
        ALARM_REACTIONS__MAP.FORBID,
        ALARM_REACTIONS__MAP.NO_NOTICE,
      ],
    };
  }
  return {
    thresholdCount: 0,
    compareDirection: [],
    inputNumberProp: { code: '' },
    operations: [],
  };
};

export default getConfig;
