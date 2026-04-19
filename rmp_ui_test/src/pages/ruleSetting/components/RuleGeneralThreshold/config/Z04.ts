import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const config = {
  thresholdCount: 3,
  compareDirection: [COMPARE_DIRECTIONS__MAP.GT, COMPARE_DIRECTIONS__MAP.GTE],
  inputNumberProp: { ...unitCodeToConfigMap.TIMES, min: 0, max: 99999999 },
  operations: [
    ALARM_REACTIONS__MAP.WARNING,
    ALARM_REACTIONS__MAP.FORBID,
    ALARM_REACTIONS__MAP.NO_NOTICE,
  ],
} as const;

export default config;
