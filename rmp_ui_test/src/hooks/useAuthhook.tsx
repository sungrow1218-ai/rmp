import useMenuInfo from '@/hooks/useMenuInfo';
import useAuthState from '@/hooks/useAuthState';
import { useEffect, useRef, useState } from 'react';
import { MenuAuthListParamType } from '@/pages/roleManage/contant/typing';

export const useAuthHook = () => {
  const haveMenu = useRef(false);
  const menuInfo = useMenuInfo();
  const [crtixAuth, setCrtixAuth] = useState<MenuAuthListParamType | null>(
    null
  );
  const [authData, _] = useAuthState();

  useEffect(() => {
    if (!!menuInfo && !haveMenu.current && authData?.menuAuthList.length) {
      const menuAuth =
        authData?.menuAuthList?.find(
          (p: any) => p.menuId === menuInfo?.menuId
        ) ?? null;
      setCrtixAuth(menuAuth);
      haveMenu.current = true;
    }
  }, [menuInfo, authData]);
  const workGroupAuth = authData?.workGroupAuthList ?? [];
  return { menuAuth: crtixAuth, workGroupAuth };
};
