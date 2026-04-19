import request from '@/utils/request';
import {
  CommonResponseWrapper,
  RequestParameterPagination,
  ResponseParameterPagination,
} from './typing';
import {
  AlterType,
  DynamicDim,
  DynamicDimCondition,
  DynamicDimConditionItem,
} from '@/pages/dynamicDimension/const';

interface ConditionParams {
  paramTag: string;
  paramValue: string;
}

interface FilterCondition {
  dyndimId: number;
  dyndimName: string;
}

// 查询动态纬度集合
export const queryDynamicDimensionOld = (
  data: RequestParameterPagination & {
    workGroupId?: number;
    authFlag?: 0 | 1;
    filterCondition?: FilterCondition;
  }
) =>
  request<CommonResponseWrapper<{ resultList: DynamicDim[] }>>(
    `/api/ruleManager/queryDynamicDimensionOld`,
    { method: 'POST', data }
  );

// 查询维度筛选出的标的
export const queryDynDimDetailOld = (
  data: RequestParameterPagination & {
    conditionList: ConditionParams[];
  }
) => request(`/api/ruleManager/queryDynDimDetailOld`, { method: 'POST', data });

// 查询查询动态维度条件
export const queryDynDimConditionOld = (
  data: RequestParameterPagination & {
    conditionList?: ConditionParams[];
  }
) =>
  request<
    CommonResponseWrapper<
      { resultList: DynamicDimConditionItem[] } & ResponseParameterPagination
    >
  >(`/api/ruleManager/queryDynDimCondition`, { method: 'POST', data });

// 查询动态维度条件可选项
export const queryConditionItemOld = (
  data: RequestParameterPagination & {
    filterCondition: Pick<
      DynamicDimCondition,
      'conditionCode' | 'conditionValueType'
    >;
  }
) => request(`/api/ruleManager/queryCondtionItem`, { method: 'POST', data });

// 导出动态维度证券明细
export const exportDynamicDimSecurityOld = (data: { dyndimId: number }) =>
  request(`/api/ruleManager/exportDynamicDimSecurityOld `, {
    method: 'POST',
    data,
  });

// 校验动态维度
export const verifyDynamicDimensionOld = (
  data: RequestParameterPagination & {
    conditionList: ConditionParams[];
  }
) =>
  request(`/api/ruleManager/verifyDynamicDimensionOld`, {
    method: 'POST',
    data,
  });

// 保存动态维度
export const alterDynamicDimensionOld = (
  data: Partial<DynamicDim & { alterType: AlterType; workGroupId: number }>
) =>
  request<CommonResponseWrapper<Recordable>>(
    `/api/ruleManager/alterDynamicDimensionOld`,
    { method: 'POST', data }
  );
