import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  AlterSeatDetailParams,
  AlterSeatGroupParams,
  SeatGroupDetailParams,
} from '@/pages/seatGroup/contants/tyeping';
import { PaginationType } from '@/components/Pagination/Pagination';
import {
  QuerySeatGroupDetailRspIDTO,
  QuerySeatGroupRspIDTO,
  QuerySeatInfoRspIDTO,
} from './idto';
import {
  AlterSeatGroupDetailParams,
  QuerySeatGroupDetailRspDTO,
  QuerySeatGroupRspDTO,
  QuerySeatInfoRspDTO,
} from './dto';
import {
  parseAlterSeatGroupDetailParams,
  parseQuerySeatGroupDetail,
  parseQuerySeatGroupRsp,
  parseQuerySeatInfo,
} from './parse';
import { CommonResponseWrapper } from '../typing';

/**
 * 席位组管理- 查询席位组
 */
export const querySeatGroup = async (param: {
  pageId: number;
  pageSize: number;
  authorityFlag?: 0 | 1;
  filterCondition?: {
    seatGroupId?: number;
    seatGroupName?: string;
    marketId?: number;
  };
}) =>
  parseRequestByPage<QuerySeatGroupRspIDTO, QuerySeatGroupRspDTO>(
    request(`/aegis/api/ruleManager/querySeatGroup`, {
      method: 'post',
      data: param,
    }),
    parseQuerySeatGroupRsp
  );

/**
 * 席位组管理-设置席位组
 */
export const alterSeatGroup = async (param: {
  modifyType: number;
  terminalInfo?: string;
  workGroupId: number;
  seatGroupId: number;
  seatGroupName: string;
  marketId: number;
  remark?: string;
}) =>
  parseRequest(
    request(`/aegis/api/ruleManager/modifySeatGroup`, {
      method: 'post',
      data: param,
    })
  );

/**
 * 席位组管理-查询席位组明细
 */
export const querySeatGroupDetail = async (param: {
  pageId: number;
  pageSize: number;
  seatGroupId: number;
  filterCondition?: { seatCode?: string; seatName?: string };
}) =>
  parseRequestByPage<QuerySeatGroupDetailRspIDTO, QuerySeatGroupDetailRspDTO>(
    request(`/aegis/api/ruleManager/querySeatGroupDetail`, {
      method: 'post',
      data: param,
    }),
    parseQuerySeatGroupDetail
  );

/**
 * 席位组管理-查询席位组明细
 */
export async function querySeatInfo(
  param: {
    filterCondition?: { tradeSystemId?: number[]; marketId?: number[] };
  } & PaginationType
) {
  return parseRequestByPage<QuerySeatInfoRspIDTO, QuerySeatInfoRspDTO>(
    request(`/aegis/api/account/querySeatInfo`, {
      method: 'post',
      data: param,
    }),
    parseQuerySeatInfo
  );
}

/**
 * 席位组管理-设置席位组明细
 */
export const alterSeatGroupDetail = async (param: AlterSeatGroupDetailParams) =>
  parseRequest(
    request(`/aegis/api/ruleManager/modifySeatGroupDetail`, {
      method: 'post',
      data: parseAlterSeatGroupDetailParams(param),
    })
  );
