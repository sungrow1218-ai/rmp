/**
 * 认证相关模拟数据
 */

import { LoginResponseData, UserInfo, UserRole, PaginatedResponse } from '@/types/auth';

// 模拟登录响应
export const mockLoginResponse = (userName: string): LoginResponseData => {
  return {
    token: `mock-token-${userName}-${Date.now()}`,
  };
};

// 模拟用户信息
export const mockUserInfo = (userName: string): UserInfo => {
  const users: Record<string, UserInfo> = {
    'admin': {
      displayName: '管理员',
      department: '风险管理部',
      mail: 'admin@htsc.com',
      mobile: '13800138000',
    },
    'user001': {
      displayName: '张三',
      department: '交易部',
      mail: 'zhangsan@htsc.com',
      mobile: '13800138001',
    },
    'user002': {
      displayName: '李四',
      department: '合规部',
      mail: 'lisi@htsc.com',
      mobile: '13800138002',
    },
  };

  return users[userName] || {
    displayName: userName,
    department: '未知部门',
    mail: `${userName}@htsc.com`,
    mobile: '13800000000',
  };
};

// 模拟用户角色
export const mockUserRoles = (userName: string): PaginatedResponse<UserRole> => {
  const roles: Record<string, UserRole[]> = {
    'admin': [
      {
        roleId: 1,
        roleName: '系统管理员',
        roleRemark: '拥有系统所有权限',
        createUserNo: 'system',
        updateUserNo: 'system',
        createDateTime: 1609459200000,
        lastUpdateTime: 1609459200000,
      },
      {
        roleId: 2,
        roleName: '风险管理员',
        roleRemark: '风险管理相关权限',
        createUserNo: 'system',
        updateUserNo: 'system',
        createDateTime: 1609459200000,
        lastUpdateTime: 1609459200000,
      },
    ],
    'user001': [
      {
        roleId: 3,
        roleName: '交易员',
        roleRemark: '交易相关权限',
        createUserNo: 'system',
        updateUserNo: 'system',
        createDateTime: 1609459200000,
        lastUpdateTime: 1609459200000,
      },
    ],
    'user002': [
      {
        roleId: 4,
        roleName: '合规专员',
        roleRemark: '合规检查相关权限',
        createUserNo: 'system',
        updateUserNo: 'system',
        createDateTime: 1609459200000,
        lastUpdateTime: 1609459200000,
      },
    ],
  };

  return {
    resultList: roles[userName] || [
      {
        roleId: 5,
        roleName: '普通用户',
        roleRemark: '基础查看权限',
        createUserNo: 'system',
        updateUserNo: 'system',
        createDateTime: 1609459200000,
        lastUpdateTime: 1609459200000,
      },
    ],
    pageId: 1,
    pageSize: 10,
    totalSize: roles[userName]?.length || 1,
  };
};

// 模拟Token验证
export const mockValidateToken = (token: string): string => {
  if (token.includes('admin')) return 'admin';
  if (token.includes('user001')) return 'user001';
  if (token.includes('user002')) return 'user002';
  return 'unknown';
};

// 模拟登录函数
export const mockUserLogin = async (userName: string, password: string) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 简单的验证逻辑
  const validUsers = ['admin', 'user001', 'user002'];
  const validPassword = '123456';

  if (validUsers.includes(userName) && password === validPassword) {
    return {
      code: 0,
      message: 'success',
      data: mockLoginResponse(userName),
    };
  } else {
    return {
      code: 1001,
      message: '用户名或密码错误',
      data: null,
    };
  }
};

// 模拟Token验证函数
export const mockValidateTokenFunc = async (token: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (token && token.startsWith('mock-token-')) {
    return {
      code: 0,
      message: 'success',
      data: mockValidateToken(token),
    };
  } else {
    return {
      code: 90005,
      message: 'Token已过期',
      data: null,
    };
  }
};

// 模拟用户信息函数
export const mockUserInfoFunc = async (userName: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    code: 0,
    message: 'success',
    data: mockUserInfo(userName),
  };
};

// 模拟用户角色函数
export const mockUserRolesFunc = async (userName: string, pageId: number = 1, pageSize: number = 10) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const rolesData = mockUserRoles(userName);
  const startIndex = (pageId - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    code: 0,
    message: 'success',
    data: {
      resultList: rolesData.resultList.slice(startIndex, endIndex),
      pageId,
      pageSize,
      totalSize: rolesData.totalSize,
    },
  };
};