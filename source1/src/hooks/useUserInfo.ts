import { useState, useEffect, useCallback } from 'react';
import { userInfo } from '@/services/auth/index';
import { UserInfoResponseDataType } from '@/services/auth/index';

/**
 * 用户信息Hook
 * 用于获取和缓存当前登录用户的信息
 */
export const useUserInfo = () => {
  const [userData, setUserData] = useState<UserInfoResponseDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await userInfo();

      if (result.code === 0) {
        setUserData(result.data);
      } else {
        setError(result.message || '获取用户信息失败');
      }
    } catch (err: any) {
      console.error('获取用户信息异常:', err);
      setError(err.message || '网络请求失败');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 刷新用户信息
   */
  const refresh = useCallback(() => {
    return fetchUserInfo();
  }, [fetchUserInfo]);

  // 组件挂载时自动获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return {
    /** 用户信息数据 */
    userData,
    /** 是否正在加载 */
    loading,
    /** 错误信息 */
    error,
    /** 刷新用户信息 */
    refresh,
    /** 用户姓名 */
    displayName: userData?.displayName || '',
    /** 用户部门 */
    department: userData?.department || '',
    /** 用户邮箱 */
    email: userData?.mail || '',
    /** 用户手机号 */
    mobile: userData?.mobile || '',
  };
};