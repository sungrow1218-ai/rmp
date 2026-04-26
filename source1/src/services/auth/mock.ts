/**
 * 模拟认证服务
 * 用于开发环境，不连接真实API
 */

import {
  mockUserLogin,
  mockValidateTokenFunc,
  mockUserInfoFunc,
  mockUserRolesFunc,
} from '@/mocks/auth';
import type {
  LoginParams,
  LoginResponseData,
  UserInfo,
  UserRole,
  PaginationParams,
} from '@/types/auth';

/**
 * 用户登录
 */
export async function userLogin(params: LoginParams) {
  const { userName, password } = params;
  return mockUserLogin(userName, password);
}

/**
 * 用户登出
 */
export async function userLogout() {
  return {
    code: 0,
    message: 'success',
    data: null,
  };
}

/**
 * token 校验
 */
export async function validateToken() {
  // 从 Cookie 获取 token
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('risk-manage-token='))
    ?.split('=')[1];

  if (!token) {
    return {
      code: 90005,
      message: 'Token不存在',
      data: null,
    };
  }

  return mockValidateTokenFunc(token);
}

/**
 * 获取用户信息
 */
export async function userInfo() {
  // 从 Cookie 获取 token
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('risk-manage-token='))
    ?.split('=')[1];

  if (!token) {
    return {
      code: 90005,
      message: 'Token不存在',
      data: null,
    };
  }

  // 从 token 中提取用户名
  const userName = token.replace('mock-token-', '').split('-')[0];
  return mockUserInfoFunc(userName);
}

/**
 * 用户角色列表
 */
export async function getUserRoles(params: PaginationParams) {
  // 从 Cookie 获取 token
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('risk-manage-token='))
    ?.split('=')[1];

  if (!token) {
    return {
      code: 90005,
      message: 'Token不存在',
      data: null,
    };
  }

  // 从 token 中提取用户名
  const userName = token.replace('mock-token-', '').split('-')[0];
  const { pageId = 1, pageSize = 10 } = params;
  return mockUserRolesFunc(userName, pageId, pageSize);
}

/**
 * 当前登录用户的角色列表
 */
export async function getCurrentUserRoles(params: PaginationParams) {
  return getUserRoles(params);
}

// 导出所有模拟函数
export default {
  userLogin,
  userLogout,
  validateToken,
  userInfo,
  getUserRoles,
  getCurrentUserRoles,
};