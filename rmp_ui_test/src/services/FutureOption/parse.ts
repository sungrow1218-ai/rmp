import {
  FutureGroupParams,
  FutureOptionList,
  FutureOptionListSet,
  GroupList,
  ResultList,
} from '.';
import {
  FutureGroupParamsIDTO,
  FutureOptionListIDTO,
  FutureOptionListSetIDTO,
  GroupListIDTO,
  ResultListIDTO,
  ResultListOptionsIDTO,
} from './Idto';

export const parseQueryLimitGroupParams = (
  prev: FutureGroupParams
): FutureGroupParamsIDTO => {
  const data: FutureGroupParamsIDTO = {
    pageId: prev?.pageId,
    pageSize: prev?.pageSize,
    authorityFlag: prev?.authFlag ?? 1,
    filterCondition: prev?.filterCondition
      ? {
          limitGroupId: prev?.filterCondition?.groupId,
          limitGroupName: prev?.filterCondition?.groupName,
        }
      : undefined,
  };
  return data;
};
export const parseQueryLimitGroupData = (prev: GroupListIDTO): GroupList => {
  const data: GroupList = {
    groupId: prev?.limitGroupId,
    groupName: prev?.limitGroupName,
    createUserCode: prev?.createUserCode,
    updateUserCode: prev?.updateUserCode,
    createDateTime: prev?.createTime,
    lastUpdateTime: prev?.lastUpdateTime,
    createRoleId: prev?.createRoleId,
  };
  return data;
};
export const parseQueryLimitDetailData = (
  prev: FutureOptionListIDTO
): FutureOptionList => {
  const data: FutureOptionList = {
    groupId: prev?.limitGroupId,
    limitType: prev.limitType,
    limitId: prev.futuOptLimitId,
    kindCode: prev.futuOptKindCode,
    marketId: prev.marketId,
    monthControlType: prev.limitParamType,
    contractMonth: prev.contractMonth,
    beginDateType: prev.beginDateType,
    beginInfluenceDirection: prev.beginAffectDirection,
    beginDayOffset: prev.beginDaysOffset,
    beginMonthOffset: prev.beginMonthOffset,
    endDateType: prev.endDateType,
    endInfluenceDirection: prev.endAffectDirection,
    endDayOffset: prev.endDaysOffset,
    endMonthOffset: prev.endMonthOffset,
    thresholdType: prev.limitControlType,
    threshold: prev.setValue,
    compareDirection: prev.compareDirection,
    marketPositionQuantity: prev.positionAmount,
    createUserCode: prev.createUserCode,
    updateUserCode: prev.updateUserCode,
    createDateTime: prev.createTime,
    lastUpdateTime: prev.lastUpdateTime,
  };
  return data;
};

export const parseAlterLimitDetailParams = (
  prev: FutureOptionListSet
): FutureOptionListSetIDTO => {
  const data: FutureOptionListSetIDTO = {
    modifyType: prev.alterType,
    limitList: prev?.limitList?.map((p) => {
      if ('limitType' in p) {
        return {
          limitGroupId: p.groupId,
          limitType: p.limitType,
          futuOptLimitId: p.limitId,
          futuOptKindCode: p.kindCode,
          marketId: p.marketId,
          limitParamType: p.monthControlType,
          contractMonth: p.contractMonth,
          beginDateType: p.beginDateType,
          beginAffectDirection: p.beginInfluenceDirection,
          beginDaysOffset: p.beginDayOffset,
          beginMonthOffset: p.beginMonthOffset,
          endDateType: p.endDateType,
          endAffectDirection: p.endInfluenceDirection,
          endDaysOffset: p.endDayOffset,
          endMonthOffset: p.endMonthOffset,
          limitControlType: p.thresholdType,
          setValue: p.threshold,
          compareDirection: p.compareDirection,
          positionAmount: p.marketPositionQuantity,
        };
      } else {
        return {
          limitGroupId: p.groupId,
          futuOptLimitId: p.limitId,
        };
      }
    }),
  };
  return data;
};

// 期货品种

export const parseQueryFutureKind = (prev: ResultListIDTO): ResultList => {
  const data: ResultList = {
    marketId: prev.marketId,
    kindCode: prev.futuresKindCode,
    kindName: prev.futuresKindName,
  };
  return data;
};
export const parseQueryOptionsKind = (
  prev: ResultListOptionsIDTO
): ResultList => {
  const data: ResultList = {
    marketId: prev.marketId,
    kindCode: prev.optionKindCode,
    kindName: prev.optionKindName,
  };
  return data;
};
