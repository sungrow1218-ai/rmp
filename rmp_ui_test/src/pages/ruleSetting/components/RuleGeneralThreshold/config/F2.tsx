import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const getConfig = () => {
  return {
    thresholdCount: 2,
    compareDirection: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
    inputNumberProp: {
      ...unitCodeToConfigMap.TEN_THOUSAND_YUAN,
      min: 0.0,
      max: 99999999.9999,
      step: 0.0001,
    },
    operations: [ALARM_REACTIONS__MAP.WARNING, ALARM_REACTIONS__MAP.FORBID],
  };
};

export default getConfig;
