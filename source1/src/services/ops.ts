import request, { parseRequestByPage } from '@/utils/request';
import type {
  RequestParameterPagination,
  ResponseParameterPagination,
} from './typing';

// ==================== 类型定义 ====================

// 工作台-账套关系项
export interface WorkGroupItem {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}

// 工作台-账套关系查询参数
export interface QueryWorkGroupParams extends RequestParameterPagination {
  filterCondition?: {
    workGroupId?: number;
    sobId?: number;
  };
}

// 账套信息
export interface SobInfo {
  workGroupId?: number;
  sobId: number;
  sobName: string;
  bookList: BookList[];
}

// 账户类型列表
export interface BookList {
  bookType: number;
  bookDepth: number;
  bookLevelList: BookLevelItem[];
}

// 账户层级项
export interface BookLevelItem {
  bookLevel: number;
  bookLevelName: string;
}

// 账户体系查询参数
export interface QueryBookParams extends RequestParameterPagination {
  filterCondition?: {
    sobId?: number;
    sobName?: string;
  };
}

// 外部交易系统项
export interface ExtSysItem {
  sobId: number;
  tradeSystemId: number;    // 交易系统ID
  tradeSystemName: string;  // 交易系统名称
  lastUpdateTime: string;
}

// 外部交易系统查询参数
export interface QueryExternSystemParams extends RequestParameterPagination {
  authorityFlag?: number;
  filterCondition?: {
    sobId?: number;
    tradeSystemId?: number[];
  };
}

// ==================== 接口实现 ====================

/**
 * 1. 通过workGroupId查询sobId
 * 接口地址: POST /aegis/api/ops/queryWorkGroup
 * 参数: { pageId: 1, pageSize: 1, filterCondition: { workGroupId } }
 */
export async function querySobIdByWorkGroupId(workGroupId: number) {
  return parseRequestByPage<WorkGroupItem>(
    request(`/aegis/api/ops/queryWorkGroup`, {
      method: 'POST',
      data: {
        pageId: 1,
        pageSize: 1,
        filterCondition: { workGroupId },
      },
    })
  );
}

/**
 * 2. 查询账户体系（账套）
 * 接口地址: POST /aegis/api/ops/querySetOfBook
 */
export async function querySetOfBook(params: QueryBookParams) {
  return parseRequestByPage<SobInfo>(
    request(`/aegis/api/ops/querySetOfBook`, {
      method: 'POST',
      data: params,
    })
  );
}

/**
 * 3. 通过sobId获取账户体系
 * 接口地址: POST /aegis/api/ops/querySetOfBook
 * 参数: { pageId: 1, pageSize: 1000, filterCondition: { sobId } }
 */
export async function querySetOfBookbySobId(sobId: number) {
  return querySetOfBook({
    pageId: 1,
    pageSize: 1000,
    filterCondition: { sobId },
  });
}

/**
 * 4. 查询外部交易系统
 * 接口地址: POST /aegis/api/ops/queryTradeSystem
 */
export async function queryExternSystem(params: QueryExternSystemParams) {
  return parseRequestByPage<ExtSysItem>(
    request(`/aegis/api/ops/queryTradeSystem`, {
      method: 'POST',
      data: {
        pageId: params.pageId || 1,
        pageSize: params.pageSize || 1000,
        authorityFlag: params.authorityFlag,
        filterCondition: params.filterCondition
          ? {
              tradeSystemId: params.filterCondition.tradeSystemId,
              sobId: params.filterCondition.sobId,
            }
          : undefined,
      },
    })
  );
}