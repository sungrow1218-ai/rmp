import {
  DynamicDim,
  DynamicDimConditionItem,
} from '@/pages/dynamicDimension/const';
import {
  AlterDynamicDimensionParam,
  QueryDynamicDimensionParams,
  QueryDynDimDetailDTO,
  QueryDynDimDetailParams,
} from './dto';
import {
  AlterDynamicDimensionIParam,
  DynamicDimConditionItemIDTO,
  DynamicDimIDTO,
  QueryDynamicDimensionIParams,
  QueryDynDimDetailIDTO,
  QueryDynDimDetailIParams,
} from './idto';

// 查询动态维度-参数
export const parseQueryDynamicDimensionParams = (
  param: QueryDynamicDimensionParams
): QueryDynamicDimensionIParams => {
  const data: QueryDynamicDimensionIParams = {
    pageId: param.pageId,
    pageSize: param.pageSize,
    authorityFlag: param.authorityFlag,
    filterCondition: param.filterCondition
      ? {
          securityDimensionId: param.filterCondition.dyndimId,
          securityDimensionName: param.filterCondition.dyndimName,
        }
      : undefined,
  };
  return data;
};

// 查询动态维度-结果
export const parseQueryDynamicDimensionRsp = (
  idata: DynamicDimIDTO
): DynamicDim => {
  const data: DynamicDim = {
    dyndimId: idata.securityDimensionId,
    dyndimName: idata.securityDimensionName,
    dyndimFormula: idata.securityDimensionFormula,
    systemFlag: idata.systemFlag,
    dyndimConditionList: (idata.secuDimConditionList || []).map((i) => ({
      conditionCode: i.conditionCode,
      conditionName: i.conditionName,
      conditionType: i.conditionClassCode,
      conditionTypeName: i.conditionClassName,
      conditionValueType: i.conditionValueSource,
      conditionValue: i.conditionValue,
      conditionValueUnit: i.conditionValueUnit,
      conditionOperation: i.conditionOperation,
      conditionOperationType: i.conditionOperationType,
      conditionOrderId: i.conditionOrderId,
    })),
    createRoleId: idata.createRoleId,
    createUserNo: idata.createUserCode,
    updateUserNo: idata.updateUserCode,
    lastUpdateTime: idata.lastUpdateTime,
    createDateTime: idata.createTime,
  };
  return data;
};

// 查询动态维度标的明细-入参
export const parseQueryDynDimDetailParams = (
  param: QueryDynDimDetailParams
): QueryDynDimDetailIParams => {
  const data: QueryDynDimDetailIParams = {
    pageId: param.pageId,
    pageSize: param.pageSize,
    filterCondition: param.filterCondition
      ? {
          securityDimensionId: param.filterCondition.dyndimId,
          marketId: param.filterCondition.marketId,
          securityCode: param.filterCondition.securityCode,
        }
      : undefined,
  };
  return data;
};

// 查询动态维度标的明细-结果
export const parseQueryDynDimDetailRsp = (
  idata: QueryDynDimDetailIDTO
): QueryDynDimDetailDTO => {
  const data: QueryDynDimDetailDTO = {
    dyndimId: idata.securityDimensionId,
    dyndimName: idata.securityDimensionName,
    marketId: idata.marketId,
    securityCode: idata.securityCode,
    securityName: idata.securityName,
    lastUpdateTime: idata.lastUpdateTime,
  };
  return data;
};

// 查询动态维度条件-结果
export const parseQueryDynDimConditionRsp = (
  idata: DynamicDimConditionItemIDTO
): DynamicDimConditionItem => {
  const data: DynamicDimConditionItem = {
    conditionCode: idata.conditionCode,
    conditionName: idata.conditionName,
    conditionType: idata.conditionClassCode,
    conditionTypeName: idata.conditionClassName,
    conditionValueType: idata.conditionValueSource,
    conditionValueUnit: idata.conditionValueUnit,
    conditionOperationType: idata.conditionOperationType,
  };
  return data;
};

// 设置动态维度-入参
export const parseAlterDynamicDimensionIParam = (
  param: AlterDynamicDimensionParam
): AlterDynamicDimensionIParam => {
  const data: AlterDynamicDimensionIParam = {
    modifyType: param.modifyType,
    securityDimensionId: param.dyndimId,
    securityDimensionName: param.dyndimName,
    securityDimensionFormula: param.dyndimFormula,
    secuDimConditionList: (param.dyndimConditionList || []).map((i) => ({
      conditionCode: i.conditionCode,
      conditionOperation: i.conditionOperation,
      conditionValue: i.conditionValue,
      conditionOrderId: i.conditionOrderId,
    })),
  };
  return data;
};
