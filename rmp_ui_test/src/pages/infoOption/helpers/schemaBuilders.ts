// helpers/schemaBuilders.ts
import type { FormSchema } from '@/components/Form';
import {
  patchSchema,
  setFieldsReadonly,
  normalizeSchemaWidthForSingleColumn,
} from '../utils/schemaPatch';
import { createFieldValidationRule } from './validation';
import type { DataType, FilledFieldsInfo } from '../types';

/**
 * 构建 getFieldRules：编辑态 + 初始已填字段（非必填、非 string）不可清空
 */
export const buildGetFieldRules = (opts: {
  modeIsEdit: boolean;
  type: DataType;
  initialFilledFieldsInfo: FilledFieldsInfo;
  basicSchemasOpt: FormSchema[];
  tradeSchemasOpt: FormSchema[];
  basicSchemasOptionKind: FormSchema[];
}) => {
  const {
    modeIsEdit,
    type,
    initialFilledFieldsInfo,
    basicSchemasOpt,
    tradeSchemasOpt,
    basicSchemasOptionKind,
  } = opts;

  return (
    fieldName: string,
    isTradeParam = false
  ): FormSchema['rules'] | undefined => {
    if (!modeIsEdit) return undefined;

    const fieldInfo = initialFilledFieldsInfo[fieldName];
    if (!fieldInfo) return undefined;

    let schemaList: FormSchema[];
    if (isTradeParam) schemaList = tradeSchemasOpt;
    else if (type === 'optionsKind') schemaList = basicSchemasOptionKind;
    else schemaList = basicSchemasOpt;

    const fieldSchema = schemaList.find((s) => s.field === fieldName);
    const placeholder = fieldSchema?.componentProps?.placeholder as
      | string
      | undefined;

    // 必填字段不重复加“不可清空”
    const isRequired =
      fieldSchema?.required === true ||
      (Array.isArray(fieldSchema?.rules) &&
        fieldSchema.rules.some((rule: any) => rule?.required === true));

    if (isRequired) return undefined;
    if (fieldInfo.type === 'string') return undefined;

    return createFieldValidationRule(
      fieldName,
      fieldInfo,
      schemaList,
      placeholder
    );
  };
};

export const buildBasicSchemas = (opts: {
  type: DataType;
  modeIsEdit: boolean;
  isSingleColumn: boolean;
  optionKindLoading: boolean;
  optionKindOptions: any[];
  basicSchemasOpt: FormSchema[];
  basicSchemasOptionKind: FormSchema[];
  getFieldRules: (
    fieldName: string,
    isTradeParam?: boolean
  ) => FormSchema['rules'] | undefined;
}): FormSchema[] => {
  const {
    type,
    modeIsEdit,
    isSingleColumn,
    optionKindLoading,
    optionKindOptions,
    basicSchemasOpt,
    basicSchemasOptionKind,
    getFieldRules,
  } = opts;

  if (type === 'options') {
    let raw: FormSchema[] = [...(basicSchemasOpt || [])];

    raw = raw.map((s) => {
      if (s.field !== 'optionKindCode') return s;
      return patchSchema(s, {
        allowClear: true,
        loading: optionKindLoading,
        options: optionKindOptions,
      });
    });

    if (modeIsEdit) {
      raw = setFieldsReadonly(raw, ['securityCode', 'marketId']);
      raw = raw.map((s) => {
        const rules = getFieldRules(String(s.field), false);
        if (!rules) return s;
        return { ...s, rules: [...(s.rules || []), ...rules] };
      });
    }

    return raw;
  }

  if (type === 'optionsKind') {
    let raw: FormSchema[] = [...(basicSchemasOptionKind || [])];

    if (modeIsEdit) {
      raw = setFieldsReadonly(raw, ['marketId', 'optionKindCode']);
      raw = raw.map((s) => {
        const rules = getFieldRules(String(s.field), false);
        if (!rules) return s;
        return { ...s, rules: [...(s.rules || []), ...rules] };
      });
    }

    return normalizeSchemaWidthForSingleColumn(raw, isSingleColumn);
  }

  return [];
};

export const buildTradeSchemas = (opts: {
  type: DataType;
  modeIsEdit: boolean;
  tradeSchemasOpt: FormSchema[];
  getFieldRules: (
    fieldName: string,
    isTradeParam?: boolean
  ) => FormSchema['rules'] | undefined;
}): FormSchema[] => {
  const { type, modeIsEdit, tradeSchemasOpt, getFieldRules } = opts;
  if (type !== 'options') return [];

  let raw: FormSchema[] = [...(tradeSchemasOpt || [])];

  if (modeIsEdit) {
    raw = raw.map((s) => {
      const rules = getFieldRules(String(s.field), true);
      if (!rules) return s;
      return { ...s, rules: [...(s.rules || []), ...rules] };
    });
  }

  return raw;
};
