import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  getAccessToken,
  isEip,
  redirectToLogin,
  removeAccessToken,
} from '@/utils/utils';
import { validateToken } from '@/services/auth';

const ValidateStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
} as const;

type ValidateStatusType = typeof ValidateStatus[keyof typeof ValidateStatus];

interface LoginStatusCheckPointProps {
  children: React.ReactNode;
}

const LoginStatusCheckPoint: React.FC<LoginStatusCheckPointProps> = ({ children }) => {
  const [validateStatus, setValidateStatus] = useState<ValidateStatusType>(ValidateStatus.PENDING);
  const token = getAccessToken();

  useEffect(() => {
    console.log('🔍 LoginStatusCheckPoint: useEffect执行，token:', token);
    console.log('🔍 当前URL:', window.location.href);

    async function checkTokenValidity() {
      console.log('🔍 开始验证Token...');
      try {
        const result = await validateToken();
        console.log('🔍 Token验证结果:', result);

        // 检查错误码，支持Aegis格式（errorId）和普通格式（code）
        const errorCode = (result as any).errorId ?? result.code;
        if (errorCode === 0) {
          console.log('🔍 Token验证成功');
          setValidateStatus(ValidateStatus.SUCCESS);
          // 这里可以设置 xlog 的 uuid 为当前登录人的工号
          // setUUID(result?.data);
        } else {
          const errorMessage = (result as any).errorMessage || result.message || 'Token验证失败';
          console.error('🔍 Token验证失败:', errorCode, errorMessage);
          message.warning({ content: '当前登录 token 已失效，请重新登录' });
          // 设置校验状态
          setValidateStatus(ValidateStatus.FAIL);
          // 删除 cookie 中的 token
          removeAccessToken();
          // 重定向到登录页
          redirectToLogin();
        }
      } catch (error) {
        console.error('🔍 Token验证异常:', error);
        message.warning({ content: 'Token 验证失败，请重新登录' });
        setValidateStatus(ValidateStatus.FAIL);
        removeAccessToken();
        redirectToLogin();
      }
    }

    if (token) {
      checkTokenValidity();
    } else {
      console.log('🔍 没有token，重定向到登录页');
      // 没有 token，直接重定向到登录页
      if (!isEip()) {
        redirectToLogin();
      }
    }
  }, [token]);

  // 直接访问 并且 risk-manage-token不存在
  // 排除登录页面，避免无限重定向
  const isLoginPage = window.location.hash === '#/login' || window.location.pathname.includes('/login');
  if (!isEip() && !getAccessToken() && !isLoginPage) {
    redirectToLogin();
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isEip() && validateStatus !== ValidateStatus.SUCCESS) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-blue-500 text-lg mb-2">验证登录状态中...</div>
          <div className="text-gray-600">请稍候</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoginStatusCheckPoint;