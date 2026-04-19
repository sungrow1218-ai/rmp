import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const config = {
  thresholdCount: 3,
  compareDirection: [COMPARE_DIRECTIONS__MAP.GTE, COMPARE_DIRECTIONS__MAP.GT],
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
} as const;

export default config;
