import {
  AcctItem,
  AlterAccountGroupDetailParams,
  QueryAccountGroupDetailParams,
  QueryAccountGroupParams,
  ReferenceItem,
  ResponseAccountGroupItem,
} from '.';
import {
  AcctItemIDTO,
  AlterAccountGroupDetailIDTO,
  AlterAccountGroupDetailParamsIDTO,
  QueryAccountGroupDetailParamsIDTO,
  QueryAccountGroupParamsIDTO,
  QueryAccountGroupTypeIDTO,
  ReferenceItemIDTO,
} from './Idto';

export const parseQueryAccountGroupParams = (
  prev: QueryAccountGroupParams
): QueryAccountGroupParamsIDTO => {
  const data: QueryAccountGroupParamsIDTO = {
    pageId: prev.pageId ?? 1,
    pageSize: prev.pageSize ?? 1000,
    authorityFlag: prev.authFlag,
    filterCondition: prev.filterCondition
      ? {
          workGroupId: prev.filterCondition.workGroupId,
          accountGroupId: prev.filterCondition.acctGroupId,
          accountGroupName: prev.filterCondition.acctGroupName,
          bookType: prev.filterCondition.bookType,
          bookLevel: prev.filterCondition.bookLevel,
          createUserCode: prev.filterCondition.createUserCode,
        }
      : undefined,
  };
  return data;
};

export const parseQueryAccountGroupData = (
  prev: QueryAccountGroupTypeIDTO
): ResponseAccountGroupItem => {
  const data: ResponseAccountGroupItem = {
    createUserCode: prev.createUserCode,
    updateUserCode: prev.updateUserCode,
    createDateTime: prev.createDateTime,
    lastUpdateTime: prev.lastUpdateTime,
    createRoleId: prev.createRoleId,
    acctGroupId: prev.accountGroupId,
    acctGroupName: prev.accountGroupName,
    bookType: prev.bookType,
    bookLevel: prev.bookLevel,
    workGroupId: prev.workGroupId,
    acctGroupRemark: prev.remark,
    dynamicFlag: -1,
  };
  return data;
};

export const parseQueryAccountGroupDetailParams = (
  prev: QueryAccountGroupDetailParams
): QueryAccountGroupDetailParamsIDTO => {
  const data: QueryAccountGroupDetailParamsIDTO = {
    pageId: prev.pageId ?? 1,
    pageSize: prev.pageSize ?? 1000,
    filterCondition: prev.filterCondition
      ? {
          accountGroupId: prev.filterCondition.acctGroupId,
          accountName: prev.filterCondition.acctName,
          accountCode: prev.filterCondition.acctCode,
        }
      : undefined,
  };
  return data;
};

export const parseQueryAccountGroupDetail = (prev: AcctItemIDTO): AcctItem => {
  const data: AcctItem = {
    acctCode: prev.accountCode,
    acctName: prev.accountName,
    extSysId: prev.tradeSystemId,
    marketId: prev?.marketId,
  };
  return data;
};
export const parseReferenceByRiskRule = (
  prev: ReferenceItemIDTO
): ReferenceItem => {
  const data: ReferenceItem = {
    acctGroupId: prev.accountGroupId,
    acctGroupName: prev.accountGroupName,
    ruleId: prev.ruleId,
    status: prev.status,
    ruleType: prev.ruleType,
    ruleName: prev.ruleName,
    approvalStatus: prev.approvalStatus ?? '0',
    manageRuleType: prev.manageRuleType,
  };
  return data;
};

export const parseAlterAccountGroupDetailParams = (
  prev: AlterAccountGroupDetailParams
): AlterAccountGroupDetailParamsIDTO => {
  const data: AlterAccountGroupDetailParamsIDTO = {
    modifyType: prev.alterType,
    accountGroupId: prev.acctGroupId,
    accountList: prev?.acctList?.map((p) => ({
      accountCode: p.acctCode,
      accountName: p.acctName,
      marketId: p.marketId,
      tradeSystemId: p.extSysId,
    })),
  };
  return data;
};

export const parseAlterAccountGroupDetail = (
  prev: AlterAccountGroupDetailIDTO
): Recordable => {
  const data: Recordable = {
    faultList: (prev?.faultList ?? [])?.map((p) => ({
      errorId: p.errorId,
      errorInfo: p.errorMessage,
      extSysId: p.tradeSystemId,
      marketId: p.marketId,
      acctCode: p.accountCode,
      acctName: p.accountName,
    })),
  };
  return data;
};
