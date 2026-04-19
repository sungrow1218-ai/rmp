import { useState, useEffect } from 'react';
import type { ReactFragment, ReactPortal } from 'react';
import { setUUID } from '@ht/xlog';
import { message } from '@ht/sprite-ui';
import {
  getAccessToken,
  isEip,
  redirectToLogin,
  removeAccessToken,
} from '@/utils/utils';
import { validateToken } from '@/services/auth/index';

const ValidateStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
};

const LoginStatusCheckPoint = (props: {
  children: boolean | ReactFragment | ReactPortal | null | undefined;
}) => {
  const [validateStatus, setValidateStatus] = useState(ValidateStatus.PENDING);
  const token = getAccessToken();

  useEffect(() => {
    async function checkTokenValidity() {
      const result = await validateToken();
      if (result.code === 0) {
        setValidateStatus(ValidateStatus.SUCCESS);
        /** 将 xlog 的 uuid 调整为当前登录人的工号 */
        setUUID(result?.data);
      } else {
        message.warning({ content: '当前登录 token 已失效，请重新登录' });
        // 设置校验状态
        setValidateStatus(ValidateStatus.FAIL);
        // 删除 cookie 中的 token
        removeAccessToken();
        // 重定向到登录页
        redirectToLogin();
      }
    }

    if (token) {
      checkTokenValidity();
    }
  }, [token]);

  // 直接访问 并且 risk-manage-token不存在
  if (!isEip() && !getAccessToken()) {
    redirectToLogin();
    return null;
  }

  if (!isEip() && validateStatus !== ValidateStatus.SUCCESS) {
    return null;
  }

  return props.children;
};

export default LoginStatusCheckPoint;
