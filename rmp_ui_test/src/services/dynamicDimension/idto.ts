import { AlterType } from '@/pages/dynamicDimension/const';
import { RequestParameterPagination } from '../typing';

export interface IFilterCondition {
  securityDimensionId: number;
  securityDimensionName: string;
}

export interface IDynamicDimCondition {
  conditionCode: string;
  conditionName: string;
  conditionClassCode: number;
  conditionClassName: string;
  conditionValue: string[];
  conditionValueSource: number;
  conditionValueUnit: number;
  conditionOperation: number;
  conditionOperationType: number;
  conditionOrderId: number;
}

export type QueryDynamicDimensionIParams = RequestParameterPagination & {
  workGroupId?: number;
  authorityFlag?: number;
  filterCondition?: Partial<IFilterCondition>;
};

export interface DynamicDimIDTO {
  securityDimensionId: number;
  securityDimensionName: string;
  securityDimensionFormula: string;
  systemFlag: number;
  secuDimConditionList: IDynamicDimCondition[];
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

// 查询维度筛选标的入参
export interface QueryDynDimDetailIParams {
  pageId: number;
  pageSize: number;
  filterCondition?: {
    securityDimensionId: number;
    marketId?: number[];
    securityCode?: string;
  };
}

// 查询维度标的明细-结果
export interface QueryDynDimDetailIDTO {
  securityDimensionId: number;
  securityDimensionName: string;
  marketId: number;
  securityCode: string;
  securityName: string;
  lastUpdateTime: string;
}

// 动态维度条件
export interface DynamicDimConditionItemIDTO {
  conditionCode: string;
  conditionName: string;
  conditionClassCode: number;
  conditionClassName: string;
  conditionValueSource: number;
  conditionValueUnit: number;
  conditionOperationType: number;
}

// 校验动态维度-参数
export type VerifyDynamicDimensionIParam = RequestParameterPagination & {
  securityDimensionFormula: string;
  secuDimConditionList: {
    conditionCode: string;
    conditionOperation: number;
    conditionValue: string[];
    conditionOrderId: number;
  }[];
  filterCondition?: { securityCode: string };
};

// 设置动态维度-参数
export interface AlterDynamicDimensionIParam {
  modifyType: AlterType;
  securityDimensionId: number;
  securityDimensionName?: string;
  securityDimensionFormula?: string;
  secuDimConditionList?: {
    conditionCode: string;
    conditionOperation: number;
    conditionValue: string[];
    conditionOrderId: number;
  }[];
}
