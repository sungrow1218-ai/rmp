import { AlterType } from '@/pages/dynamicDimension/const';
import { RequestParameterPagination } from '../typing';

export interface FilterCondition {
  dyndimId: number;
  dyndimName: string;
}

export interface ConditionParams {
  paramTag: string;
  paramValue: string;
}

export type QueryDynamicDimensionParams = RequestParameterPagination & {
  workGroupId?: number;
  authorityFlag?: 0 | 1;
  filterCondition?: FilterCondition;
};

// 查询维度筛选标的入参
export interface QueryDynDimDetailParams {
  pageId: number;
  pageSize: number;
  filterCondition?: {
    dyndimId: number;
    marketId?: number[];
    securityCode?: string;
  };
}

// 查询维度标的明细-结果
export interface QueryDynDimDetailDTO {
  dyndimId: number;
  dyndimName: string;
  marketId: number;
  securityCode: string;
  securityName: string;
  lastUpdateTime: string;
}

// 设置动态维度-入参
export interface AlterDynamicDimensionParam {
  modifyType: AlterType;
  dyndimId: number;
  dyndimName?: string;
  dyndimFormula?: string;
  dyndimConditionList?: {
    conditionCode: string;
    conditionOperation: number;
    conditionValue: string[];
    conditionOrderId: number;
  }[];
}
