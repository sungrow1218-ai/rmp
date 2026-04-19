import { RequestParameterPaginationIDTO } from '../typing';

export type QueryAccountGroupParamsIDTO = {
  filterCondition?: {
    workGroupId?: number;
    accountGroupId?: number;
    accountGroupName?: string;
    bookType?: number;
    bookLevel?: number;
    createUserCode?: string;
  };
} & RequestParameterPaginationIDTO;

export interface QueryAccountGroupTypeIDTO {
  accountGroupId: number;
  accountGroupName: string;
  bookType: number;
  bookLevel: number;
  remark: string;
  workGroupId: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}

export type QueryAccountGroupDetailParamsIDTO = {
  filterCondition?: {
    accountGroupId?: number;
    accountCode?: string;
    accountName?: string;
  };
} & RequestParameterPaginationIDTO;

export interface AcctItemIDTO {
  accountCode: string;
  accountName: string;
  tradeSystemId: number;
  marketId: number;
}

export interface ReferenceItemIDTO {
  accountGroupId: number;
  accountGroupName: string;
  ruleId: number;
  status: number;
  ruleType: string;
  ruleName: string;
  approvalStatus: string;
  manageRuleType: number;
}

export type AlterAccountGroupDetailParamsIDTO = {
  modifyType: number;
  accountGroupId: number;
  accountList: {
    accountCode: string;
    accountName: string;
    tradeSystemId: number;
    marketId?: number;
  }[];
};
export type AlterAccountGroupDetailIDTO = {
  faultList?: {
    errorId: number;
    errorMessage: string;
    tradeSystemId: number;
    marketId: number;
    accountCode: string;
    accountName: string;
  }[];
};
