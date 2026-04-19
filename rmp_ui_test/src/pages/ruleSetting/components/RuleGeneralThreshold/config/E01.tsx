import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const config = {
  thresholdCount: 3,
  compareDirection: [COMPARE_DIRECTIONS__MAP.GTE, COMPARE_DIRECTIONS__MAP.GT],
  inputNumberProp: {
    ...unitCodeToConfigMap.TEN_THOUSAND_YUAN,
    min: 0,
    step: 0.0001,
    precision: 4,
  },
  operations: [
    ALARM_REACTIONS__MAP.WARNING,
    ALARM_REACTIONS__MAP.FORBID,
    ALARM_REACTIONS__MAP.NO_NOTICE,
  ],
} as const;

export default config;
