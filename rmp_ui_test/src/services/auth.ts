import request from '@/utils/request';
import {
  type CommonResponseWrapper,
  type RequestParameterPagination,
  type ResponseParameterPagination,
} from './typing';

interface LoginParamType {
  /**
   * 用户名：自有员工工号
   */
  userName: string;
  /**
   * 用户密码
   */
  password: string;
}

interface LoginResponseDataType {
  /**
   * 用户后续请求的认证 token，保存在 cookie['risk-manage-token'] 中
   */
  token: string;
}

/**
 * token 校验 data 部分直接返回工号
 */
type ValidateTokenResponseDataType = string;

type LogoutResponseDataType = never;

export interface UserInfoResponseDataType {
  /**
   * 姓名
   */
  displayName: string;
  /**
   * 归属部门名称
   */
  department?: string;
  /**
   * 邮箱
   */
  mail?: string;
  /**
   * 手机号
   */
  mobile?: string;
}

interface RoleItemType {
  /**
   * 角色编号
   */
  roleId: number;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 角色描述
   */
  roleRemark: string;
  /**
   * 创建用户编号
   */
  createUserNo: string;
  /**
   * 更新用户编号
   */
  updateUserNo: string;
  /**
   * 创建日期时间
   */
  createDateTime: number;
  /**
   * 最近刷新时间
   */
  lastUpdateTime: number;
}

/**
 * 用户登录
 */
// async：表示这是一个异步函数，内部可以使用 await
export async function userLoginOld(params: LoginParamType) {
  // 调用request发送请求
  /* 前端请求的 /api/auth/login 实际上是通过 代理 转发到后端服务的，配置文件在config\proxy.ts ，这样，前端请求 /api/auth/login 会被代理到 http://localhost:8080/auth/login */
  return request<CommonResponseWrapper<LoginResponseDataType>>(
    `/api/auth/loginOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}

/**
 * 用户登出
 */
export async function userLogoutOld() {
  return request<CommonResponseWrapper<LogoutResponseDataType>>(
    `/api/auth/logoutOld`,
    {
      method: 'GET',
    }
  );
}

/**
 * token 校验
 */
export async function validateTokenOld() {
  return request<CommonResponseWrapper<ValidateTokenResponseDataType>>(
    `/api/auth/validateOld`,
    {
      method: 'GET',
    }
  );
}

/**
 * token 校验
 */
export async function userInfoOld() {
  return request<CommonResponseWrapper<UserInfoResponseDataType>>(
    `/api/auth/userInfoOld`,
    {
      method: 'GET',
    }
  );
}

interface UserRolesResponseDataType extends ResponseParameterPagination {
  resultList: RoleItemType[];
}

/**
 * 用户角色列表
 */
export async function getUserRolesOld(params: RequestParameterPagination) {
  return request<CommonResponseWrapper<UserRolesResponseDataType>>(
    `/api/auth/queryUserRolesOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}

/**
 * 当前登录用户的角色列表
 */
export async function getCurrentUserRolesOld(
  params: RequestParameterPagination
) {
  return request<CommonResponseWrapper<UserRolesResponseDataType>>(
    `/api/auth/queryUserRolesByLoginUserIdOld`,
    {
      method: 'POST',
      data: params,
    }
  );
}
