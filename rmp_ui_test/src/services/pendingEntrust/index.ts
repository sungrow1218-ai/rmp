import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import React from 'react';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  parseDeletePendingEntrustParams,
  parsePendingEntrustData,
  parseQueryEntrustParams,
  parseRevokeEntrustParamsIDTO,
} from './parse';
import { ResultListIDTO } from './Idto';
/**
 * 接口入参
 */
export interface QueryEntrustParams extends RequestParameterPagination {
  nodeId: number;
  primaryFlag: number;
  filterCondition?: FilterCondition;
}

export interface FilterCondition {
  extSysId?: number[];
  entrustCode?: string[];
  marketId?: number[];
  security?: { securityCode: string; marketId: number }[];
  entrustDirection?: number[];
  entrustStatus?: string[];
  tradeAcctCode?: string;
  manageAcctCode?: string;
  timeSeg?: { beginTime: string; endTime: string };
}

/**
 * 接口出参
 */
export interface QueryEntrustDataType extends ResponseParameterPagination {
  resultList: ResultList[];
}
export interface ResultList {
  key: React.Key;
  entrustDate: string;
  entrustTime: string;
  extSysId: number;
  extSubsysId: number;
  entrustCode: string;
  manageAcct: string;
  tradeAcct: string;
  seatCode: string;
  marketId: number;
  securityCode: string;
  entrustDirection: number;
  entrustStatus: string;
  priceType: number;
  entrustPrice: number;
  entrustAmount: number;
  dealAmount: number;
  withdrawAmount: number;
  businessType: number;
}
export interface TradeBaseAcct {
  extSysId: number;
  acctCode: string;
  marketId: number;
}
/**
 *
 * @param  挂单查询
 */
export async function queryPendingEntrust(params: QueryEntrustParams) {
  return parseRequestByPage<ResultListIDTO, ResultList>(
    request(`/aegis/api/ops/queryPendingEntrust`, {
      method: 'POST',
      data: parseQueryEntrustParams(params),
    }),
    parsePendingEntrustData
  );
}

/**
 * 废单入参
 */
export interface RevokeEntrustParams {
  nodeId: number;
  entrustList: {
    extSysId: number;
    extSubSysId: number;
    entrustCode: string;
  }[];
}

/** 批量废单 */
export async function queryRevokeEntrust(params: RevokeEntrustParams) {
  return parseRequest<never>(
    request(`/aegis/api/ops/revokeEntrust`, {
      method: 'POST',
      data: parseRevokeEntrustParamsIDTO(params),
    })
  );
}
/** 批量删除 */
export async function deletePendingEntrust(params: RevokeEntrustParams) {
  return parseRequest<never>(
    request(`/aegis/api/ops/deletePendingEntrust`, {
      method: 'POST',
      data: parseRevokeEntrustParamsIDTO(params),
    })
  );
}

export interface DeletePendingEntrustParams {
  nodeId: number;
  filterCondition?: FilterCondition;
}
/** 一件删除 */
export async function deletePendingEntrustOneClick(
  params: DeletePendingEntrustParams
) {
  return parseRequest<never>(
    request(`/aegis/api/ops/deletePendingEntrustOneClick`, {
      method: 'POST',
      data: parseDeletePendingEntrustParams(params),
    })
  );
}
