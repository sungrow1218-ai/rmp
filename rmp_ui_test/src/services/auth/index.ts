import request, { parseRequest, parseRequestByPage } from '@/utils/request';
import { type RequestParameterPagination } from '../typing';

export interface LoginParamType {
  /**
   * 用户名：自有员工工号
   */
  userName: string;
  /**
   * 用户密码
   */
  password: string;
}

export interface LoginResponseDataType {
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

export interface RoleItemType {
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
export async function userLogin(params: LoginParamType) {
  // 调用request发送请求
  /* 前端请求的 /api/auth/login 实际上是通过 代理 转发到后端服务的，配置文件在config\proxy.ts ，这样，前端请求 /api/auth/login 会被代理到 http://localhost:8080/auth/login */
  return parseRequest<LoginResponseDataType>(
    request(`/aegis/api/authority/login`, {
      method: 'POST',
      data: params,
    })
  );
}

/**
 * 用户登出
 */
export async function userLogout() {
  return parseRequest<LogoutResponseDataType>(
    request(`/aegis/api/authority/logout`, {
      method: 'GET',
    })
  );
}

/**
 * token 校验
 */
export async function validateToken() {
  return parseRequest<ValidateTokenResponseDataType>(
    request(`/aegis/api/authority/validate`, {
      method: 'GET',
    })
  );
}

/**
 * 获取用户信息
 */
export async function userInfo() {
  return parseRequest<UserInfoResponseDataType>(
    request(`/aegis/api/authority/userInfo`, {
      method: 'GET',
    })
  );
}

/**
 * 用户角色列表
 */
export async function getUserRoles(params: RequestParameterPagination) {
  return parseRequestByPage<RoleItemType>(
    request(`/aegis/api/authority/queryUserRoles`, {
      method: 'POST',
      data: params,
    })
  );
}

/**
 * 当前登录用户的角色列表
 */
export async function getCurrentUserRoles(params: RequestParameterPagination) {
  return parseRequestByPage<RoleItemType>(
    request(`/aegis/api/authority/queryUserRolesByLoginUserId`, {
      method: 'POST',
      data: params,
    })
  );
}
