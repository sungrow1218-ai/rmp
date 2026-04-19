import { IValue } from '../components/MultiThreshold';
import { RiskLevel } from '../type';

const hasNullOrUndefined = (obj: Record<string, any>): boolean => {
  return Object.values(obj).some((value) => value == null);
};

export const RulesMap = {
  required: {
    validator: (_: any, value: IValue) => {
      if (
        !value ||
        value.value === null ||
        value.value === undefined ||
        hasNullOrUndefined(value.value)
      ) {
        return Promise.reject(new Error('请填写'));
      }
      return Promise.resolve();
    },
  },
  threshold: {
    validator: (_: any, value: IValue) => {
      if (
        value &&
        value.value &&
        RiskLevel.INTERCEPT in value.value &&
        RiskLevel.WARNING in value.value &&
        RiskLevel.NOTIP in value.value &&
        (value.value[RiskLevel.INTERCEPT] < value.value[RiskLevel.WARNING] ||
          value.value[RiskLevel.WARNING] < value.value[RiskLevel.NOTIP])
      ) {
        return Promise.reject(new Error('一级阈值<=二级阈值<=三级阈值'));
      }
      return Promise.resolve();
    },
  },
};
