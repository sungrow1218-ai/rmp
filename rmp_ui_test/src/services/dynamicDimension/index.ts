import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import { RequestParameterPagination } from '../typing';
import {
  DynamicDim,
  DynamicDimConditionItem,
} from '@/pages/dynamicDimension/const';
import {
  parseAlterDynamicDimensionIParam,
  parseQueryDynamicDimensionParams,
  parseQueryDynamicDimensionRsp,
  parseQueryDynDimConditionRsp,
  parseQueryDynDimDetailParams,
  parseQueryDynDimDetailRsp,
} from './parse';
import {
  AlterDynamicDimensionParam,
  QueryDynamicDimensionParams,
  QueryDynDimDetailDTO,
  QueryDynDimDetailParams,
} from './dto';
import {
  DynamicDimConditionItemIDTO,
  DynamicDimIDTO,
  QueryDynDimDetailIDTO,
  VerifyDynamicDimensionIParam,
} from './idto';

// 查询动态纬度列表
export const queryDynamicDimension = (params: QueryDynamicDimensionParams) =>
  parseRequestByPage<DynamicDimIDTO, DynamicDim>(
    request(`/aegis/api/ruleManager/querySecurityDimension`, {
      method: 'POST',
      data: parseQueryDynamicDimensionParams(params),
    }),
    parseQueryDynamicDimensionRsp
  );

// 查询维度筛选出的标的
export const queryDynDimDetail = (params: QueryDynDimDetailParams) =>
  parseRequestByPage<QueryDynDimDetailIDTO, QueryDynDimDetailDTO>(
    request(`/aegis/api/ruleManager/querySecurityDimensionDetail `, {
      method: 'POST',
      data: parseQueryDynDimDetailParams(params),
    }),
    parseQueryDynDimDetailRsp
  );

// 查询查询动态维度条件
export const queryDynDimCondition = (params: RequestParameterPagination) =>
  parseRequestByPage<DynamicDimConditionItemIDTO, DynamicDimConditionItem>(
    request(`/aegis/api/ruleManager/querySecurityDimensionCondition `, {
      method: 'POST',
      data: params,
    }),
    parseQueryDynDimConditionRsp
  );

// 查询动态维度条件可选项
export const queryConditionItem = (
  data: RequestParameterPagination & {
    filterCondition: {
      conditionCode: string;
    };
  }
) =>
  parseRequestByPage<{ itemName: string; itemValue: string }>(
    request(`/aegis/api/ruleManager/querySecurityConditionItem`, {
      method: 'POST',
      data,
    })
  );

// 导出动态维度证券明细
export const exportDynamicDimSecurity = (data: {
  securityDimensionId: number;
}) =>
  parseRequest<{ errorId: number; errorMessage: string; fileUrl: string }>(
    request(`/aegis/api/ruleManager/exportSecurityDimensionSecurity `, {
      method: 'POST',
      data,
    })
  );

// 校验动态维度
export const verifyDynamicDimension = (data: VerifyDynamicDimensionIParam) =>
  parseRequestByPage<{
    securityCode: string;
    securityName: string;
    marketId: number;
  }>(
    request(`/aegis/api/ruleManager/verifySecurityDimension`, {
      method: 'POST',
      data,
    })
  );

// 保存动态维度
export const alterDynamicDimension = (data: AlterDynamicDimensionParam) =>
  parseRequest(
    request(`/aegis/api/ruleManager/modifySecurityDimension`, {
      method: 'POST',
      data: parseAlterDynamicDimensionIParam(data),
    })
  );
