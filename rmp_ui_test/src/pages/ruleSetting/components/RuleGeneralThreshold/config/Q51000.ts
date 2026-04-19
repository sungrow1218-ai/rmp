import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const getConfig = (params?: any) => {
  // 2-按数量计算
  if (params === '2') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.TEN_THOUSAND_SHARES,
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
  // 10001-按次数计算
  if (params === '10001') {
    return {
      thresholdCount: 3,
      compareDirection: [
        COMPARE_DIRECTIONS__MAP.GT,
        COMPARE_DIRECTIONS__MAP.GTE,
      ],
      inputNumberProp: {
        ...unitCodeToConfigMap.TIMES,
        min: 0,
        max: 99999999,
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
