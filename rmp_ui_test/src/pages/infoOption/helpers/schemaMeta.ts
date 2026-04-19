// helpers/schemaMeta.ts
import type { FormSchema } from '@/components/Form';
import type { FieldType } from '../types';

export const getFieldTypeInfo = (
  fieldName: string,
  schemaList: FormSchema[]
): FieldType => {
  const fieldSchema = schemaList.find((s) => s.field === fieldName);

  if (fieldSchema) {
    const { component } = fieldSchema;
    if (component === 'InputNumber') return 'number';
    if (
      component === 'Select' ||
      component === 'ApiSelect' ||
      component === 'TreeSelect'
    )
      return 'select';
    if (component === 'DatePicker' || component === 'RangePicker')
      return 'date';
    return 'string';
  }

  const numericFields = [
    'contractMultiplier',
    'limitOrderAmountMin',
    'limitOrderAmountMax',
    'marketOrderAmountMin',
    'marketOrderAmountMax',
    'exercisePrice',
  ];

  const selectFields = [
    'marketId',
    'optionType',
    'optionKindCode',
    'securityType',
    'tradeCurrencyCode',
    'deliveryMethod',
    'underlyingMarketId',
  ];

  const dateFields = [
    'listDate',
    'lastTradeDate',
    'exerciseBeginDate',
    'exerciseEndDate',
    'exerciseDate',
  ];

  if (numericFields.includes(fieldName)) return 'number';
  if (selectFields.includes(fieldName)) return 'select';
  if (dateFields.includes(fieldName)) return 'date';
  return 'string';
};

export const getFieldLabel = (
  fieldName: string,
  schemaList: FormSchema[]
): string => {
  const fieldSchema = schemaList.find((s) => s.field === fieldName);
  return (fieldSchema?.label as string) || fieldName;
};
