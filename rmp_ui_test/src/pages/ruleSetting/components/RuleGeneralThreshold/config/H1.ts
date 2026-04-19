import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const getConfig = (params?: any) => {
  if (params === '0') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GTE,
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.LT,
        COMPARE_DIRECTIONS__MAP.LTE,
        COMPARE_DIRECTIONS__MAP.EQUAL,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.PERCENT,
        min: 0,
      },
      operations: [
        ALARM_REACTIONS__MAP.WARNING,
        ALARM_REACTIONS__MAP.FORBID,
        ALARM_REACTIONS__MAP.NO_NOTICE,
      ],
    };
  }
  if (params === '1') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GTE,
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.LT,
        COMPARE_DIRECTIONS__MAP.LTE,
        COMPARE_DIRECTIONS__MAP.EQUAL,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.YUAN,
        min: 0,
        max: 99999999.9999,
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
