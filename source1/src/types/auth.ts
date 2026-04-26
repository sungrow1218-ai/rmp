/**
 * 认证相关类型定义
 */

// 登录请求参数
export interface LoginParams {
  userName: string;
  password: string;
}

// 登录响应数据
export interface LoginResponseData {
  token: string;
}

// 用户信息
export interface UserInfo {
  displayName: string;
  department?: string;
  mail?: string;
  mobile?: string;
}

// 用户角色
export interface UserRole {
  roleId: number;
  roleName: string;
  roleRemark: string;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: number;
  lastUpdateTime: number;
}

// 分页参数
export interface PaginationParams {
  pageId?: number;
  pageSize?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  resultList: T[];
  pageId: number;
  pageSize: number;
  totalSize: number;
}

// 通用响应包装器
export interface ResponseWrapper<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应包装器
export interface PaginatedResponseWrapper<T = any> {
  code: number;
  message: string;
  data: PaginatedResponse<T>;
}

// 错误响应
export interface ErrorResponse {
  code: number;
  message: string;
  timestamp?: number;
  path?: string;
}