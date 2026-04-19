import {
  AdjustPositionParams,
  PositionResultList,
  QueryPositionParams,
} from '.';
import {
  AdjustPositionParamsIDTO,
  PositionResultListIDTO,
  QueryPositionParamsIDTO,
} from './Idto';

export const parseQueryPositionParams = (
  prev: QueryPositionParams
): QueryPositionParamsIDTO => {
  const data: QueryPositionParamsIDTO = {
    pageId: prev.pageId ?? 1,
    pageSize: prev.pageSize ?? 1000,
    nodeId: prev.nodeId,
    filterCondition: prev.filterCondition
      ? {
          security: prev.filterCondition?.security,
          tradeSystemId: prev.filterCondition.extSysId,
          tradeAccountCode: prev.filterCondition?.tradeAcctCode, // 标记
          manageAccountCode: prev.filterCondition?.manageAcctCode, // 标记
        }
      : undefined,
  };
  return data;
};

export const parseQueryPosition = (
  prev: PositionResultListIDTO
): PositionResultList => {
  const data: PositionResultList = {
    key: prev.key ?? undefined,
    nodeId: prev.nodeId,
    extSysId: prev.tradeSystemId,
    tradeAcct: (prev.tradeAccount ?? [])?.map((p) => {
      return {
        extSysId: p.tradeSystemId,
        marketId: p.marketId,
        acctCode: p.accountCode,
        acctName: p.accountName,
        bookLevel: p.bookLevel,
      };
    }),
    manageAcct: (prev.manageAccount ?? [])?.map((p) => {
      return {
        extSysId: p.tradeSystemId,
        acctCode: p.accountCode,
        acctName: p.accountName,
        bookLevel: p.bookLevel,
      };
    }),
    marketId: prev.marketId,
    securityCode: prev.securityCode,
    positionType: prev.positionType,
    beginAmount: prev.beginAmount,
    currentAmount: prev.currentAmount,
    beginImpawnAmount: prev.beginImpawnAmount,
    currentImpawnAmount: prev.currentImpawnAmount,
  };

  return data;
};

export const parseAdjustPositionParams = (
  prev: AdjustPositionParams
): AdjustPositionParamsIDTO => {
  const data: AdjustPositionParamsIDTO = {
    nodeId: prev.nodeId,
    tradeSystemId: prev.extSysId,
    marketId: prev.marketId,
    securityCode: prev.securityCode,
    baseTradeAccount: prev.baseTradeAcct,
    baseManageAccount: prev.baseManageAcct,
    positionType: prev.positionType,
    adjustType: prev.adjustType,
    adjustBeforeAmount: prev.adjustBeforeAmount,
    adjustAfterAmount: prev.adjustAfterAmount,
  };
  return data;
};
