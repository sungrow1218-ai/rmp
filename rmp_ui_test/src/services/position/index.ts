import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import React, { Key } from 'react';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import {
  parseAdjustPositionParams,
  parseQueryPosition,
  parseQueryPositionParams,
} from './parse';
import { PositionResultListIDTO } from './Idto';

export interface QueryPositionParams extends RequestParameterPagination {
  nodeId: number;
  filterCondition?: FilterCondition;
}
export type FilterCondition = {
  extSysId?: number[];
  security?: { securityCode: string; marketId: number }[];
  tradeAcctCode?: string;
  manageAcctCode?: string;
};
interface PositionDataType extends ResponseParameterPagination {
  resultList: PositionResultList[];
}

export interface TradeAcct {
  extSysId: number;
  acctCode: string;
  acctName: string;
  bookLevel: number;
  marketId: number;
}
export interface ManageAcct {
  extSysId: number;
  acctCode: string;
  acctName: string;
  bookLevel: number;
}
export type PositionResultList = {
  key?: Key;
  nodeId: number;
  extSysId: number;
  tradeAcct: TradeAcct[];
  manageAcct: ManageAcct[];
  marketId: number;
  securityCode: string;
  positionType: string;
  beginAmount: number;
  currentAmount: number;
  beginImpawnAmount: number;
  currentImpawnAmount: number;
};

export async function queryPosition(params: QueryPositionParams) {
  return parseRequestByPage<PositionResultListIDTO, PositionResultList>(
    request(`/aegis/api/ops/queryPosition`, {
      method: 'POST',
      data: parseQueryPositionParams(params),
    }),
    parseQueryPosition
  );
}
export type AdjustPositionParams = {
  nodeId: number;
  extSysId: number;
  marketId: number;
  securityCode: string;
  baseTradeAcct: string;
  baseManageAcct: string;
  positionType: string;
  adjustType: number;
  adjustBeforeAmount: number;
  adjustAfterAmount: number;
};
export async function adjustPosition(params: AdjustPositionParams) {
  return parseRequest<never>(
    request(`/aegis/api/ops/adjustPosition`, {
      method: 'POST',
      data: parseAdjustPositionParams(params),
    })
  );
}
