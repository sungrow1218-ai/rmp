import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { useResetState } from 'ahooks';
import {
  AllAuthorityDataProps,
  RoleBaseInfoResState,
} from '@/pages/roleManage/contant/typing';
import { queryRoleAllAuthority } from '@/services/roleManage';

interface SelectItemType {
  selectedItem?: any;
  setSelectedItem: (
    selectItem?: RoleBaseInfoResState & { key: string }
  ) => void;
  roleList?: any[];
  setRoleList: (roleList?: any[]) => void;
  authState?: AllAuthorityDataProps;
  updateDataFun?: () => void;
  updateFunCur?: () => void;
  refreshAuthState: () => void;
}

export const ListContext = createContext<SelectItemType>({
  setSelectedItem: () => {},
  setRoleList: () => {},
  refreshAuthState: () => {},
});

export const MyList: FC<PropsWithChildren> = (props) => {
  const [selectedItem, setSelectedItem] = useResetState<
    (RoleBaseInfoResState & { key: string }) | undefined
  >(undefined);
  const [roleList, setRoleList] = useState<any[] | undefined>([]);

  const [authState, setAuthState] = useState<
    AllAuthorityDataProps | undefined
  >();

  const fetch = async (roleId: number) => {
    try {
      const res = await queryRoleAllAuthority({
        queryRoleId: roleId,
      });
      if (res.code !== 0) {
        throw new Error('获取角色权限失败');
      }
      if (res.data && res.data.resultList.length > 0) {
        const data = res.data.resultList[0];
        setAuthState(data);
      } else {
        setAuthState(undefined);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetch(selectedItem.roleId);
    } else {
      setAuthState(undefined);
    }
  }, [selectedItem]);

  return (
    <ListContext.Provider
      value={{
        setRoleList,
        selectedItem,
        setSelectedItem,
        roleList,
        authState,
        refreshAuthState: () => selectedItem && fetch(selectedItem.roleId),
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};
