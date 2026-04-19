import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import React from 'react';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  FutureOptionListIDTO,
  GroupListIDTO,
  ResultListIDTO,
  ResultListOptionsIDTO,
} from './Idto';
import {
  parseAlterLimitDetailParams,
  parseQueryFutureKind,
  parseQueryLimitDetailData,
  parseQueryLimitGroupData,
  parseQueryLimitGroupParams,
  parseQueryOptionsKind,
} from './parse';

export interface FutureOptionParams extends RequestParameterPagination {
  filterCondition?: {
    limitType?: number;
    groupId?: number;
    marketId?: number[];
    kindCode?: string[];
  };
}
export interface FutureOptionList {
  key?: React.Key;
  groupId: number;
  limitType: number;
  limitId: number;
  kindCode: string;
  marketId: number;
  monthControlType: number;
  contractMonth: number;
  beginDateType: number;
  beginInfluenceDirection: number;
  beginDayOffset: number;
  beginMonthOffset: number;
  endDateType: number;
  endInfluenceDirection: number;
  endDayOffset: number;
  endMonthOffset: number;
  thresholdType: number;
  threshold: number;
  compareDirection: number;
  marketPositionQuantity: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}
export type FutureOptionResponData = {
  resultList: FutureOptionList[];
} & ResponseParameterPagination;
/**
 * 期货期权详情
 */
export async function queryFutureOptionLimitDetail(params: FutureOptionParams) {
  return parseRequestByPage<FutureOptionListIDTO, FutureOptionList>(
    request(`/aegis/api/ruleManager/queryFutureOptionLimitDetail`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params.filterCondition
          ? {
              limitGroupId: params?.filterCondition?.groupId,
              marketId: params?.filterCondition?.marketId,
              futuOptKindCode: params.filterCondition?.kindCode,
              limitType: params.filterCondition?.limitType,
            }
          : undefined,
      },
    }),
    parseQueryLimitDetailData
  );
}

/**
 * 分组列表
 */
export type FutureGroupParams = {
  authFlag?: 0 | 1;
  filterCondition?: {
    groupId?: number;
    groupName?: string;
  };
} & RequestParameterPagination;

export type GroupList = {
  groupId: number;
  groupName: string;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
};
interface FutureGroupResponData extends ResponseParameterPagination {
  resultList: GroupList[];
}

export async function queryFutureOptionLimitGroup(params: FutureGroupParams) {
  return parseRequestByPage<GroupListIDTO, GroupList>(
    request(`/aegis/api/ruleManager/queryFutureOptionLimitGroup`, {
      method: 'POST',
      data: parseQueryLimitGroupParams(params),
    }),
    parseQueryLimitGroupData
  );
}
export type FutureGroupSetting = {
  alterType: number;
  terminalInfo?: string;
  groupId: number;
  groupName?: string;
};

export async function queryEditGroup(params: FutureGroupSetting) {
  return parseRequest<any>(
    request(`/aegis/api/ruleManager/modifyFutureOptionLimitGroup`, {
      method: 'POST',
      data: {
        modifyType: params?.alterType,
        limitGroupId: params?.groupId,
        limitGroupName: params?.groupName,
      },
    })
  );
}

// 期货品种查询
export type FutureKindParams = {
  filterCondition?: {
    marketId?: number[];
  };
} & RequestParameterPagination;
export type ResultList = {
  kindCode: string;
  marketId: number;
  kindName: string;
};
export type FutureKindRespon = {
  ResultList: ResultList[];
} & ResponseParameterPagination;
export async function queryFutureKind(params: FutureKindParams) {
  return parseRequestByPage<ResultListIDTO, ResultList>(
    request(`/aegis/api/info/queryFutureKind`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params?.filterCondition
          ? {
              marketId: params?.filterCondition?.marketId,
            }
          : undefined,
      },
    }),
    parseQueryFutureKind
  );
}
export async function queryOptionKind(params: FutureKindParams) {
  return parseRequestByPage<ResultListOptionsIDTO, ResultList>(
    request(`/aegis/api/info/queryOptionKind`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params?.filterCondition
          ? {
              marketId: params?.filterCondition?.marketId,
            }
          : undefined,
      },
    }),
    parseQueryOptionsKind
  );
}

/**
 * 期货期权设置
 */

export type LimitList =
  | {
      groupId: number;
      limitType: number;
      limitId: number;
      kindCode: string;
      marketId: number;
      monthControlType: number;
      contractMonth: number;
      beginDateType: number;
      beginInfluenceDirection: number;
      beginDayOffset: number;
      beginMonthOffset: number;
      endDateType: number;
      endInfluenceDirection: number;
      endDayOffset: number;
      endMonthOffset: number;
      thresholdType: number;
      threshold: number;
      compareDirection: number;
      marketPositionQuantity: number;
    }
  | { limitId: number; groupId: number };
export interface FutureOptionListSet {
  alterType: number;
  terminalInfo?: string;
  limitList: LimitList[];
}

export async function queryFuturDetail(params: FutureOptionListSet) {
  return parseRequest<any>(
    request(`/aegis/api/ruleManager/modifyFutureOptionLimitDetail`, {
      method: 'POST',
      data: parseAlterLimitDetailParams(params),
    })
  );
}

/**
 * 模板请求
 */

export type TemplateParams = {
  limitType: number;
  kindCode: string;
  marketId: number;
};

type ResponseTemplate = {
  templateData: any;
};

export async function queryFuturTemplate(params: TemplateParams) {
  return parseRequest<ResponseTemplate>(
    request(`/aegis/api/ruleManager/queryFutureOptionLimitTemplate`, {
      method: 'POST',
      data: {
        futuOptKindCode: params?.kindCode,
        limitType: params?.limitType,
        marketId: params?.marketId,
      },
    })
  );
}

/**
 * 导出数据
 */
export const exportFutures = (data: { groupId: number }) =>
  parseRequest<any>(
    request(`/aegis/api/ruleManager/exportFutureOptionLimit`, {
      method: 'POST',
      data: {
        limitGroupId: data.groupId,
      },
    })
  );
