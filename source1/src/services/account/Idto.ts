import { QueryTradeAccountParamType } from '.';
import { RequestParameterPaginationIDTO } from '../typing';

// 查询交易账户入参
export type QueryTradeAccountParamTypeIDTO = {
  authFlag?: 0 | 1;
  filterCondition?: QueryCondDTO;
} & RequestParameterPaginationIDTO;

interface QueryCondDTO {
  sobId?: number;
  bookLevel?: number;
  accountCode?: string;
  accountName?: string;
  marketId?: number[];
  parentAccountCode?: string;
  tradeSystemId?: number[];
}

// 查询交易账户出参
export interface TradeAcctIDTO {
  /** 账号层级 */
  bookLevel: number;
  /** 账户编码 */
  accountCode: string;
  /** 账户名称 */
  accountName: string;
  /** 交易市场编号 */
  marketId: number;
  /** 上级账户编码 */
  parentAccountCode: string;
  /** 对接系统号 */
  tradeSystemId: number;
  /** 最近刷新时间 */
  lastUpdateTime: number;
}

// 查询管理账户入参
export type QueryManageAcctParamsIDTO = {
  filterCondition?: ManageConditionDTO;
} & RequestParameterPaginationIDTO;

interface ManageConditionDTO {
  sobId?: number;
  bookLevel?: number;
  accountCode?: string;
  accountName?: string;
  parentAccountCode?: string;
  tradeSystemId?: number[];
}

// 查询管理账户出参
export interface ManageAcctIDTO {
  bookLevel: number;
  accountCode: string;
  accountName: string;
  parentAccountCode: string;
  tradeSystemId: number;
  lastUpdateTime: number;
}

// 系统号出参
export type ExtSysItemIDTO = {
  sobId: number;
  tradeSystemId: number;
  tradeSystemName: string;
  lastUpdateTime: string;
};