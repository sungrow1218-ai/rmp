import { isNumber } from 'lodash';

import type { ComponentType } from './types';

export const DEFAULT_VALUE_COMPONENTS = [
  'Input',
  'InputPassword',
  'InputNumber',
  'InputSearch',
  'InputTextArea',
];

export const DATE_TYPE_COMPONENTS = [
  'DatePicker',
  'MonthPicker',
  'WeekPicker',
  'TimePicker',
  'RangePicker',
];

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val;
  if (DEFAULT_VALUE_COMPONENTS.includes(component)) {
    return val && isNumber(val) ? val : `${val}`;
  }
  return val;
}
