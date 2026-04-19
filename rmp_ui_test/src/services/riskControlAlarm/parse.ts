import {
  QueryRiskDetailParams,
  QueryRiskWarnningsData,
  QueryRiskWarnningsParams,
  ResultList,
  SummaryRiskList,
} from '.';
import {
  QueryRiskWarnningsParamsIDTO,
  ConditionIDTO,
  QueryRiskWarnningsDataIDTO,
  QueryRiskDetailParamsIDTO,
  SummaryRiskListIDTO,
  ResultListIDTO,
} from './Idto';

// 当日查询-历史查询-入参
export const parseSummaryRiskWarningsParams = (
  prev: QueryRiskWarnningsParams
): QueryRiskWarnningsParamsIDTO => {
  const data: QueryRiskWarnningsParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev?.filterCondition
      ? {
          ruleId: prev.filterCondition?.ruleId,
          tradeSystemId: prev.filterCondition?.extSysId,
          entrustCode: prev.filterCondition?.entrustCode,
          accountCode: prev.filterCondition?.acctCode,
          marketId: prev.filterCondition?.marketId,
          securityCode: prev.filterCondition?.securityCode,
          entrustDirection: prev.filterCondition?.entrustDirection,
          ruleType: prev.filterCondition?.ruleType,
          warningOperation: prev.filterCondition?.warnOperation,
          workGroupId: prev.filterCondition?.workGroupId,
          grayFlag: prev.filterCondition?.grayFlag,
          // 历史专用
          beginDate: prev.filterCondition?.beginDate,
          endDate: prev.filterCondition?.endDate,
          ruleSource: prev.filterCondition?.ruleSource,
          ruleTmplGroupId: prev.filterCondition?.ruleTmplGroupId,
        }
      : undefined,
  };
  return data;
};

// 当日查询-出参

export const parseSummaryRiskWarningsData = (
  prev: QueryRiskWarnningsDataIDTO
): QueryRiskWarnningsData => {
  const data: QueryRiskWarnningsData = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    totalSize: prev.totalSize,
    warnCount: prev.warningCount,
    forbidCount: prev.forbidCount,
    noPromptCount: prev.noPromptCount,
    totalCount: prev.totalCount,
    resultList: prev?.resultList?.map((p) => {
      return {
        totalSize: p.totalSize,
        warnSerialCode: p.warningSerialCode,
        businessDate: p.businessDate,
        extSysId: p.tradeSystemId,
        entrustCode: p.entrustCode,
        warnTime: p.warningTime,
        entrustTime: p.entrustTime,
        baseManageAcctCode: p.baseManageAcctCode,
        baseTradeAcctCode: p.baseTradeAcctCode,
        account: p.account,
        tradeSeatCode: p.seatCode,
        marketId: p.marketId,
        securityCode: p.securityCode,
        entrustDirection: p.entrustDirection,
        priceType: p.priceType,
        entrustPrice: p.entrustPrice,
        entrustAmount: p.entrustAmount,
        ruleType: p.ruleType,
        ruleId: p.ruleId,
        ruleName: p.ruleName,
        warnOperation: p.warningOperation,
        warningOperationCode: p.warningOperationCode,
        riskViolationOrigin: p.riskViolationOrigin,
        remark: p.remark,
        grayFlag: p.grayFlag,
        lastUpdateTime: p.lastUpdateTime,
        workGroupId: p.workGroupId,
        warnDetail: p.warningDetail,
        ruleTemplateId: p.ruleTemplateId,
        ruleTmplGroupName: p.ruleTmplGroupName,
        ruleTmplGroupId: p.ruleTmplGroupId,
        securityGroupId: p.securityGroupId,
      };
    }),
  };
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  return data;
};

// 明细查询-入参
export const parseSummaryWarnDetailParams = (
  prev: QueryRiskDetailParams
): QueryRiskDetailParamsIDTO => {
  const data: QueryRiskDetailParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev?.filterCondition
      ? {
          endTime: prev.filterCondition?.endTime,
          ruleId: prev.filterCondition?.ruleId,
          tradeSystemId: prev.filterCondition?.extSysId,
          entrustCode: prev.filterCondition?.entrustCode,
          marketId: prev.filterCondition?.marketId,
          baseManageAcctCode: prev.filterCondition?.baseManageAcctCode,
          baseTradeAcctCode: prev.filterCondition?.baseTradeAcctCode,
          securityCode: prev.filterCondition?.securityCode,
          entrustDirection: prev.filterCondition?.entrustDirection,
          ruleType: prev.filterCondition?.ruleType,
          warningOperation: prev.filterCondition?.warnOperation,
          workGroupId: prev.filterCondition?.workGroupId,
          grayFlag: prev.filterCondition?.grayFlag,
          ruleSource: prev.filterCondition?.ruleSource,
          ruleTmplGroupId: prev.filterCondition?.ruleTmplGroupId,
          ruleTemplateId: prev.filterCondition?.ruleTemplateId,
          securityGroupId: prev.filterCondition?.securityGroupId,
        }
      : undefined,
  };
  return data;
};

export const parseHistoryRiskWarningsData = (
  p: SummaryRiskListIDTO
): SummaryRiskList => {
  const data: SummaryRiskList = {
    totalSize: p.totalSize,
    warnSerialCode: p.warningSerialCode,
    businessDate: p.businessDate,
    extSysId: p.tradeSystemId,
    entrustCode: p.entrustCode,
    warnTime: p.warningTime,
    entrustTime: p.entrustTime,
    baseManageAcctCode: p.baseManageAcctCode,
    baseTradeAcctCode: p.baseTradeAcctCode,
    account: p.account,
    tradeSeatCode: p.seatCode,
    marketId: p.marketId,
    securityCode: p.securityCode,
    entrustDirection: p.entrustDirection,
    priceType: p.priceType,
    entrustPrice: p.entrustPrice,
    entrustAmount: p.entrustAmount,
    ruleType: p.ruleType,
    ruleId: p.ruleId,
    ruleName: p.ruleName,
    warnOperation: p.warningOperation,
    warningOperationCode: p.warningOperationCode,
    riskViolationOrigin: p.riskViolationOrigin,
    remark: p.remark,
    grayFlag: p.grayFlag,
    lastUpdateTime: p.lastUpdateTime,
    workGroupId: p.workGroupId,
    warnDetail: p.warningDetail,
    ruleTemplateId: p.ruleTemplateId,
    ruleTmplGroupName: p.ruleTmplGroupName,
    ruleTmplGroupId: p.ruleTmplGroupId,
    securityGroupId: p.securityGroupId,
  };
  return data;
};

export const parseExportWarningsParams = (
  prev: QueryRiskWarnningsParams
): QueryRiskWarnningsParamsIDTO => {
  const data: QueryRiskWarnningsParamsIDTO = {
    filterCondition: prev?.filterCondition
      ? {
          ruleId: prev.filterCondition?.ruleId,
          tradeSystemId: prev.filterCondition?.extSysId,
          entrustCode: prev.filterCondition?.entrustCode,
          accountCode: prev.filterCondition?.acctCode,
          marketId: prev.filterCondition?.marketId,
          securityCode: prev.filterCondition?.securityCode,
          entrustDirection: prev.filterCondition?.entrustDirection,
          ruleType: prev.filterCondition?.ruleType,
          warningOperation: prev.filterCondition?.warnOperation,
          workGroupId: prev.filterCondition?.workGroupId,
          grayFlag: prev.filterCondition?.grayFlag,
          // 历史专用
          beginDate: prev.filterCondition?.beginDate,
          endDate: prev.filterCondition?.endDate,
          ruleSource: prev.filterCondition?.ruleSource,
          ruleTmplGroupId: prev.filterCondition?.ruleTmplGroupId,
        }
      : undefined,
  };
  return data;
};

export const parseConfigurationData = (prev: ResultListIDTO): ResultList => {
  const data: ResultList = {
    userCode: prev.userCode,
    configuration: prev.configuration,
    createDateTime: prev.createTime,
    createUserNo: prev.createUserCode,
    updateUserNo: prev.updateUserCode,
    menuId: prev.menuId,
    lastUpdateTime: prev.lastUpdateTime,
  };
  return data;
};
