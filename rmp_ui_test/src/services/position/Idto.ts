import { Key } from 'react';
import { RequestParameterPagination } from '../typing';

export interface QueryPositionParamsIDTO extends RequestParameterPagination {
  nodeId: number;
  filterCondition?: FilterConditionIDTO;
}
export type FilterConditionIDTO = {
  tradeSystemId?: number[];
  security?: { securityCode: string; marketId: number }[];
  tradeAccountCode?: string;
  manageAccountCode?: string;
};
export type PositionResultListIDTO = {
  key?: Key;
  nodeId: number;
  tradeSystemId: number;
  tradeAccount: TradeAcct[];
  manageAccount: ManageAcct[];
  marketId: number;
  securityCode: string;
  positionType: string;
  beginAmount: number;
  currentAmount: number;
  beginImpawnAmount: number;
  currentImpawnAmount: number;
};

export interface TradeAcct {
  tradeSystemId: number;
  accountCode: string;
  accountName: string;
  bookLevel: number;
  marketId: number;
}
export interface ManageAcct {
  tradeSystemId: number;
  accountCode: string;
  accountName: string;
  bookLevel: number;
}

export type AdjustPositionParamsIDTO = {
  nodeId: number;
  tradeSystemId: number;
  marketId: number;
  securityCode: string;
  baseTradeAccount: string;
  baseManageAccount: string;
  positionType: string;
  adjustType: number;
  adjustBeforeAmount: number;
  adjustAfterAmount: number;
};
