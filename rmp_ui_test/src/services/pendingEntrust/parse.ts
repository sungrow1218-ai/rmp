import { QueryEntrustParams, ResultList, RevokeEntrustParams } from '.';
import { DeletePendingEntrustParams } from '../pendingEntrust';
import {
  DeletePendingEntrustParamsIDTO,
  QueryEntrustParamsIDTO,
  ResultListIDTO,
  RevokeEntrustParamsIDTO,
} from './Idto';

export const parseQueryEntrustParams = (
  prev: QueryEntrustParams
): QueryEntrustParamsIDTO => {
  const data: QueryEntrustParamsIDTO = {
    pageId: prev.pageId ?? 1,
    pageSize: prev.pageSize ?? 1000,
    nodeId: prev.nodeId,
    primaryFlag: prev.primaryFlag,
    filterCondition: prev.filterCondition
      ? {
          tradeSystemId: prev.filterCondition.extSysId ?? undefined, // 标记
          entrustCode: prev.filterCondition.entrustCode ?? undefined,
          marketId: prev.filterCondition.marketId ?? undefined,
          security: prev.filterCondition.security ?? undefined,
          entrustDirection: prev.filterCondition.entrustDirection,
          entrustStatus: prev.filterCondition.entrustStatus,
          tradeAccountCode: prev.filterCondition.tradeAcctCode, // 标记
          manageAccountCode: prev.filterCondition.manageAcctCode, // 标记
          timeSegment: prev.filterCondition.timeSeg,
        }
      : undefined,
  };
  return data;
};
export const parsePendingEntrustData = (prev: ResultListIDTO): ResultList => {
  const data: ResultList = {
    key: prev.key,
    entrustDate: prev.entrustDate,
    entrustTime: prev.entrustTime,
    extSysId: prev.tradeSystemId,
    extSubsysId: prev.subTradeSysId, // 标识
    entrustCode: prev.entrustCode,
    manageAcct: prev.manageAccount,
    tradeAcct: prev.tradeAccount,
    seatCode: prev.seatCode,
    marketId: prev.marketId,
    securityCode: prev.securityCode,
    entrustDirection: prev.entrustDirection,
    entrustStatus: prev.entrustStatus,
    priceType: prev.priceType,
    entrustPrice: prev.entrustPrice,
    entrustAmount: prev.entrustAmount,
    dealAmount: prev.dealAmount,
    withdrawAmount: prev.withdrawAmount,
    businessType: prev.businessType,
  };

  return data;
};

export const parseDeletePendingEntrustParams = (
  prev: DeletePendingEntrustParams
): DeletePendingEntrustParamsIDTO => {
  const data: DeletePendingEntrustParamsIDTO = {
    nodeId: prev.nodeId,
    filterCondition: prev.filterCondition
      ? {
          tradeSystemId: prev.filterCondition.extSysId ?? undefined, // 标记
          entrustCode: prev.filterCondition.entrustCode ?? undefined,
          marketId: prev.filterCondition.marketId ?? undefined,
          security: prev.filterCondition.security ?? undefined,
          entrustDirection: prev.filterCondition.entrustDirection,
          entrustStatus: prev.filterCondition.entrustStatus,
          tradeAccountCode: prev.filterCondition.tradeAcctCode, // 标记
          manageAccountCode: prev.filterCondition.manageAcctCode, // 标记
          timeSegment: prev.filterCondition.timeSeg,
        }
      : undefined,
  };
  return data;
};
export const parseRevokeEntrustParamsIDTO = (
  prev: RevokeEntrustParams
): RevokeEntrustParamsIDTO => {
  const data: RevokeEntrustParamsIDTO = {
    nodeId: prev.nodeId,
    entrustList: prev.entrustList.map((item) => {
      return {
        tradeSystemId: item.extSysId,
        subTradeSysId: item.extSubSysId,
        entrustCode: item.entrustCode,
      };
    }),
  };
  return data;
};
