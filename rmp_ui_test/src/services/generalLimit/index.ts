import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  alterLimitDetailTypeIDTO,
  GeneralLimitDetailListIDTO,
  GeneralLimitGroupListIDTO,
} from './Idto';
import {
  parseAlterLimitDetailData,
  parseQueryLimitDetailData,
  parseQueryLimitGroupData,
} from './parse';
/**
 * 分组列表
 */
export type GeneralLimitGroupParams = {
  filterCondition?: {
    groupId?: number;
    groupName?: string;
  };
} & RequestParameterPagination;

export type GeneralLimitGroupList = {
  groupId: number;
  groupName: string;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
};
interface GeneralLimitGroupResponData extends ResponseParameterPagination {
  resultList: GeneralLimitGroupList[];
}

export async function queryGeneralLimitGroup(params: GeneralLimitGroupParams) {
  return parseRequestByPage<GeneralLimitGroupListIDTO, GeneralLimitGroupList>(
    request(`/aegis/api/ruleManager/queryGeneralLimitGroup`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params.filterCondition
          ? {
              limitGroupId: params.filterCondition.groupId,
              limitGroupName: params.filterCondition.groupName,
            }
          : undefined,
      },
    }),
    parseQueryLimitGroupData
  );
}
export type GeneralLimitGroupSetting = {
  alterType: number;
  terminalInfo?: string;
  groupId: number;
  groupName?: string;
};
/**
 * 分组设置
 */
export async function alterGeneralLimitGroup(params: GeneralLimitGroupSetting) {
  return parseRequest<any>(
    request(`/aegis/api/ruleManager/modifyGeneralLimitGroup`, {
      method: 'POST',
      data: {
        modifyType: params.alterType,
        limitGroupId: params.groupId,
        limitGroupName: params.groupName,
      },
    })
  );
}

export type GeneralLimitDetailParams = {
  groupId: number;
  filterCondition?: {
    securityCode?: string;
    marketId?: number;
  };
} & RequestParameterPagination;

export type GeneralLimitDetailList = {
  securityCode: string;
  securityName: string;
  marketId: number;
  limitValue: number;
  groupId: number;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
};

type GeneralLimitDetailRespon = {
  resultList: GeneralLimitDetailList[];
} & ResponseParameterPagination;

export async function queryGeneralLimitDetail(
  params: GeneralLimitDetailParams
) {
  return parseRequestByPage<GeneralLimitDetailListIDTO, GeneralLimitDetailList>(
    request(`/aegis/api/ruleManager/queryGeneralLimitDetail`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        limitGroupId: params.groupId,
        filterCondition: params.filterCondition
          ? {
              securityCode: params?.filterCondition?.securityCode,
              marketId: params?.filterCondition?.marketId,
            }
          : undefined,
      },
    }),
    parseQueryLimitDetailData
  );
}

export type PoolSecurityList = {
  securityCode: string;
  marketId: number;
  limitValue: number;
};
export type alterLimitDetailParams = {
  alterType: number;
  terminalInfo?: string;
  groupId: number;
  poolSecurityList?: PoolSecurityList[];
};
export type FaultListType = {
  securityCode: string;
  marketId: number | string | undefined;
  errorInfo?: string;
};

export type alterLimitDetailType = {
  faultList?: FaultListType[];
};

export async function alterGeneralLimitDetail(params: alterLimitDetailParams) {
  return parseRequest<alterLimitDetailTypeIDTO, alterLimitDetailType>(
    request(`/aegis/api/ruleManager/modifyGeneralLimitDetail`, {
      method: 'POST',
      data: {
        modifyType: params.alterType,
        limitGroupId: params.groupId,
        poolSecurityList: (params?.poolSecurityList || [])?.map((p) => ({
          totalLimit: p.limitValue,
          marketId: p.marketId,
          securityCode: p.securityCode,
        })),
      },
    }),
    parseAlterLimitDetailData
  );
}
export const exportGeneralLimitDetail = (data: { groupId: number }) =>
  parseRequest<any>(
    request(`/aegis/api/ruleManager/exportGeneralLimitDetail`, {
      method: 'POST',
      data: { limitGroupId: data.groupId },
    })
  );
