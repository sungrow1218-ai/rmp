import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  CommonResponseIWrapper,
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from '../typing';
import { parseRoleMeun } from './parse';
import { MenuItemTypeIDTO } from './Idto';

interface FunctionItemType {
  /**
   * 功能序号
   */
  functionId: number;
  /**
   * 功能名称
   */
  functionName: string;
  /**
   * 功能描述
   */
  functionDescrip: string;
}
export interface MenuItemType {
  /**
   * 菜单编号
   */
  menuId: number;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 上级菜单编号
   */
  parentMenuId?: number;
  /**
   * 菜单地址
   */
  menuUrl: string;
  /**
   * 菜单功能对象
   */
  functionList: FunctionItemType[];
}

type MenuResponseDataType = {
  resultList: MenuItemType[];
} & ResponseParameterPagination;

/**
 * 用户角色列表
 */
export async function getMenuByRole(
  params: RequestParameterPagination
) {
  return parseRequestByPage<MenuItemTypeIDTO, MenuItemType>(
    request(`/aegis/api/ops/queryRoleMenuInfo`, {
      method: 'POST',
      data: params,
    }),
    parseRoleMeun
  );
}

/** 菜单配置 */

export type MenuConfigDataType = {
  resultList: {
    menuId: number;
    displayConfig: string;
  }[];
} & ResponseParameterPagination;

export async function queryMenuConfig(
  params: RequestParameterPagination & {
    filterCondition?: {
      menuId?: number;
    };
  }
) {
  return parseRequest(
    request<CommonResponseIWrapper<MenuConfigDataType>>(
      `/aegis/api/ops/queryMenuConfiguration`,
      {
        method: 'POST',
        data: params,
      }
    )
  );
}
