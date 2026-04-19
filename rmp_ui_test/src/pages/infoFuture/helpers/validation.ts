// helpers/validation.ts
import type { FormSchema } from '@/components/Form';
import type { FieldType } from '../types';
import { getFieldLabel } from './schemaMeta';

export const fieldIsRequired = (
  fieldSchema: FormSchema,
  currentValidationFn?: Function
): boolean => {
  if (fieldSchema.required === true) return true;

  if (Array.isArray(fieldSchema.rules) && fieldSchema.rules.length > 0) {
    return fieldSchema.rules.some((rule: any) => {
      if (rule.required === true) return true;

      if (rule.validator && typeof rule.validator === 'function') {
        if (currentValidationFn && rule.validator === currentValidationFn)
          return false;
        return false; // 保守：自定义 validator 不等同必填
      }
      return false;
    });
  }

  return false;
};

export const createFieldValidationRule = (
  fieldName: string,
  fieldInfo: { value: any; type: FieldType },
  schemaList: FormSchema[],
  placeholder?: string
): FormSchema['rules'] => {
  const fieldLabel = getFieldLabel(fieldName, schemaList);
  const placeholderText = placeholder || fieldLabel;

  return [
    {
      validator: async (_rule: any, value: any) => {
        // 字符串允许清空
        if (fieldInfo.type === 'string') return Promise.resolve();

        const isEmpty = value === undefined || value === null || value === '';
        if (isEmpty) return Promise.reject(new Error(`${placeholderText}`));

        return Promise.resolve();
      },
    },
  ];
};
