import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  type CommonResponseIWrapper,
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import { ExtSysItemIDTO, ManageAcctIDTO, TradeAcctIDTO } from './Idto';
import {
  parseQueryExternSystemData,
  parseQueryManageAccountData,
  parseQueryManageAccountParam,
  parseQueryTradeAccountData,
  parseQueryTradeAccountParam,
} from './parse';

/**
 * 筛选条件传参格式
 */
interface QueryCondDTO {
  sobId?: number;
  bookLevel?: number;
  acctCode?: string;
  acctName?: string;
  marketId?: number[];
  parentAcctCode?: string;
  extSysId?: number[];
}

export type QueryTradeAccountParamType = {
  authFlag?: 0 | 1;
  filterCondition?: QueryCondDTO;
} & RequestParameterPagination;

export interface TradeAcctDTO {
  /** 账号层级 */
  bookLevel: number;
  /** 账户编码 */
  acctCode: string;
  /** 账户名称 */
  acctName: string;
  /** 交易市场编号 */
  marketId: number;
  /** 上级账户编码 */
  parentAcctCode: string;
  /** 对接系统号 */
  extSysId: number;
  /** 最近刷新时间 */
  lastUpdateTime: number;
}

/**
 * 获取交易账户列表
 */
export async function queryTradeAccount(params: QueryTradeAccountParamType) {
  return parseRequestByPage<TradeAcctIDTO, TradeAcctDTO>(
    request(`/aegis/api/account/queryTradeAccount`, {
      method: 'POST',
      data: parseQueryTradeAccountParam(params),
    }),
    parseQueryTradeAccountData
  );
}

/**
 * 通过 id 获取对接系统列表
 */
export async function queryTradeAccountByExtSysIds(ids: number[] | string[]) {
  return queryTradeAccount({
    pageId: 1,
    pageSize: 1000,
    filterCondition: {
      extSysId: ids?.map((id) => Number(id)),
    },
  });
}
export type WorkGroupList = {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
};
interface WorkGroupData extends ResponseParameterPagination {
  resultList: WorkGroupList[];
}
/** 通过bookLevel和sobId获取数据 */

export async function queryTradeAccountByLBooklevel(
  sobId: number,
  bookLevel: number,
  acctCode?: string
) {
  return queryTradeAccount({
    pageId: 1,
    pageSize: 1000,
    filterCondition: {
      bookLevel,
      sobId,
      acctCode,
    },
  });
}

/**
 * 账户体系参数
 */
type BookConditionParmas = { sobId?: number; sobName?: string };
type QueryBookParams = {
  filterCondition?: BookConditionParmas;
} & RequestParameterPagination;

export type BookList = {
  bookType: number;
  bookDepth: number;
  bookLevelList: BookLevelList[];
};
export type BookLevelList = {
  bookLevel: number;
  bookLevelName: string;
};

export type SobInfo = {
  workGroupId?: number;
  sobId: number;
  sobName: string;
  bookList: BookList[];
};

export interface SetOfBookDataType extends ResponseParameterPagination {
  resultList: SobInfo[];
}

/**
 * 查询工作台-账套关系
 */
export async function queryWorkGroup(
  params: RequestParameterPagination & {
    authFlag?: number;
    filterCondition?: {
      workGroupId?: number;
      sobId?: number;
    };
  }
) {
  return parseRequestByPage<WorkGroupList>(
    request(`/aegis/api/ops/queryWorkGroup`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        authorityFlag: params?.authFlag,
        filterCondition: params?.filterCondition
          ? {
              workGroupId: params?.filterCondition?.workGroupId,
              sobId: params?.filterCondition?.sobId,
            }
          : undefined,
      },
    })
  );
}

/**
 * 通过workGroupId查询sobId
 */
export async function querySobIdByWorkGroupId(workGroupId: number) {
  return queryWorkGroup({
    pageId: 1,
    pageSize: 1,
    filterCondition: { workGroupId },
  });
}

/**
 * 通过workGroupID对应sobId获取账户体系
 */
export async function querySetOfBook(params: QueryBookParams) {
  return parseRequestByPage<SobInfo>(
    request(`/aegis/api/ops/querySetOfBook`, {
      method: 'POST',
      data: params,
    })
  );
}

export async function querySetOfBookbySobId(sobId: number) {
  return querySetOfBook({
    pageId: 1,
    pageSize: 1000,
    filterCondition: {
      sobId,
    },
  });
}

/**
 * 管理账户参数
 */
interface ManageConditionDTO {
  sobId?: number;
  bookLevel?: number;
  acctCode?: string;
  acctName?: string;
  parentAcctCode?: string;
  extSysId?: number[];
}
export interface ManageAcctDTO {
  bookLevel: number;
  acctCode: string;
  acctName: string;
  parentAcctCode: string;
  extSysId: number;
  lastUpdateTime: number;
}
type ManageAccDataType = {
  resultList: ManageAcctDTO[];
} & ResponseParameterPagination;

export type QueryManageAcctParams = {
  authFlag?: 0 | 1;
  filterCondition?: ManageConditionDTO;
} & RequestParameterPagination;

export async function queryManageAccount(params: QueryManageAcctParams) {
  return parseRequestByPage<ManageAcctIDTO, ManageAcctDTO>(
    request(`/aegis/api/account/queryManageAccount`, {
      method: 'POST',
      data: parseQueryManageAccountParam(params),
    }),
    parseQueryManageAccountData
  );
}

export type ExtSysItem = {
  sobId: number;
  extSysId: number;
  extSysName: string;
  lastUpdateTime: string;
};
export type QueryExternSystemParams = RequestParameterPagination & {
  authFlag?: number;
  filterCondition?: { sobId?: number; extSysId?: number[] };
};
export async function queryExternSystem(params: QueryExternSystemParams) {
  return parseRequestByPage<ExtSysItemIDTO, ExtSysItem>(
    request(`/aegis/api/ops/queryTradeSystem`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        authorityFlag: params.authFlag,
        filterCondition: params?.filterCondition
          ? {
              tradeSystemId: params?.filterCondition.extSysId,
              sobId: params?.filterCondition.sobId,
            }
          : undefined,
      },
    }),
    parseQueryExternSystemData
  );
}

export async function queryManageAccountByBooklevel(
  sobId: number,
  bookLevel: number,
  acctCode?: string
) {
  return queryManageAccount({
    pageId: 1,
    pageSize: 1000,
    filterCondition: {
      bookLevel,
      sobId,
      acctCode,
    },
  });
}

// 账户组——查询交易账户
interface TraderTreeConditionDTO {
  // sobId?: number;
  acctCode?: string;
  acctName?: string;
  marketId?: number[];
  extSysId?: number[];
}

type QueryTradeAccountTreeParamType = {
  authFlag?: 0 | 1;
  filterCondition?: TraderTreeConditionDTO;
} & RequestParameterPagination;
export async function queryTradeAccounts(
  params: QueryTradeAccountTreeParamType
) {
  return parseRequestByPage<TradeAcctIDTO, TradeAcctDTO>(
    request(`/aegis/api/account/queryTradeAccountTreeByAuthority`, {
      method: 'POST',
      data: {
        pageId: params?.pageId,
        pageSize: params?.pageSize,
        filterCondition: params?.filterCondition
          ? {
              marketId: params?.filterCondition?.marketId,
              accountCode: params?.filterCondition?.acctCode,
              accountName: params?.filterCondition?.acctName,
              tradeSystemId: params?.filterCondition?.extSysId,
            }
          : undefined,
      },
    }),
    parseQueryTradeAccountData
  );
}

// 账户组——查询管理账户

interface ManageTreeConditionDTO {
  // sobId?: number;
  bookLevel?: number; // 账户层级（整体过滤）
  account?: {
    acctCode?: string; // 账户编码
    acctName?: string; // 账户名称
    bookLevel?: number; // 账户层级
  };
  extSysId?: number[]; // 对接系统号（数组）
}

type QueryManageAcctTreeParams = {
  authFlag?: 0 | 1;
  filterCondition?: ManageTreeConditionDTO;
} & RequestParameterPagination;

export async function queryManageAccounts(params: QueryManageAcctTreeParams) {
  return parseRequestByPage<ManageAcctIDTO, ManageAcctDTO>(
    request(`/aegis/api/account/queryManageAccountTreeByAuthority`, {
      method: 'POST',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        filterCondition: params?.filterCondition
          ? {
              bookLevel: params.filterCondition?.bookLevel,
              account: params.filterCondition?.account
                ? {
                    accountCode: params?.filterCondition?.account?.acctCode,
                    accountName: params?.filterCondition?.account?.acctName,
                    bookLevel: params?.filterCondition?.account?.bookLevel,
                  }
                : undefined,
              tradeSystemId: params?.filterCondition.extSysId,
            }
          : undefined,
      },
    }),
    parseQueryManageAccountData
  );
}
