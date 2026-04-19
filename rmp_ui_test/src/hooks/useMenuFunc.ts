import { useContext } from 'react';
import { MenuFuncContext } from '@/wrappers/MenuFunc';

const useUserRoles = () => {
  const ctxValue = useContext(MenuFuncContext);

  return ctxValue;
};

export default useUserRoles;
