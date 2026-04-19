import {
  RequestParameterPagination,
  ResponseParameterPagination,
} from '../typing';

export interface QueryEntrustParamsIDTO extends RequestParameterPagination {
  pageId: number;
  pageSize: number;
  nodeId: number;
  primaryFlag: number;
  filterCondition?: FilterConditionIDTO;
}
export interface FilterConditionIDTO {
  tradeSystemId?: number[]; // 标记
  entrustCode?: string[];
  marketId?: number[];
  security?: { securityCode: string; marketId: number }[];
  entrustType?: number[];
  entrustDirection?: number[];
  entrustStatus?: string[];
  tradeAccountCode?: string; // 标记
  manageAccountCode?: string; // 标记
  timeSegment?: { beginTime: string; endTime: string };
}

export interface ResultListIDTO {
  key: React.Key;
  entrustDate: string;
  entrustTime: string;
  tradeSystemId: number; // 标识  去除子系统
  subTradeSysId: number;
  entrustCode: string;
  manageAccount: string; // 标识
  tradeAccount: string; // 标识
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
