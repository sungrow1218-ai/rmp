import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const getConfig = (params?: any) => {
  // 分母有值
  if (params) {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.PERCENT,
        min: 0,
        max: 100,
        step: 0.01,
      },
      operations: [
        ALARM_REACTIONS__MAP.WARNING,
        ALARM_REACTIONS__MAP.FORBID,
        ALARM_REACTIONS__MAP.NO_NOTICE,
      ],
    };
  } else {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.TEN_THOUSAND_SHARES,
        min: 0,
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
};

export default getConfig;
