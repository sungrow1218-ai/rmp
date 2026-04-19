// helpers/formData.ts
import dayjs from 'dayjs';
import type { FormActionType } from '@/components/Form';
import { parseDateToDayjs, toYYYYMMDD } from '../utils/date';
import type { DataType, FilledFieldsInfo } from '../types';
import { getFieldTypeInfo, getSchemaListByType } from './schemaMeta';
import { tradeSchemasFut } from '../futuresData';

export const getKeyFieldsByType = (dataType: DataType): string[] => {
  switch (dataType) {
    case 'futures':
      return ['securityCode', 'marketId', 'futuresKindCode'];
    case 'futuresKind':
      return ['marketId', 'futuresKindCode', 'futuresKindName'];
    case 'contract':
      return [
        'marketId',
        'securityCode',
        'firstSecurityCode',
        'secondSecurityCode',
      ];
    default:
      return [];
  }
};

export const setFuturesFormData = (
  basicFormRef: React.RefObject<FormActionType>,
  tradeFormRef: React.RefObject<FormActionType>,
  data: any
) => {
  const basicData: Recordable = {
    informationSystemId: data.informationSystemId,
    securityCode: data.securityCode,
    securityName: data.securityName,
    marketId: data.marketId,
    futuresKindCode: data.futuresKindCode,
    tradeCurrencyCode: data.tradeCurrencyCode,
    securityType: data.securityType,
    contractMonth: data.contractMonth
      ? parseDateToDayjs(data.contractMonth)
      : null,
    listDate: data.listDate ? parseDateToDayjs(data.listDate) : null,
    lastTradeDate: data.lastTradeDate
      ? parseDateToDayjs(data.lastTradeDate)
      : null,
    lastDeliveryDate: data.lastDeliveryDate
      ? parseDateToDayjs(data.lastDeliveryDate)
      : null,
  };

  const tradeData: Recordable = {
    contractMultiplier: data.contractMultiplier,
    marketPositionAmount: data.marketPositionAmount,
    preMarketPosiAmount: data.preMarketPosiAmount,
    limitOrderAmountMin: data.limitOrderAmountMin,
    limitOrderAmountMax: data.limitOrderAmountMax,
    marketOrderAmountMin: data.marketOrderAmountMin,
    marketOrderAmountMax: data.marketOrderAmountMax,
  };

  basicFormRef.current?.setFieldsValue(basicData);
  tradeFormRef.current?.setFieldsValue(tradeData);
};

export const setFuturesKindFormData = (
  basicFormRef: React.RefObject<FormActionType>,
  tradeFormRef: React.RefObject<FormActionType>,
  data: any
) => {
  const basicData: Recordable = {
    informationSystemId: data.informationSystemId,
    marketId: data.marketId,
    futuresKindCode: data.futuresKindCode,
    futuresKindName: data.futuresKindName,
    deliveryMethod: data.deliveryMethod,
  };

  basicFormRef.current?.setFieldsValue(basicData);
  tradeFormRef.current?.resetFields();
};

export const setContractFormData = (
  basicFormRef: React.RefObject<FormActionType>,
  tradeFormRef: React.RefObject<FormActionType>,
  data: any
) => {
  const basicData: Recordable = {
    informationSystemId: data.informationSystemId,
    marketId: data.marketId,
    securityCode: data.securityCode,
    securityName: data.securityName,
    firstSecurityCode: data.firstSecurityCode ? data.firstSecurityCode : null,
    secondSecurityCode: data.secondSecurityCode
      ? data.secondSecurityCode
      : null,
    arbitrageType: data.arbitrageType ? data.arbitrageType : null,
    listDate: data.listDate ? parseDateToDayjs(data.listDate) : null,
    lastTradeDate: data.lastTradeDate
      ? parseDateToDayjs(data.lastTradeDate)
      : null,
    effectiveDate: data.effectiveDate
      ? parseDateToDayjs(data.effectiveDate)
      : null,
    expireDate: data.expireDate ? parseDateToDayjs(data.expireDate) : null,
  };

  basicFormRef.current?.setFieldsValue(basicData);
  tradeFormRef.current?.resetFields();
};

export const setFormDataByType = (
  dataType: DataType,
  refs: {
    basicFormRef: React.RefObject<FormActionType>;
    tradeFormRef: React.RefObject<FormActionType>;
  },
  data: any
) => {
  const { basicFormRef, tradeFormRef } = refs;

  if (dataType === 'futures')
    setFuturesFormData(basicFormRef, tradeFormRef, data);
  else if (dataType === 'futuresKind')
    setFuturesKindFormData(basicFormRef, tradeFormRef, data);
  else if (dataType === 'contract')
    setContractFormData(basicFormRef, tradeFormRef, data);
};

export const recordInitialFilledFieldsInfo = (
  dataType: DataType,
  basicFormRef: React.RefObject<FormActionType>,
  tradeFormRef: React.RefObject<FormActionType>
): FilledFieldsInfo => {
  const basicValues = (basicFormRef.current?.getFieldsValue?.() ||
    {}) as Record<string, any>;
  const tradeValues = (tradeFormRef.current?.getFieldsValue?.() ||
    {}) as Record<string, any>;
  const allValues = { ...basicValues, ...tradeValues };

  const fieldsInfo: FilledFieldsInfo = {};
  const basicSchemaList = getSchemaListByType(dataType, false);
  const tradeSchemaList = tradeSchemasFut;

  Object.entries(allValues).forEach(([fieldName, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const isTradeParam = Object.prototype.hasOwnProperty.call(
        tradeValues,
        fieldName
      );
      const schemaList = isTradeParam ? tradeSchemaList : basicSchemaList;
      const fieldType = getFieldTypeInfo(fieldName, schemaList);

      fieldsInfo[fieldName] = { value, type: fieldType };
    }
  });

  return fieldsInfo;
};

export const buildParams = (opts: {
  type: DataType;
  modeAlterType: 1 | 2;
  basicData: Recordable;
  tradeData?: Recordable;
  operatorCode?: string;
}): Recordable => {
  const { type, modeAlterType, basicData, tradeData, operatorCode } = opts;

  const params: Recordable = { ...basicData };
  if (type === 'futures' && tradeData) Object.assign(params, tradeData);
  if (operatorCode) params.operatorCode = operatorCode;

  const dateFields =
    type === 'futures'
      ? ['listDate', 'lastTradeDate', 'lastDeliveryDate', 'contractMonth']
      : type === 'futuresKind'
      ? ['listDate', 'lastTradeDate']
      : ['listDate', 'lastTradeDate', 'effectiveDate', 'expireDate'];

  dateFields.forEach((f) => {
    if (f === 'contractMonth') {
      if (params[f]) {
        if (typeof params[f] === 'string') {
          const d = dayjs(params[f]);
          if (d.isValid()) params[f] = Number(d.format('YYYYMM'));
          else {
            const numValue = Number(params[f]);
            if (!isNaN(numValue)) params[f] = numValue;
          }
        } else if (dayjs.isDayjs(params[f])) {
          params[f] = Number(params[f].format('YYYYMM'));
        } else if (typeof params[f] === 'number') {
          // keep
        }
      }
    } else {
      params[f] = toYYYYMMDD(params[f]);
    }
  });

  params.modifyType = modeAlterType;
  return params;
};
