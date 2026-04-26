import {
  ExtSysItem,
  ManageAcctDTO,
  QueryManageAcctParams,
  QueryTradeAccountParamType,
  TradeAcctDTO,
} from '.';
import {
  ExtSysItemIDTO,
  ManageAcctIDTO,
  QueryManageAcctParamsIDTO,
  QueryTradeAccountParamTypeIDTO,
  TradeAcctIDTO,
} from './Idto';

// 查询交易账户入参
export const parseQueryTradeAccountParam = (
  prev: QueryTradeAccountParamType
): QueryTradeAccountParamTypeIDTO => {
  const data: QueryTradeAccountParamTypeIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    authorityFlag: prev.authFlag,
    filterCondition: {
      sobId: prev?.filterCondition?.sobId,
      bookLevel: prev?.filterCondition?.bookLevel,
      accountCode: prev?.filterCondition?.acctCode,
      accountName: prev?.filterCondition?.acctName,
      marketId: prev?.filterCondition?.marketId,
      parentAccountCode: prev?.filterCondition?.parentAcctCode,
      tradeSystemId: prev?.filterCondition?.extSysId,
    },
  };
  return data;
};
export const parseQueryTradeAccountData = (
  prev: TradeAcctIDTO
): TradeAcctDTO => {
  const data: TradeAcctDTO = {
    bookLevel: prev?.bookLevel,
    acctCode: prev?.accountCode,
    acctName: prev?.accountName,
    marketId: prev?.marketId,
    parentAcctCode: prev?.parentAccountCode,
    extSysId: prev?.tradeSystemId,
    lastUpdateTime: prev?.lastUpdateTime,
  };
  return data;
};

export const parseQueryManageAccountParam = (
  prev: QueryManageAcctParams
): QueryManageAcctParamsIDTO => {
  const data: QueryManageAcctParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    authorityFlag: prev.authFlag,
    filterCondition: {
      sobId: prev?.filterCondition?.sobId,
      bookLevel: prev?.filterCondition?.bookLevel,
      accountCode: prev?.filterCondition?.acctCode,
      accountName: prev?.filterCondition?.acctName,
      parentAccountCode: prev?.filterCondition?.parentAcctCode,
      tradeSystemId: prev?.filterCondition?.extSysId,
    },
  };
  return data;
};
export const parseQueryManageAccountData = (
  prev: ManageAcctIDTO
): ManageAcctDTO => {
  const data: ManageAcctDTO = {
    bookLevel: prev?.bookLevel,
    acctCode: prev?.accountCode,
    acctName: prev?.accountName,
    parentAcctCode: prev?.parentAccountCode,
    extSysId: prev?.tradeSystemId,
    lastUpdateTime: prev?.lastUpdateTime,
  };
  return data;
};
// 交易系统出参
export const parseQueryExternSystemData = (
  prev: ExtSysItemIDTO
): ExtSysItem => {
  const data: ExtSysItem = {
    sobId: prev?.sobId,
    extSysName: prev?.tradeSystemName,
    extSysId: prev?.tradeSystemId,
    lastUpdateTime: prev?.lastUpdateTime,
  };
  return data;
};