// API服务层
// 根据RMP系统接口规范实现，参考rmp_ui_test项目

// 导入 request.ts 中的 extendOptions 和 globalConfig
import { extendOptions, globalConfig } from '@/utils/request';

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
    }
  } else {
    const text = await response.text();
    console.warn('收到非JSON响应:', text);
    throw new Error(`服务器返回非JSON格式数据: ${text.substring(0, 100)}`);
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
    }

    if (data.errorId !== undefined && data.errorId !== 0 && data.errorId !== 145003) {
      throw new Error(data.errorMessage || '请求失败');
    }

    // token过期处理
    if (data.errorId === CustomCode.TOKEN_EXPIRED) {
      // 跳转到登录页
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
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
    }

    if (data.code !== undefined && data.code !== 0 && data.code !== 145003) {
      throw new Error(data.message || '请求失败');
    }

    // token过期处理
    if (data.code === CustomCode.TOKEN_EXPIRED) {
      // 跳转到登录页
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
    }

    return {
      code: data.code,
      errorId: data.code,
      message: data.message,
      errorMessage: data.message,
      data: data.data,
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
          sobId: params?.filterCondition?.sobCondition?.sobId,
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
    };
  }
): Promise<CommonResponseIWrapper<any>> => {
  return requestByPage('/ops/queryMenuConfiguration', params);
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
  return requestByPage('/ops/queryUserMenuConfiguration', params);
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
};

export default api;