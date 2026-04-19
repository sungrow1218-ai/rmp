import {
  userInfo as getUserInfo,
  type UserInfoResponseDataType,
} from '@/services/auth/index';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfoResponseDataType>();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const { code, message: errMessage, data } = await getUserInfo();
        if (code !== 0) {
          throw new Error(errMessage);
        }
        setUserInfo(data);
      } catch (error) {}
    }
    fetchUserInfo();
  }, []);

  return userInfo;
};

export default useUserInfo;
