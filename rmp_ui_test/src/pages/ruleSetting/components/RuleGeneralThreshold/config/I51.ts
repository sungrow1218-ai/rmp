import { ALARM_REACTIONS__MAP, COMPARE_DIRECTIONS__MAP } from '@/utils/dict';
import { unitCodeToConfigMap } from './const';

const config = {
  thresholdCount: 1,
  compareDirection: [COMPARE_DIRECTIONS__MAP.GTE],
  inputNumberProp: {
    ...unitCodeToConfigMap.TIMES,
    min: 1,
    max: 1,
    disabled: true,
  },
  operations: [
    ALARM_REACTIONS__MAP.WARNING,
    ALARM_REACTIONS__MAP.FORBID,
    ALARM_REACTIONS__MAP.NO_NOTICE,
  ],
} as const;

export default config;
