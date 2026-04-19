import {
  AccountPermissionsDataParam,
  AccountTreeItem,
  AllAuthorityDataProps,
  AlterRoleBaseInfoParams,
  MenuInfoResType,
  RoleBaseInfoResState,
} from '@/pages/roleManage/contant/typing';
import {
  AccountTreeItemIDTO,
  AllAuthorityDataPropsIDTO,
  AlterFunAuParamsIDTO,
  AlterRoleAccountAuthorityIDTO,
  AlterRoleBaseInfoParamsIDTO,
  HighestManageAccountIDTO,
  ManageAccountTreeItemIDTO,
  ManageAccountTreeParamsIDTO,
  MenuInfoResTypeIDTO,
  RoleBaseInfoResStateIDTO,
  TradeAccountTreeParamsIDTO,
} from './Idto';
import { AlterRoleAccountAuthorityDTO } from './dto';
import {
  AlterFunAuParams,
  ManageAccountTreeParams,
  TradeAccountTreeParams,
} from '.';

/**
 * 角色管理-角色基本信息查询
 */
export const parseRoleBaseInfo = (
  prev: RoleBaseInfoResStateIDTO
): RoleBaseInfoResState => {
  const data: RoleBaseInfoResState = {
    roleId: prev.roleId,
    roleName: prev.roleName,
    roleDescrip: prev.roleDescription,
    roleStatus: prev.roleStatus,
    createUserNo: prev.createTime,
    updateUserNo: prev.updateUserCode,
    createDateTime: prev.createTime,
    lastUpdatTime: prev.lastUpdatTime,
  };
  return data;
};

/**
 * 角色管理-角色功能权限查询
 */

export const parseAllAuthority = (
  prev: AllAuthorityDataPropsIDTO
): AllAuthorityDataProps => {
  const data: AllAuthorityDataProps = {
    roleId: prev.roleId,
    menuAuthList: (prev?.menuAuthorityList || [])?.map((p) => {
      return {
        menuId: p.menuId,
        menuName: p.menuName,
        useAuth: p.useAuthority,
        empowerAuth: p.empowerAuthority,
        functionAuthList: (p?.functionAuthorityList || []).map((q) => ({
          functionId: q.functionId,
          functionName: q.functionName,
          useAuth: q.useAuthority,
        })),
      };
    }),
    acctAuthList: prev?.accountAuthorityList?.map((item) => {
      return {
        extSysName: item.tradeSystemName,
        extSysId: item.tradeSystemId,
        bookLevel: item.bookLevel,
        bookType: item.bookType,
        marketId: item.marketId,
        auth: item.authority,
        acctCode: item.accountCode,
        acctName: item.accountName,
      };
    }),
    specDataAuthList: prev.specDataAuthList,
    riskDataAuthList: prev.riskDataAuthList,
    workGroupAuthList: prev.workGroupAuthList,
  };
  return data;
};
export const parseAlterRoleBaseInfo = (
  prev: AlterRoleBaseInfoParams
): AlterRoleBaseInfoParamsIDTO => {
  const data: AlterRoleBaseInfoParamsIDTO = {
    modifyRoleId: prev.alterRoleId,
    modifyType: prev.alterType,
    roleName: prev.roleName ?? undefined,
    roleDescription: prev.roleDescrip ?? undefined,
  };
  return data;
};
export const parseAlterRoleAccountAuthority = (
  prev: AlterRoleAccountAuthorityDTO
): AlterRoleAccountAuthorityIDTO => {
  const data: AlterRoleAccountAuthorityIDTO = {
    modifyRoleId: prev.alterRoleId,
    addAuthorityList: (prev?.addAuthList ?? [])?.map((item) => {
      return {
        tradeSystemId: item.extSysId,
        bookLevel: item.bookLevel,
        bookType: item.bookType,
        accountCode: item.acctCode,
        marketId: item.marketId,
      };
    }),
    deleteAuthorityList: (prev?.deleteAuthList ?? [])?.map((item) => {
      return {
        tradeSystemId: item.extSysId,
        bookLevel: item.bookLevel,
        bookType: item.bookType,
        accountCode: item.acctCode,
        marketId: item.marketId,
      };
    }),
  };
  return data;
};

export const parseAlterCommonParams = (
  prev: AlterFunAuParams
): AlterFunAuParamsIDTO => {
  const data: AlterFunAuParamsIDTO = {
    modifyRoleId: prev.alterRoleId,
    modifyType: prev.alterType,
    menuAuthorityList: (prev?.menuAuthList || [])?.map((p) => {
      return {
        menuId: p.menuId,
        useAuthority: p.useAuth,
        empowerAuthority: p.empowerAuth,
        functionAuthorityList: p?.functionAuthList?.map((q) => ({
          functionId: q.functionId,
          useAuthority: q.useAuth,
        })),
      };
    }),
  };
  return data;
};

export const parseMeunData = (prev: MenuInfoResTypeIDTO): MenuInfoResType => {
  const data: MenuInfoResType = {
    menuName: prev.menuName,
    parentMenuId: prev.parentMenuId,
    menuId: prev.menuId,
    menuUrl: prev.menuUrl,
    functionList: (prev?.functionList ?? [])?.map((p) => ({
      functionId: p.functionId,
      functionDescrip: p.functionDescription,
      functionName: p.functionName,
    })),
  };
  return data;
};

// 交易树查询
export const parseQueryTradeAccountParam = (
  prev: TradeAccountTreeParams
): TradeAccountTreeParamsIDTO => {
  const data: TradeAccountTreeParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev?.filterCondition
      ? {
          accountCode: prev?.filterCondition?.acctCode,
          accountName: prev?.filterCondition?.acctName,
          marketId: prev?.filterCondition?.marketId,
          tradeSystemId: prev?.filterCondition?.extSysId,
        }
      : undefined,
  };
  return data;
};
export const parseQueryTradeAccountTreeData = (
  prev: AccountTreeItemIDTO
): AccountTreeItem => {
  const data: AccountTreeItem = {
    bookLevelName: prev?.bookLevelName,
    bookLevel: prev?.bookLevel,
    acctCode: prev?.accountCode,
    acctName: prev?.accountName,
    marketId: prev?.marketId,
    parentAcctCode: prev?.parentAccountCode,
    extSysId: prev?.tradeSystemId,
  };
  return data;
};

// 账户树查询
export const parseQueryManageAccountParam = (
  prev: ManageAccountTreeParams
): ManageAccountTreeParamsIDTO => {
  const data: ManageAccountTreeParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev?.filterCondition
      ? {
          accountCode: prev?.filterCondition?.acctCode,
          accountName: prev?.filterCondition?.acctName,
          tradeSystemId: prev?.filterCondition?.extSysId,
        }
      : undefined,
  };
  return data;
};

export const parseQueryManageAccountTreeData = (
  prev: ManageAccountTreeItemIDTO
): AccountTreeItem => {
  const data: AccountTreeItem = {
    bookLevelName: prev?.bookLevelName,
    bookLevel: prev?.bookLevel,
    acctCode: prev?.accountCode,
    acctName: prev?.accountName,
    parentAcctCode: prev?.parentAccountCode,
    extSysId: prev?.tradeSystemId,
  };
  return data;
};
export const parseHighestManageAccountData = (
  prev: HighestManageAccountIDTO
): AccountPermissionsDataParam => {
  const data: AccountPermissionsDataParam = {
    bookLevel: prev?.bookLevel,
    acctCode: prev?.accountCode,
    acctName: prev?.accountName,
    extSysId: prev?.tradeSystemId,
    extSysName: prev?.tradeSystemName,
  };
  return data;
};
