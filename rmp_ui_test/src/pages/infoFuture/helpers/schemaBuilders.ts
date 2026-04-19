// helpers/schemaBuilders.ts
import type { FormSchema } from '@/components/Form';
import {
  basicSchemasFut,
  tradeSchemasFut,
  basicSchemasFuturesKind,
  basicSchemasContract,
} from '../futuresData';
import type { DataType, FilledFieldsInfo } from '../types';
import { getSchemaListByType } from './schemaMeta';
import { fieldIsRequired, createFieldValidationRule } from './validation';
import {
  normalizeSchemaWidthForSingleColumn,
  setFieldsReadonly,
  patchSchema,
} from '../utils/schemaPatch';

export const buildGetFieldRules = (opts: {
  mode: 'ADD' | 'EDIT';
  type: DataType;
  initialFilledFieldsInfo: FilledFieldsInfo;
}) => {
  const { mode, type, initialFilledFieldsInfo } = opts;

  return (
    fieldName: string,
    isTradeParam = false
  ): FormSchema['rules'] | undefined => {
    if (mode !== 'EDIT') return undefined;

    const fieldInfo = initialFilledFieldsInfo[fieldName];
    if (!fieldInfo) return undefined;

    const schemaList = getSchemaListByType(type, isTradeParam);
    const fieldSchema = schemaList.find((s) => s.field === fieldName);

    if (fieldInfo.type === 'string') return undefined;
    if (fieldSchema && fieldIsRequired(fieldSchema)) return undefined;

    const placeholder = fieldSchema?.componentProps?.placeholder as
      | string
      | undefined;
    return createFieldValidationRule(
      fieldName,
      fieldInfo,
      schemaList,
      placeholder
    );
  };
};

export const getReadonlyFieldsForEdit = (type: DataType): string[] => {
  if (type === 'futures') return ['securityCode', 'marketId'];
  if (type === 'contract') return ['securityCode', 'marketId'];
  if (type === 'futuresKind') return ['marketId', 'futuresKindCode'];
  return [];
};

export const buildBasicSchemas = (opts: {
  type: DataType;
  isSingleColumn: boolean;
  mode: 'ADD' | 'EDIT';
  futuresKindOptions: any[];
  futuresKindLoading: boolean;
  getFieldRules: (
    fieldName: string,
    isTradeParam?: boolean
  ) => FormSchema['rules'] | undefined;
}): FormSchema[] => {
  const {
    type,
    isSingleColumn,
    mode,
    futuresKindOptions,
    futuresKindLoading,
    getFieldRules,
  } = opts;

  let raw: FormSchema[] = [];
  if (type === 'futures') raw = [...basicSchemasFut];
  else if (type === 'futuresKind') raw = [...basicSchemasFuturesKind];
  else raw = [...basicSchemasContract];

  if (type === 'futures') {
    raw = raw.map((s) => {
      if (s.field !== 'futuresKindCode') return s;
      return patchSchema(s, {
        options: futuresKindOptions,
        loading: futuresKindLoading,
        allowClear: true,
      });
    });
  }

  if (mode === 'EDIT') {
    const readonlyFields = getReadonlyFieldsForEdit(type);
    if (readonlyFields.length > 0) raw = setFieldsReadonly(raw, readonlyFields);

    raw = raw.map((s) => {
      const fieldName = String(s.field);
      const rules = getFieldRules(fieldName, false);
      if (!rules) return s;
      return { ...s, rules: [...(s.rules || []), ...rules] };
    });
  }

  raw = normalizeSchemaWidthForSingleColumn(raw, isSingleColumn);
  return raw;
};

export const buildTradeSchemas = (opts: {
  type: DataType;
  mode: 'ADD' | 'EDIT';
  getFieldRules: (
    fieldName: string,
    isTradeParam?: boolean
  ) => FormSchema['rules'] | undefined;
}): FormSchema[] => {
  const { type, mode, getFieldRules } = opts;
  if (type !== 'futures') return [];

  let raw: FormSchema[] = [...tradeSchemasFut];
  if (mode === 'EDIT') {
    raw = raw.map((s) => {
      const fieldName = String(s.field);
      const rules = getFieldRules(fieldName, true);
      if (!rules) return s;
      return { ...s, rules: [...(s.rules || []), ...rules] };
    });
  }
  return raw;
};
