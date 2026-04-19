// helpers/validation.ts
import type { FormActionType, FormSchema } from '@/components/Form';
import type { FieldType } from '../types';
import { getFieldLabel } from './schemaMeta';

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
        if (fieldInfo.type === 'string') return Promise.resolve();

        const isEmpty = value === undefined || value === null || value === '';
        if (isEmpty) return Promise.reject(new Error(`${placeholderText}`));

        return Promise.resolve();
      },
    },
  ];
};

/**
 * 恢复只读字段（编辑态防止被改）
 */
export const restoreReadonlyFields = (
  changedValues: Recordable,
  readonlyFields: string[],
  formRef: React.RefObject<FormActionType>
): void => {
  const touched = readonlyFields.some((f) =>
    Object.prototype.hasOwnProperty.call(changedValues, f)
  );
  if (!touched) return;

  const currentValues = (formRef.current?.getFieldsValue?.() || {}) as Record<
    string,
    any
  >;
  const patch: Record<string, any> = {};

  readonlyFields.forEach((f) => {
    if (Object.prototype.hasOwnProperty.call(changedValues, f))
      patch[f] = currentValues[f];
  });

  if (Object.keys(patch).length > 0) formRef.current?.setFieldsValue(patch);
};
