import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import {
  RequestParameterPagination,
  ResponseParameterPagination,
  type CommonResponseWrapper,
} from '../typing';
import {
  RoleBaseInfoResState,
  RolePermissonProps,
  AlterCommonParams,
  AllAuthorityDataProps,
  MenuAuthListParamType,
  RoleFunctionAuthorityResType,
  RoleUsersState,
  AlterRoleBaseInfoParams,
  AccountPermissionsDataParam,
  AlterRoleUsersParams,
  MenuInfoResType,
  ExternSystemState,
  RiskDataAuthListState,
  SpecDatAuthListProps,
  AccountAuthorityDataProps,
  AccountTreeItem,
} from '@/pages/roleManage/contant/typing';
import { PaginationType } from '@/components/Pagination/Pagination';
import {
  parseAllAuthority,
  parseAlterCommonParams,
  parseAlterRoleAccountAuthority,
  parseAlterRoleBaseInfo,
  parseHighestManageAccountData,
  parseMeunData,
  parseQueryManageAccountParam,
  parseQueryManageAccountTreeData,
  parseQueryTradeAccountParam,
  parseQueryTradeAccountTreeData,
  parseRoleBaseInfo,
} from './parse';
import {
  AccountTreeItemIDTO,
  AllAuthorityDataPropsIDTO,
  ExternSystemStateIDTO,
  HighestManageAccountIDTO,
  ManageAccountTreeItemIDTO,
  MenuInfoResTypeIDTO,
  RoleBaseInfoResStateIDTO,
} from './Idto';
import { AlterRoleAccountAuthorityDTO } from './dto';
import {
  parseQueryExternSystemData,
  parseQueryTradeAccountData,
} from '../account/parse';

/**
 * 角色管理-角色基本信息查询
 */
export async function queryRoleBaseInfo(
  param: {
    filterCondition?: RolePermissonProps;
  } & PaginationType
) {
  return parseRequestByPage<RoleBaseInfoResStateIDTO, RoleBaseInfoResState>(
    request(`/aegis/api/authority/queryRoleBaseInformation`, {
      method: 'post',
      data: param,
    }),
    parseRoleBaseInfo
  );
}
/**
 * 角色管理-角色所有权限查询
 */
export async function queryRoleAllAuthority(params: { queryRoleId: number }) {
  return parseRequestByPage<AllAuthorityDataPropsIDTO, AllAuthorityDataProps>(
    request(`/aegis/api/authority/queryRoleAuthority`, {
      method: 'get',
      params,
    }),
    parseAllAuthority
  );
}
// export async function queryRoleAllAuthority(params: { queryRoleId: number }) {
//   return request(`/api/auth/queryRoleAuthority`, {
//     method: 'get',
//     params,
//   });
// }
/**
 * 角色管理-角色风控数据权限查询
 */
export async function queryRoleRiskDataAuthority(
  param: {
    filterCondition: RolePermissonProps;
  } & PaginationType
) {
  return request<
    CommonResponseWrapper<
      {
        resultList: Omit<AllAuthorityDataProps, 'menuAuthList'>[];
      } & ResponseParameterPagination
    >
  >(`/api/auth/queryRoleRiskDataAuthority`, {
    method: 'post',
    data: param,
  });
}
/**
 * 角色管理-角色账户权限查询
 */
export async function queryRoleAccountAuthority(
  param: {
    filterCondition: { queryRoleId: number; extSysId?: number[] };
  } & PaginationType
) {
  return request<
    CommonResponseWrapper<
      {
        resultList: AccountAuthorityDataProps[];
      } & ResponseParameterPagination
    >
  >(`/api/auth/queryRoleAccountAuthority`, {
    method: 'post',
    data: param,
  });
}
/**
 * 角色管理-角色绑定用户查询
 */
export async function queryRoleUsers(
  param: {
    filterCondition?: RolePermissonProps;
  } & PaginationType
) {
  return parseRequest<
    {
      resultList: RoleUsersState[];
    } & ResponseParameterPagination
  >(
    request(`/aegis/api/authority/queryRoleUsers`, {
      method: 'post',
      data: param,
    })
  );
}
/**
 * 角色管理-角色基本信息设置
 */
export async function alterRoleBaseInfo(param: AlterRoleBaseInfoParams) {
  return parseRequest<any>(
    request(`/aegis/api/authority/modifyRoleBaseInformation`, {
      method: 'post',
      data: parseAlterRoleBaseInfo(param),
    })
  );
}
/**
 * 角色管理-角色功能权限设置
 */

export type AlterFunAuParams = AlterCommonParams & {
  menuAuthList: MenuAuthListParamType[];
};
export async function alterRoleFunctionAuthority(param: AlterFunAuParams) {
  return parseRequest<any>(
    request(`/aegis/api/authority/modifyRoleFunctionAuthority`, {
      method: 'post',
      data: parseAlterCommonParams(param),
    })
  );
}
/**
 * 角色管理-角色风控数据权限设置
 */
export async function alterRoleRiskDataAuthority(
  param: AlterCommonParams & {
    specDataAuthList: SpecDatAuthListProps[];
    riskDataAuthList: RiskDataAuthListState[];
  }
) {
  return request<CommonResponseWrapper<any>>(
    `/api/auth/alterRoleRiskDataAuthority`,
    {
      method: 'post',
      data: param,
    }
  );
}

export interface AcctAuthItem {
  extSysId: number;
  bookLevel: number;
  bookType: number;
  acctCode: string;
  marketId: number;
}

/**
 * 角色管理-角色账户权限设置
 */
export async function alterRoleAccountAuthority(
  param: AlterRoleAccountAuthorityDTO
) {
  return parseRequest(
    request(`/aegis/api/authority/modifyRoleAccountAuthority`, {
      method: 'post',
      data: parseAlterRoleAccountAuthority(param),
    })
  );
}
/**
 * 角色管理-角色绑定用户设置
 */
export async function alterRoleUsers(param: AlterRoleUsersParams) {
  return parseRequest<any>(
    request(`/aegis/api/authority/modifyRoleUsers`, {
      method: 'post',
      data: {
        modifyType: param.alterType,
        roleUserList: param.roleUserList,
      },
    })
  );
}
/**
 * 角色管理-请求菜单信息
 */
export async function queryMenuInfo(
  param: {
    filterCondition?: {
      menuId?: number;
      menuName?: string;
      parentMenuId?: number;
    };
  } & PaginationType
) {
  return parseRequestByPage<MenuInfoResTypeIDTO, MenuInfoResType>(
    request(`/aegis/api/ops/queryMenuInfo`, {
      method: 'post',
      data: param,
    }),
    parseMeunData
  );
}

type HighestManageAccountParams = {
  filterCondition?: {
    extSysId?: number[];
  };
} & ResponseParameterPagination;
/**
 * 角色管理-查询系统号名下账户
 */
export async function queryHighestManageAccount(
  params: HighestManageAccountParams
) {
  return parseRequestByPage<
    HighestManageAccountIDTO,
    AccountPermissionsDataParam
  >(
    request(`/aegis/api/account/queryHighestManageAccount `, {
      method: 'post',
      data: {
        data: {
          pageId: params.pageId,
          pageSize: params.pageSize,
          filterCondition: params?.filterCondition
            ? {
                tradeSystemId: params?.filterCondition.extSysId,
              }
            : undefined,
        },
      },
    }),
    parseHighestManageAccountData
  );
}
/**
 * 角色管理-查询所有系统号
 */
export async function queryExternSystem(
  params: PaginationType & {
    authFlag: number;
    filterCondition?: RolePermissonProps;
  }
) {
  return parseRequestByPage<ExternSystemStateIDTO, ExternSystemState>(
    request(`/aegis/api/ops/queryTradeSystem`, {
      method: 'post',
      data: {
        pageId: params.pageId,
        pageSize: params.pageSize,
        authorityFlag: params.authFlag,
        filterCondition: params?.filterCondition
          ? {
              tradeSystemId: params?.filterCondition.extSysId,
              sobId: params?.filterCondition.sobId,
            }
          : undefined,
      },
    }),
    parseQueryExternSystemData
  );
}

export type TradeAccountTreeParams = {
  filterCondition: {
    acctCode?: string;
    acctName?: string;
    marketId?: number[];
    extSysId?: number[];
  };
} & RequestParameterPagination;

/**
 * 账户查询接口-交易账户树查询
 */
export const queryTradeAccountTree = async (param: TradeAccountTreeParams) =>
  parseRequestByPage<AccountTreeItemIDTO, AccountTreeItem>(
    request(`/aegis/api/account/queryTradeAccountTree`, {
      method: 'post',
      data: parseQueryTradeAccountParam(param),
    }),
    parseQueryTradeAccountTreeData
  );

export type ManageAccountTreeParams = {
  filterCondition?: {
    acctCode?: string;
    acctName?: string;
    extSysId?: number[];
  };
} & RequestParameterPagination;

/**
 * 账户查询接口-管理账户查询
 */
export const queryManageAccountTree = async (param: ManageAccountTreeParams) =>
  parseRequestByPage<ManageAccountTreeItemIDTO, AccountTreeItem>(
    request(`/aegis/api/account/queryManageAccountTree`, {
      method: 'post',
      data: parseQueryManageAccountParam(param),
    }),
    parseQueryManageAccountTreeData
  );

/**
 * 角色管理-设置角色工作台权限
 */
export async function alterRoleWorkGroupAuthority(param: {
  alterRoleId: number;
  workGroupAuthList: number[];
}) {
  return parseRequest<any>(
    request(`/aegis/api/authority/modifyRoleWorkGroupAuthority`, {
      method: 'post',
      data: {
        modifyRoleId: param.alterRoleId,
        workGroupAuthList: param.workGroupAuthList,
      },
    })
  );
}
