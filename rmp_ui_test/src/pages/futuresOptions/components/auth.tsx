import { useAuthHook } from '@/hooks/useAuthhook';

export type FunAuthType = {
  editAuth: boolean;
  queryAuth: boolean;
};

export const useFuturAuthHook = () => {
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
