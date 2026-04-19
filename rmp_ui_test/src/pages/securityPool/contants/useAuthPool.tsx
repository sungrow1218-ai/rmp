import useMenuInfo from '@/hooks/useMenuInfo';
import useAuthState from '@/hooks/useAuthState';
import { SobIdList, useSobInfo } from './useSobInfo';
import { useAuthHook } from '@/hooks/useAuthhook';

export type FunAuthType = {
  editAuth: boolean;
  queryAuth: boolean;
  workGroupAuth: SobIdList[];
};

export const usePoolAuthHook = () => {
  const { menuAuth } = useAuthHook();
  const authList = menuAuth ? menuAuth.functionAuthList : [];
  const editAuth =
    authList?.find((item) => item.functionId === 1)?.useAuth === 1;
  const queryAuth =
    authList?.find((item) => item.functionId === 2)?.useAuth === 1;
  return {
    editAuth,
    queryAuth,
  };
};
