import { IValue } from '../components/InputNumber';

export const RulesMap = {
  required: {
    validator: (_: any, value: IValue) => {
      if (!value || value.value === null) {
        return Promise.reject(new Error('请填写'));
      }
      return Promise.resolve();
    },
  },
  threshold: {
    validator: (_: any, value: IValue) => {
      if (
        value &&
        value.defaultValue &&
        value.value &&
        value.value > value.defaultValue
      ) {
        return Promise.reject(new Error('超出监管值'));
      }
      return Promise.resolve();
    },
  },
};
