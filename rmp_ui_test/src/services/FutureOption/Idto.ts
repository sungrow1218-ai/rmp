import { RequestParameterPaginationIDTO } from '../typing';

// 分组查询
export type FutureGroupParamsIDTO = {
  filterCondition?: {
    limitGroupId?: number;
    limitGroupName?: string;
  };
} & RequestParameterPaginationIDTO;

export type GroupListIDTO = {
  limitGroupId: number;
  limitGroupName: string;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
  createRoleId: number;
};

//  明细查询
export interface FutureOptionListIDTO {
  limitGroupId: number;
  limitType: number;
  futuOptLimitId: number;
  futuOptKindCode: string;
  marketId: number;
  limitParamType: number;
  contractMonth: number;
  beginDateType: number;
  beginAffectDirection: number;
  beginDaysOffset: number;
  beginMonthOffset: number;
  endDateType: number;
  endAffectDirection: number;
  endDaysOffset: number;
  endMonthOffset: number;
  limitControlType: number;
  setValue: number;
  compareDirection: number;
  positionAmount: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

// 明细查询入参

export type LimitList =
  | {
      limitGroupId: number;
      limitType: number;
      futuOptLimitId: number;
      futuOptKindCode: string;
      marketId: number;
      limitParamType: number;
      contractMonth: number;
      beginDateType: number;
      beginAffectDirection: number;
      beginDaysOffset: number;
      beginMonthOffset: number;
      endDateType: number;
      endAffectDirection: number;
      endDaysOffset: number;
      endMonthOffset: number;
      limitControlType: number;
      setValue: number;
      compareDirection: number;
      positionAmount: number;
    }
  | { futuOptLimitId: number; limitGroupId: number };
export interface FutureOptionListSetIDTO {
  modifyType: number;
  terminalInfo?: string;
  limitList: LimitList[];
}

export type ResultListIDTO = {
  futuresKindCode: string;
  marketId: number;
  futuresKindName: string;
};
export type ResultListOptionsIDTO = {
  optionKindCode: string;
  marketId: number;
  optionKindName: string;
};
