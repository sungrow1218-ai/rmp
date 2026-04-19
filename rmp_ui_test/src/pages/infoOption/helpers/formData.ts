// helpers/formData.ts
import type { FormActionType, FormSchema } from '@/components/Form';
import { parseDateToDayjs, formatDateToInt } from '../utils/date';
import type { DataType, FilledFieldsInfo } from '../types';
import { getFieldTypeInfo } from './schemaMeta';

export const recordInitialFilledFieldsInfo = (opts: {
  type: DataType;
  basicFormRef: React.RefObject<FormActionType>;
  tradeFormRef: React.RefObject<FormActionType>;
  basicSchemaList: FormSchema[];
  tradeSchemaList: FormSchema[];
}): FilledFieldsInfo => {
  const { type, basicFormRef, tradeFormRef, basicSchemaList, tradeSchemaList } =
    opts;

  const basicValues = (basicFormRef.current?.getFieldsValue?.() ||
    {}) as Record<string, any>;
  const tradeValues = (tradeFormRef.current?.getFieldsValue?.() ||
    {}) as Record<string, any>;
  const allValues = { ...basicValues, ...tradeValues };

  const fieldsInfo: FilledFieldsInfo = {};

  Object.entries(allValues).forEach(([fieldName, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const isTradeParam =
        type === 'options' &&
        Object.prototype.hasOwnProperty.call(tradeValues, fieldName);
      const schemaList = isTradeParam ? tradeSchemaList : basicSchemaList;
      const fieldType = getFieldTypeInfo(fieldName, schemaList);

      fieldsInfo[fieldName] = { value, type: fieldType };
    }
  });

  return fieldsInfo;
};

export const handleOptionsEditEcho = async (opts: {
  defaultValue: Recordable;
  fetchOptionKinds: (
    marketId: number,
    formRef: React.RefObject<FormActionType>
  ) => Promise<void>;
  basicFormRef: React.RefObject<FormActionType>;
  tradeFormRef: React.RefObject<FormActionType>;
  basicSchemasOpt: FormSchema[];
}) => {
  const {
    defaultValue,
    fetchOptionKinds,
    basicFormRef,
    tradeFormRef,
    basicSchemasOpt,
  } = opts;

  if (defaultValue.marketId) {
    await fetchOptionKinds(defaultValue.marketId, basicFormRef);
  }

  const basicData: Recordable = {
    informationSystemId: defaultValue.informationSystemId,
    securityCode: defaultValue.securityCode,
    securityName: defaultValue.securityName,
    marketId: defaultValue.marketId,
    securityType: defaultValue.securityType,
    tradeCurrencyCode: defaultValue.tradeCurrencyCode,
    optionType: defaultValue.optionType,
    optionKindCode: defaultValue.optionKindCode,
    underlyingSecurityCode: defaultValue.underlyingSecurityCode,
    underlyingMarketId: defaultValue.underlyingMarketId,
    exercisePrice: Number(defaultValue.exercisePrice),
  };

  const begin = defaultValue.exerciseBeginDate;
  const end = defaultValue.exerciseEndDate;

  if (begin || end) {
    const beginDayjs = parseDateToDayjs(begin);
    const endDayjs = parseDateToDayjs(end);

    const rangeField =
      (basicSchemasOpt || []).find((s) => s.field === 'exerciseDate')?.field ||
      (basicSchemasOpt || []).find(
        (s) =>
          String(s.field).toLowerCase().includes('exercise') &&
          String(s.field).toLowerCase().includes('range')
      )?.field;

    const hasBeginField = (basicSchemasOpt || []).some(
      (s) => s.field === 'exerciseBeginDate'
    );
    const hasEndField = (basicSchemasOpt || []).some(
      (s) => s.field === 'exerciseEndDate'
    );

    if (rangeField) {
      basicData[rangeField] = [beginDayjs, endDayjs];
    } else if (hasBeginField && hasEndField) {
      basicData.exerciseBeginDate = beginDayjs;
      basicData.exerciseEndDate = endDayjs;
    } else {
      basicData.exerciseDate = [beginDayjs, endDayjs];
    }
  }

  if (defaultValue.listDate)
    basicData.listDate = parseDateToDayjs(defaultValue.listDate);
  if (defaultValue.lastTradeDate)
    basicData.lastTradeDate = parseDateToDayjs(defaultValue.lastTradeDate);

  const tradeData: Recordable = {
    contractMultiplier: defaultValue.contractMultiplier,
    limitOrderAmountMin: defaultValue.limitOrderAmountMin,
    limitOrderAmountMax: defaultValue.limitOrderAmountMax,
    marketOrderAmountMin: defaultValue.marketOrderAmountMin,
    marketOrderAmountMax: defaultValue.marketOrderAmountMax,
  };

  basicFormRef.current?.setFieldsValue(basicData);
  tradeFormRef.current?.setFieldsValue(tradeData);
};

export const handleOptionsKindEditEcho = async (opts: {
  defaultValue: Recordable;
  fetchOptionKinds: (
    marketId: number,
    formRef: React.RefObject<FormActionType>
  ) => Promise<void>;
  basicFormRef: React.RefObject<FormActionType>;
  tradeFormRef: React.RefObject<FormActionType>;
}) => {
  const { defaultValue, fetchOptionKinds, basicFormRef, tradeFormRef } = opts;

  if (defaultValue.marketId) {
    await fetchOptionKinds(defaultValue.marketId, basicFormRef);
  }

  const basicData: Recordable = {
    informationSystemId: defaultValue.informationSystemId,
    marketId: defaultValue.marketId,
    optionKindCode: defaultValue.optionKindCode,
    optionKindName: defaultValue.optionKindName,
    underlyingSecurityCode:
      defaultValue.underlyingSecurityCode || defaultValue.underlyingKindCode,
    deliveryMethod: defaultValue.deliveryMethod,
  };

  basicFormRef.current?.setFieldsValue(basicData);
  tradeFormRef.current?.resetFields();
};

export const buildParams = (opts: {
  type: DataType;
  modeAlterType: 1 | 2;
  operatorCode?: string;
  basicData: Recordable;
  tradeData?: Recordable;
}): Recordable => {
  const { type, modeAlterType, operatorCode, basicData, tradeData } = opts;

  let exerciseBegin: number | undefined;
  let exerciseEnd: number | undefined;

  if (basicData.exerciseDate && Array.isArray(basicData.exerciseDate)) {
    exerciseBegin = formatDateToInt(basicData.exerciseDate[0]);
    exerciseEnd = formatDateToInt(basicData.exerciseDate[1]);
  }

  if (type === 'options') {
    return {
      modifyType: modeAlterType,
      operatorCode,

      informationSystemId: basicData.informationSystemId,
      marketId: basicData.marketId,
      securityCode: basicData.securityCode,
      securityName: basicData.securityName,
      securityType: basicData.securityType,
      tradeCurrencyCode: basicData.tradeCurrencyCode,

      optionType: basicData.optionType,
      optionKindCode: basicData.optionKindCode,

      underlyingSecurityCode: basicData.underlyingSecurityCode,
      underlyingMarketId: basicData.underlyingMarketId,

      exercisePrice: basicData.exercisePrice,
      exerciseBeginDate: exerciseBegin,
      exerciseEndDate: exerciseEnd,

      listDate: formatDateToInt(basicData.listDate),
      lastTradeDate: formatDateToInt(basicData.lastTradeDate),

      contractMultiplier: tradeData?.contractMultiplier,
      limitOrderAmountMin: tradeData?.limitOrderAmountMin,
      limitOrderAmountMax: tradeData?.limitOrderAmountMax,
      marketOrderAmountMin: tradeData?.marketOrderAmountMin,
      marketOrderAmountMax: tradeData?.marketOrderAmountMax,
    };
  }

  return {
    modifyType: modeAlterType,
    operatorCode,
    informationSystemId: basicData.informationSystemId,
    marketId: basicData.marketId,
    optionKindCode: basicData.optionKindCode,
    optionKindName: basicData.optionKindName,
    underlyingSecurityCode: basicData.underlyingSecurityCode,
    deliveryMethod: basicData.deliveryMethod,
  };
};
