import { BookTypeEnum } from '@/pages/ruleSetting/components/RuleDimensionControl/component/ControlAcctTypeSelect';
import { RequestParameterPaginationIDTO } from '../typing';

export interface RoleBaseInfoResStateIDTO {
  // 角色序号
  roleId: number;
  // 角色名称
  roleName: string;
  // 角色描述
  roleDescription: string;
  // 角色状态- 生效状态，删除角色
  roleStatus: number;
  // 创建用户编号
  createUserCode: string;
  // 更新用户编号
  updateUserCode: string;
  // 创建日期时间
  createTime: string;
  // 最近刷新时间
  lastUpdatTime: string;
}

/**
 * 角色管理-角色功能权限查询
 */

export interface AllAuthorityDataPropsIDTO {
  roleId: number;
  menuAuthorityList: MenuAuthListParamType[];
  accountAuthorityList: {
    tradeSystemId: number;
    tradeSystemName: string;
    bookLevel: number;
    bookType: BookTypeEnum;
    accountCode: string;
    accountName: string;
    marketId: number;
    authority: number;
  }[];
  specDataAuthList: SpecDatAuthListProps[];
  riskDataAuthList: RiskDataAuthListState[];
  workGroupAuthList: WorkGroupAuthList[];
}

export interface MenuAuthListParamType {
  menuId: number;
  useAuthority: number;
  empowerAuthority: number;
  menuName?: string;
  functionAuthorityList: FunAuthListType[];
}
export interface FunAuthListType {
  functionId: number | null;
  functionName?: string;
  functionDescrip?: string;
  useAuthority: number | null;
  workGroupId?: number | null;
}

export interface SpecDatAuthListProps {
  // 数据类型
  dataType: number;
  // 跨角色查询权限
  crossRoleQueryAuth: number;
  // 数据创建角色序号
  dataRoleId: number;
}
export interface RiskDataAuthListState {
  // 数据类型
  dataType: number;
  // 数据实例序号
  dataInstId: number;
  // 查询权限
  queryAuth: number;
  // 明细查询权限
  detailQueryAuth: number;
  // 操作权限
  operateAuth: number;
}
export interface WorkGroupAuthList {
  workGroupId: number;
  workGroupName: string;
}

/**
 * 角色管理-角色基本信息设置
 */

export interface AlterRoleBaseInfoParamsIDTO {
  // 设置角色名称-新增必填
  roleName?: string;
  // 设置角色描述
  roleDescription?: string;
  // 操作类型
  modifyType: number;
  // 设置角色序号 新增传0
  modifyRoleId: number;
}

export interface AlterRoleAccountAuthorityIDTO {
  modifyRoleId: number;
  addAuthorityList: AcctAuthItem[];
  deleteAuthorityList: AcctAuthItem[];
}
export interface AcctAuthItem {
  tradeSystemId: number;
  bookLevel: number;
  bookType: number;
  accountCode: string;
  marketId: number;
}

// 角色功能权限设置 modifyRoleFunctionAuthority
export interface AlterFunAuParamsIDTO {
  // 操作类型
  modifyType: number;
  // 设置角色序号 新增传0
  modifyRoleId: number;
  menuAuthorityList: MenuAuthListParamType[];
}

// 请求菜单接口（无权限）

export interface MenuInfoResTypeIDTO {
  menuName: string;
  parentMenuId: number;
  menuId: number;
  menuUrl?: string;
  functionList?: {
    functionId: number;
    functionName: string;
    functionDescription: string;
  }[];
}

// 交易账户树
export interface AccountTreeItemIDTO {
  /** 账号层级 */
  bookLevel: number;
  bookLevelName: string;
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

export type TradeAccountTreeParamsIDTO = {
  filterCondition?: {
    accountCode?: string;
    accountName?: string;
    marketId?: number[];
    tradeSystemId?: number[];
  };
} & RequestParameterPaginationIDTO;

export type ManageAccountTreeParamsIDTO = {
  filterCondition?: {
    accountCode?: string;
    accountName?: string;
    tradeSystemId?: number[];
  };
} & RequestParameterPaginationIDTO;

export interface ManageAccountTreeItemIDTO {
  /** 账号层级 */
  bookLevel: number;
  bookLevelName: string;
  /** 账户编码 */
  accountCode: string;
  /** 账户名称 */
  accountName: string;
  /** 上级账户编码 */
  parentAccountCode: string;
  /** 对接系统号 */
  tradeSystemId: number;
  /** 最近刷新时间 */
  lastUpdateTime: number;
}

export interface ExternSystemStateIDTO {
  sobId: number;
  tradeSystemName: string;
  lastUpdateTime: string;
  tradeSystemId: number;
}

export interface HighestManageAccountIDTO {
  bookLevel: number;
  accountCode: string;
  accountName: string;
  tradeSystemId: number;
  tradeSystemName: string;
  lastUpdateTime: number;
  queryAuth?: number;
  operateAuth?: number;
}
