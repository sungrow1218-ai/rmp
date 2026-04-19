import request from '@/utils/request';
import { CommonResponseWrapper } from './typing';
import {
  AlterSeatDetailParams,
  AlterSeatGroupDetailParams,
  AlterSeatGroupParams,
  SeatGroupDetailParams,
  SeatGroupDetailState,
  SeatGroupParams,
  SeatGroupState,
} from '@/pages/seatGroup/contants/tyeping';
import { PaginationType } from '@/components/Pagination/Pagination';

/**
 * 席位组管理- 查询席位组
 */
export async function querySeatGroupOld(
  param: {
    authFlag?: 0 | 1;
    filterCondition?: SeatGroupParams;
  } & PaginationType
) {
  return request<CommonResponseWrapper<{ resultList: SeatGroupState[] }>>(
    `/api/ruleManager/querySeatGroupOld`,
    {
      method: 'post',
      data: param,
    }
  );
}
/**
 * 席位组管理-设置席位组
 */
export async function alterSeatGroupOld(param: AlterSeatGroupParams) {
  return request<CommonResponseWrapper<any>>(
    `/api/ruleManager/alterSeatGroupOld`,
    {
      method: 'post',
      data: param,
    }
  );
}

/**
 * 席位组管理-查询席位组明细
 */
export async function querySeatGroupDetailOld(
  param: {
    filterCondition?: SeatGroupDetailParams;
    seatGroupId: number;
  } & PaginationType
) {
  return request<
    CommonResponseWrapper<{
      resultList: SeatGroupDetailState[];
      totalSize: number;
    }>
  >(`/api/ruleManager/querySeatGroupDetailOld`, {
    method: 'post',
    data: param,
  });
}
/**
 * 席位组管理-查询席位组明细
 */
export async function querySeatInfoOld(
  param: {
    filterCondition?: AlterSeatDetailParams;
  } & PaginationType
) {
  return request<
    CommonResponseWrapper<{
      resultList: SeatGroupDetailParams[];
      totalSize: number;
    }>
  >(`/api/account/querySeatInfoOld`, {
    method: 'post',
    data: param,
  });
}

/**
 * 席位组管理-设置席位组明细
 */
export async function alterSeatGroupDetailOld(
  param: AlterSeatGroupDetailParams
) {
  return request<CommonResponseWrapper<any>>(
    `/api/ruleManager/alterSeatGroupDetailOld`,
    {
      method: 'post',
      data: param,
    }
  );
}
