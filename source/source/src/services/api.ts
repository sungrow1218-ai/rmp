// API服务层
// 根据RMP系统接口规范实现，参考rmp_ui_test项目

// 导入 request.ts 中的 extendOptions 和 globalConfig
import { extendOptions, globalConfig } from '../utils/request';
// 导入规则模板类型
import type { RuleTemplateIDTO } from './ruleTemplateTypes';

// 全局配置 - 现在使用 request.ts 中的配置

// 通用响应格式（参考rmp_ui_test/src/services/typing.ts）
export interface CommonResponseWrapper<T = any> {
  code: number;      // 响应码，0表示成功
  message: string;   // 响应消息
  data: T;          // 响应数据
}

export interface CommonResponseIWrapper<T = any> {
  code: number;      // 响应编码
  errorId: number;   // 错误ID
  message: string;   // 信息
  errorMessage: string; // 错误信息
  data: T;          // 业务响应数据
}

// 分页请求参数
export interface RequestParameterPagination {
  pageId?: number;   // 页码
  pageSize?: number; // 每页大小
  authFlag?: number; // 权限标志
}

export interface RequestParameterPaginationIDTO {
  pageId?: number;   // 页码
  pageSize?: number; // 每页大小
  authorityFlag?: number; // 权限标志
}

export interface ResponseParameterPagination {
  pageId: number;    // 当前页码
  pageSize: number;  // 分页大小
  totalSize: number; // 查询总数
}

// 菜单相关类型
export interface FunctionItemType {
  functionId: number;      // 功能ID
  functionName: string;    // 功能名称
  functionDescrip: string; // 功能描述
}

export interface MenuItemType {
  menuId: number;          // 菜单ID
  menuName: string;        // 菜单名称
  parentMenuId?: number;   // 父菜单ID
  menuUrl: string;         // 菜单路径
  functionList: FunctionItemType[]; // 功能列表
}

export interface MenuResponseDataType extends ResponseParameterPagination {
  resultList: MenuItemType[];
}

// 工作台相关类型
export interface WorkGroupList {
  workGroupId: number;    // 工作台ID
  workGroupName: string;  // 工作台名称
  sobId: number;          // 账套ID
}

export interface WorkGroupResponse extends ResponseParameterPagination {
  resultList: WorkGroupList[];
}

// 用户角色相关类型
export interface RoleItemType {
  roleId: number;        // 角色编号
  roleName: string;      // 角色名称
  roleRemark: string;    // 角色描述
  createUserNo: string;  // 创建用户编号
  updateUserNo: string;  // 更新用户编号
  createDateTime: number; // 创建日期时间
  lastUpdateTime: number; // 最近刷新时间
}

export interface UserRolesResponseDataType extends ResponseParameterPagination {
  resultList: RoleItemType[];
}

// 用户信息类型
export interface UserInfoResponseDataType {
  displayName: string;   // 姓名
  department?: string;   // 归属部门名称
  mail?: string;         // 邮箱
  mobile?: string;       // 手机号
}

// 登录参数类型
export interface LoginParamType {
  userName: string;      // 用户名：自有员工工号
  password: string;      // 用户密码
}

export interface LoginResponseDataType {
  token: string;         // 用户后续请求的认证token
}

// 自定义错误码
enum CustomCode {
  NO_AUTH = 30000,
  TOKEN_EXPIRED = 90005,
}

// 修改类型枚举
export enum ModifyTypeEnum {
  ADD = 1,     // 新增
  EDIT = 2,    // 编辑
  DELETE = 3,  // 删除
  VIEW = 4,    // 查看
}

// 修改账户组参数类型
export interface ModifyAccountGroupParams {
  modifyType: ModifyTypeEnum;       // 修改类型
  accountGroupId?: number;          // 账户组ID（编辑时必填）
  accountGroupName: string;         // 账户组名称
  bookType: string;                 // 账户类型编码
  bookLevel: string;                // 账户层级编码
  workGroupId: number;              // 工作台ID
  remark?: string;                  // 备注
}

// 简单的fetch请求封装，参考rmp_ui_test的配置
const API_BASE_URL = '/rmp';
const API_TIMEOUT = 180000; // 3分钟，与rmp_ui_test一致

// 请求拦截器
const requestInterceptor = (config: any) => {
  // 从全局配置中获取headers
  const globalHeaders = globalConfig.headers || {};

  // 合并headers：全局headers优先，然后config.headers
  const headers = {
    'Content-Type': 'application/json',
    ...globalHeaders,
    ...config.headers,
  };

  return {
    ...config,
    headers,
    credentials: 'include', // 包含cookie，与rmp_ui_test一致
  };
};

// 响应拦截器
const responseInterceptor = async (response: Response) => {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data: any = {};
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        console.warn('解析响应JSON失败:', e);
        // 即使解析失败，也返回一个结构化的错误响应
        return {
          code: -1,
          errorId: -1,
          message: '解析响应数据失败',
          errorMessage: '解析响应数据失败',
          data: null,
        };
      }
    } else {
      const text = await response.text();
      console.warn('收到非JSON响应:', text);
      // 对于非JSON响应，返回一个结构化的错误
      return {
        code: -1,
        errorId: -1,
        message: `服务器返回非JSON格式数据: ${text.substring(0, 100)}`,
        errorMessage: `服务器返回非JSON格式数据: ${text.substring(0, 100)}`,
        data: null,
      };
    }

    console.log('🔍 [responseInterceptor] 原始响应数据:', data);
    console.log('🔍 [responseInterceptor] 响应URL:', response.url);
    console.log('🔍 [responseInterceptor] 响应状态:', response.status, response.statusText);

    // 检查是否是aegis接口
    const isAegis = response.url.includes('/rmp/aegis/api');
    console.log('🔍 [responseInterceptor] 是否是aegis接口:', isAegis);

    if (isAegis) {
      // aegis接口使用errorId和errorMessage
      console.log('🔍 [responseInterceptor] aegis接口数据:', {
        errorId: data.errorId,
        errorMessage: data.errorMessage,
        hasData: !!data.data,
        data: data.data
      });

      if (data.errorId === undefined) {
        console.warn('接口返回数据格式异常 (无errorId):', data);
        // 对于格式异常的数据，返回一个结构化的响应
        return {
          code: -1,
          errorId: -1,
          message: '接口返回数据格式异常',
          errorMessage: '接口返回数据格式异常',
          data: data,
        };
      }

      if (data.errorId !== undefined && data.errorId !== 0 && data.errorId !== 145003) {
        // 返回错误信息，但不抛出异常，让调用者处理
        return {
          code: data.errorId,
          errorId: data.errorId,
          message: data.errorMessage || '请求失败',
          errorMessage: data.errorMessage || '请求失败',
          data: data.data,
        };
      }

      // token过期处理
      if (data.errorId === CustomCode.TOKEN_EXPIRED) {
        // 跳转到登录页
        window.location.href = '/login';
        return {
          code: data.errorId,
          errorId: data.errorId,
          message: '登录已过期，请重新登录',
          errorMessage: '登录已过期，请重新登录',
          data: null,
        };
      }

      return {
        code: data.errorId,
        errorId: data.errorId,
        message: data.errorMessage,
        errorMessage: data.errorMessage,
        data: data.data,
      };
    } else {
      // 普通接口使用code和message
      console.log('🔍 [responseInterceptor] 普通接口数据:', {
        code: data.code,
        message: data.message,
        hasData: !!data.data,
        data: data.data
      });

      if (data.code === undefined) {
        console.warn('接口返回数据格式异常 (无code):', data);
        return {
          code: -1,
          errorId: -1,
          message: '接口返回数据格式异常',
          errorMessage: '接口返回数据格式异常',
          data: data,
        };
      }

      if (data.code !== undefined && data.code !== 0 && data.code !== 145003) {
        return {
          code: data.code,
          errorId: data.code,
          message: data.message || '请求失败',
          errorMessage: data.message || '请求失败',
          data: data.data,
        };
      }

      // token过期处理
      if (data.code === CustomCode.TOKEN_EXPIRED) {
        // 跳转到登录页
        window.location.href = '/login';
        return {
          code: data.code,
          errorId: data.code,
          message: '登录已过期，请重新登录',
          errorMessage: '登录已过期，请重新登录',
          data: null,
        };
      }

      return {
        code: data.code,
        errorId: data.code,
        message: data.message,
        errorMessage: data.message,
        data: data.data,
      };
    }
  } catch (error: any) {
    console.error('响应拦截器异常:', error);
    // 返回一个结构化的错误响应，避免抛出未捕获的异常
    return {
      code: -1,
      errorId: -1,
      message: error.message || '响应处理失败',
      errorMessage: error.message || '响应处理失败',
      data: null,
    };
  }
};

// 通用请求方法
const request = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<CommonResponseIWrapper<T>> => {
  try {
    const config = requestInterceptor({
      ...options,
      url,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return await responseInterceptor(response);
  } catch (error) {
    console.error('API请求失败:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接');
    }
    throw error;
  }
};

// 分页请求方法
const requestByPage = async <T = any>(
  url: string,
  data: any,
  options: RequestInit = {}
): Promise<CommonResponseIWrapper<{ resultList: T[] } & ResponseParameterPagination>> => {
  console.log('🔍 [requestByPage] 请求URL:', url);
  console.log('🔍 [requestByPage] 请求数据:', JSON.stringify(data, null, 2));
  return request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

// 字段转换函数（全量）- 参考rmp_ui_test/src/utils/request.ts
export const parseRequest = <T, S = T>(
  requestPromise: Promise<CommonResponseIWrapper<T>>,
  parseFn?: (prev: T) => S
): Promise<CommonResponseIWrapper<S>> =>
  requestPromise.then(
    ({ data, code, errorId, message, errorMessage }) =>
      ({
        code: errorId ?? code,
        message: errorMessage || message,
        data: parseFn && data ? parseFn(data) : data,
      } as CommonResponseIWrapper<S>)
  );

// 字段转换函数（分页）- 参考rmp_ui_test/src/utils/request.ts
export const parseRequestByPage = <T, S = T>(
  requestPromise: Promise<
    CommonResponseIWrapper<{ resultList: T[] } & ResponseParameterPagination>
  >,
  parseFn?: (prev: T) => S
): Promise<
  CommonResponseIWrapper<{ resultList: S[] } & ResponseParameterPagination>
> =>
  requestPromise.then(
    ({ data, code, errorId, message, errorMessage }) =>
      ({
        code: errorId ?? code,
        message: errorMessage || message,
        data: {
          ...(data || {}),
          resultList: (data?.resultList || []).map((i) =>
            parseFn ? parseFn(i) : i
          ),
        },
      } as CommonResponseIWrapper<
        { resultList: S[] } & ResponseParameterPagination
      >)
  );

// 菜单查询API
export const getMenuByRole = async (
  params: RequestParameterPagination
): Promise<CommonResponseWrapper<MenuResponseDataType>> => {
  return requestByPage('/aegis/api/ops/queryRoleMenuInfo', params);
};

// 工作台查询API
export const queryWorkGroup = async (
  params: RequestParameterPagination & {
    authFlag?: number;
    filterCondition?: {
      workGroupId?: number;
      sobId?: number;
    };
  }
): Promise<CommonResponseWrapper<WorkGroupResponse>> => {
  return requestByPage('/aegis/api/ops/queryWorkGroup', {
    pageId: params.pageId,
    pageSize: params.pageSize,
    authorityFlag: params?.authFlag,
    filterCondition: params?.filterCondition
      ? {
          workGroupId: params?.filterCondition?.workGroupId,
          sobId: params?.filterCondition?.sobId,
        }
      : undefined,
  });
};

// 用户登录API
export const userLogin = async (
  params: LoginParamType
): Promise<CommonResponseIWrapper<LoginResponseDataType>> => {
  return request('/aegis/api/authority/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 用户登出API
export const userLogout = async (): Promise<CommonResponseIWrapper<never>> => {
  return request('/aegis/api/authority/logout', {
    method: 'GET',
  });
};

// 用户信息API
export const userInfo = async (): Promise<CommonResponseIWrapper<UserInfoResponseDataType>> => {
  return request('/aegis/api/authority/userInfo', {
    method: 'GET',
  });
};

// 用户角色列表API
export const getUserRoles = async (
  params: RequestParameterPagination
): Promise<CommonResponseWrapper<UserRolesResponseDataType>> => {
  return requestByPage('/authority/queryUserRoles', params);
};

// 当前登录用户角色列表API
export const getCurrentUserRoles = async (
  params: RequestParameterPagination
): Promise<CommonResponseWrapper<UserRolesResponseDataType>> => {
  return requestByPage('/aegis/api/authority/queryUserRolesByLoginUserId', params);
};

// Token校验API
export const validateToken = async (): Promise<CommonResponseIWrapper<string>> => {
  return request('/aegis/api/authority/validate', {
    method: 'GET',
  });
};

// 菜单配置查询API
export const queryMenuConfig = async (
  params: RequestParameterPagination & {
    filterCondition?: {
      menuId?: number;
    }[];
  }
): Promise<CommonResponseIWrapper<any>> => {
  return requestByPage('/aegis/api/ops/queryMenuConfiguration', params);
};

// 用户菜单个性化配置查询API
export const queryUserMenuConfiguration = async (
  params: RequestParameterPagination & {
    filterCondition?: {
      userCode?: string;
      menuId?: number;
    };
  }
): Promise<CommonResponseWrapper<any>> => {
  return requestByPage('/aegis/api/ops/queryUserMenuConfiguration', params);
};

// 修改用户菜单个性化配置API
export const alterUserMenuConfiguration = async (params: {
  userCode: string;
  menuId: number;
  configuration: string;
}): Promise<CommonResponseIWrapper<any>> => {
  return request('/ops/modifyUserMenuConfiguration', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// ==================== 规则模板组相关类型 ====================

// 规则模板组状态枚举
export enum RuleTemplateGroupStatus {
  DISABLE = 0,  // 停用
  ENABLE = 1,   // 启用
}


// 规则模板组接口类型
export interface RuleTemplateGroupIDTO {
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  description?: string;
  workGroupId: number;
  status: number;
  ruleTemplateList: { ruleTemplateId: number; ruleType: string }[];
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

// 规则模板组查询参数
export interface QueryRuleTemplateGroupParams extends RequestParameterPagination {
  authorityFlag?: number;
  filterCondition?: {
    workGroupId?: number;
    ruleTmplGroupId?: number;
    ruleTmplGroupName?: string;
    status?: number;
    createUserCode?: string;
  }[];
}

// 修改规则模板组参数
export interface ModifyRuleTemplateGroupParams {
  modifyType: ModifyTypeEnum;
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  description?: string;
  workGroupId: number;
  status: number;
  modRuleTmplList?: Array<{
    ruleTemplateId: number;
    ruleType: string;
  }>;
  delRuleTmplList?: Array<{
    ruleTemplateId: number;
  }>;
}

// ==================== 账户组管理相关API ====================

// 账户组关联规则模板参数
export interface AccountGroupRelationParams {
  pageId?: number;
  pageSize?: number;
  authorityFlag?: number;
  filterCondition?: {
    workGroupId?: number;
    ruleTmplGroupId?: number[];
    accountGroupId?: number[];
    accountGroupName?: string;
    accountType?: { sobId: number; bookType: number; bookLevel: number };
    status?: number[];
    dataTime?: string;
  };
}

export interface AccountGroupRelationResultList {
  ruleTmplGroupId: number;
  ruleTmplGroupName: string;
  accountGroupId: number;
  accountGroupName: string;
  controlMode: number;
  status: number;
  remark: string;
  createRoleId: number;
  createUserCode: string;
  updateUserCode: string;
  createTime: string;
  lastUpdateTime: string;
}

export interface AccountGroupRelation {
  resultList: AccountGroupRelationResultList[];
  pageId: number;
  pageSize: number;
  totalSize: number;
}

// 查询账户组列表
export const queryAccountGroup = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/queryAccountGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 查询账户组明细列表
export const queryAccountGroupDetail = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/queryAccountGroupDetail', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 添加/编辑账户组
export const alterAccountGroup = async (
  params: ModifyAccountGroupParams
): Promise<CommonResponseIWrapper<any>> => {
  console.log('调用 alterAccountGroup，参数:', params);
  return request('/aegis/api/ruleManager/modifyAccountGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 查询引用的规则列表
export const queryReferenceByRiskRule = async (
  params: { accountGroupId: number }
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/queryReferenceByRiskRule', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 导出账户明细
export const exportAccountGroupDetail = async (
  params: { acctGroupId: number }
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/exportAccountGroupDetail', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 设置账户组明细
export const alterAccountGroupDetail = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/modifyAccountGroupDetail', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 查询账户组关联规则模板
export const queryAccountGroupRelation = async (
  params: AccountGroupRelationParams
): Promise<CommonResponseIWrapper<AccountGroupRelation>> => {
  return request('/aegis/api/ruleManager/queryRuleTemplateGroupAccountGroupRelation', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 设置账户组和模板绑定关系
export const modifyAccountGroupRelation = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/modifyRuleTemplateGroupAccountGroupRelation', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// ==================== 规则模板组相关API ====================

// 查询规则模板默认配置
export const queryRuleTemplateDefaultConfiguration = async (
  ruleType: string[]
): Promise<CommonResponseIWrapper<{
  resultList: { configuration: string; ruleType: string }[];
}>> => {
  return request('/aegis/api/ruleManager/queryRuleTemplateDefaultConfiguration', {
    method: 'POST',
    body: JSON.stringify({ ruleType }),
  });
};

// 查询规则模板
export const queryRuleTemplate = async (
  params: {
    pageId?: number;
    pageSize?: number;
    authorityFlag?: number;
    filterCondition?: {
      ruleTmplGroupId?: number;
      ruleType?: string[];
      ruleTemplateId?: number[];
    }[];
  }
): Promise<CommonResponseIWrapper<{
  resultList: RuleTemplateIDTO[];
} & ResponseParameterPagination>> => {
  return request('/aegis/api/ruleManager/queryRuleTemplate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 查询规则模板组列表
export const queryRuleTemplateGroup = async (
  params: QueryRuleTemplateGroupParams
): Promise<CommonResponseIWrapper<{ resultList: RuleTemplateGroupIDTO[] } & ResponseParameterPagination>> => {
  return request('/aegis/api/ruleManager/queryRuleTemplateGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 修改规则模板组
export const modifyRuleTemplateGroup = async (
  params: ModifyRuleTemplateGroupParams
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/modifyRuleTemplateGroup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 修改规则模板
export const modifyRuleTemplate = async (
  params: RequestParameterPaginationIDTO & {
    filterCondition: {
      ruleTmplGroupId: number;
      ruleType: string[];
      ruleTemplateId: number[];
    };
  }
): Promise<CommonResponseIWrapper<any>> => {
  return request('/aegis/api/ruleManager/modifyRuleTemplate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 导出所有API
export const api = {
  // 认证相关
  userLogin,
  userLogout,
  userInfo,
  validateToken,

  // 角色相关
  getUserRoles,
  getCurrentUserRoles,

  // 菜单相关
  getMenuByRole,
  queryMenuConfig,
  queryUserMenuConfiguration,
  alterUserMenuConfiguration,

  // 工作台相关
  queryWorkGroup,

  // 账户组相关
  queryAccountGroup,
  queryAccountGroupDetail,
  alterAccountGroup,
  queryReferenceByRiskRule,
  exportAccountGroupDetail,
  alterAccountGroupDetail,
  queryAccountGroupRelation,
  modifyAccountGroupRelation,

  // 规则模板组相关
  queryRuleTemplateGroup,
  modifyRuleTemplateGroup,
  queryRuleTemplateDefaultConfiguration,
  queryRuleTemplate,
  modifyRuleTemplate,
};

export default api;


