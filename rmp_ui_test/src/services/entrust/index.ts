import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import React from 'react';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import { parseQueryEntrustData, parseQueryEntrustParams } from './parse';
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
  entrustType?: number[];
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
  entrustType: number;
  entrustDirection: number;
  entrustStatus: string;
  priceType: number;
  entrustPrice: number;
  entrustAmount: number;
  dealAmount: number;
  withdrawAmount: number;
  investType: string;
  tradePlatformId: number;
  businessType: number;
}
export interface TradeBaseAcct {
  extSysId: number;
  acctCode: string;
  marketId: number;
}
/**
 *
 * @param  委托查询
 */
export async function queryEntrust(params: QueryEntrustParams) {
  return parseRequestByPage<ResultListIDTO, ResultList>(
    request(`/aegis/api/ops/queryEntrust`, {
      method: 'POST',
      data: parseQueryEntrustParams(params),
    }),
    parseQueryEntrustData
  );
}
/**
 * 节点查询
 */
/** 节点入参 */
interface queryNodeParams extends RequestParameterPagination {
  filterCondition?: {
    nodeId?: number[];
    partitionId?: number[];
  };
}
/** 节点出参 */
type queryNodeData = {
  resultList: NodeResultList[];
} & ResponseParameterPagination;

export type NodeResultList = {
  nodeId: number;
  nodeName: string;
  partitionId: number;
};
export async function queryNode(params: queryNodeParams) {
  return parseRequest<queryNodeData>(
    request(`/aegis/api/ops/queryNode`, {
      method: 'POST',
      data: params,
    })
  );
}
