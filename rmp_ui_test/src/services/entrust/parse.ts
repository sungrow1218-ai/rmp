import { QueryEntrustParams, ResultList } from '.';
import { QueryEntrustParamsIDTO, ResultListIDTO } from './Idto';

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
          entrustType: prev.filterCondition.entrustType,
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
export const parseQueryEntrustData = (prev: ResultListIDTO): ResultList => {
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
    entrustType: prev.entrustType,
    entrustDirection: prev.entrustDirection,
    entrustStatus: prev.entrustStatus,
    priceType: prev.priceType,
    entrustPrice: prev.entrustPrice,
    entrustAmount: prev.entrustAmount,
    dealAmount: prev.dealAmount,
    withdrawAmount: prev.withdrawAmount,
    investType: prev.investType,
    tradePlatformId: prev.tradePlatformId,
    businessType: prev.businessType,
  };
  console.log('====================================');
  console.log(data, 'data');
  console.log('====================================');
  return data;
};
