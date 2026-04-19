// helpers/schemaMeta.ts
import type { FormSchema } from '@/components/Form';
import {
  basicSchemasFut,
  tradeSchemasFut,
  basicSchemasFuturesKind,
  basicSchemasContract,
} from '../futuresData';
import type { DataType, FieldType } from '../types';

export const getSchemaListByType = (
  dataType: DataType,
  isTradeParam: boolean
): FormSchema[] => {
  if (isTradeParam) return tradeSchemasFut;

  switch (dataType) {
    case 'futures':
      return basicSchemasFut;
    case 'futuresKind':
      return basicSchemasFuturesKind;
    case 'contract':
      return basicSchemasContract;
    default:
      return [];
  }
};

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

  // 兜底：保持你原先逻辑
  const numericFields = [
    'contractMultiplier',
    'marketPositionAmount',
    'preMarketPosiAmount',
    'limitOrderAmountMin',
    'limitOrderAmountMax',
    'marketOrderAmountMin',
    'marketOrderAmountMax',
  ];

  const selectFields = [
    'marketId',
    'futuresKindCode',
    'securityType',
    'tradeCurrencyCode',
    'deliveryMethod',
    'arbitrageType',
  ];

  const dateFields = [
    'listDate',
    'lastTradeDate',
    'lastDeliveryDate',
    'contractMonth',
    'effectiveDate',
    'expireDate',
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
