import { AllAuthorityDataProps } from '@/pages/roleManage/contant/typing';
import { useState, useEffect } from 'react';

let subscriptions: any[] = [];
let state: AllAuthorityDataProps | null = {
  roleId: 0,
  menuAuthList: [],
  acctAuthList: [],
  specDataAuthList: [],
  riskDataAuthList: [],
  workGroupAuthList: [],
};

const setAuthState = (newState: AllAuthorityDataProps | null) => {
  if (newState) {
    state = { ...newState };
  } else {
    state = null;
  }
  subscriptions.forEach((subscription) => {
    subscription(state);
  });
};

const useAuthState = () => {
  const [authData, setSharedState] = useState(state);

  useEffect(() => {
    // 添加订阅函数
    const updateState = (newState: AllAuthorityDataProps) => {
      setSharedState(newState);
    };
    subscriptions.push(updateState);

    // 初始同步状态
    setSharedState(state);

    // 组件卸载时取消订阅
    return () => {
      subscriptions = subscriptions.filter((sub) => sub !== updateState);
    };
  }, []);

  return [authData, setAuthState] as const;
};

export default useAuthState;
