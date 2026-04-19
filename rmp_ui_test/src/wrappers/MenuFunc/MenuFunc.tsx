import React, {
  useEffect,
  useReducer,
  type PropsWithChildren,
  type FC,
} from 'react';
import { getMenuByRole, type MenuItemType } from '@/services/menu';
import PageLoading from '@/components/PageLoading';
import { useUserRoles } from '@/hooks';
import { omit } from 'lodash-es';
import MenuFuncContext, {
  LeafMenuIdListType,
  MenuIdToPathMapType,
  MenuPathToIdMapType,
  type MenuItemProps,
} from './MenuFuncContext';
import { message } from '@ht/sprite-ui';

function buildMenuItemConfig(menus: MenuItemType[] = []): MenuItemProps[] {
  const menuMap: {
    [key: number]: MenuItemProps;
  } = {};
  const result: MenuItemProps[] = [];

  // 将菜单项按照ID存储到一个map中
  menus.forEach((menu) => {
    menuMap[menu.menuId] = {
      label: menu.menuName,
      key: String(menu.menuId),
    };
  });

  // 构建树结构
  menus.forEach((menu) => {
    if (
      menu.parentMenuId &&
      menu.parentMenuId !== -1 &&
      menuMap[menu.parentMenuId]
    ) {
      if (menuMap[menu.parentMenuId].children) {
        // @ts-expect-error
        menuMap[menu.parentMenuId].children.push(menuMap[menu.menuId]);
      } else {
        menuMap[menu.parentMenuId].children = [menuMap[menu.menuId]];
      }
    } else {
      result.push(menuMap[menu.menuId]);
    }
  });

  return result;
}

function getLeafNodeKeys(menuTree: MenuItemProps[]) {
  const leafIds: LeafMenuIdListType = [];

  function traverse(node: MenuItemProps) {
    if (!node.children || node.children.length === 0) {
      leafIds.push(Number(node.key));
    } else {
      node.children.forEach(traverse);
    }
  }

  menuTree.forEach(traverse);
  return leafIds;
}

const LOADING_STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAIL',
} as const;

type LoadingSuccessAction = {
  type: 'LOADING_SUCCESS';
  payload: MenuItemType[];
};

type LoadingFailAction = {
  type: 'LOADING_FAIL';
};

type LoadingBeginAction = {
  type: 'LOADING_BEGIN';
};

type Action = LoadingSuccessAction | LoadingFailAction | LoadingBeginAction;

type State = {
  status: typeof LOADING_STATUS[keyof typeof LOADING_STATUS];
};

function menuFuncReducer(state: State, action: Action) {
  if (action.type === 'LOADING_BEGIN') {
    return {
      status: LOADING_STATUS.LOADING,
    };
  }

  if (action.type === 'LOADING_SUCCESS') {
    const data: MenuItemType[] = action.payload;

    const menuItemConfig = buildMenuItemConfig(data);

    const leafMenuIds = getLeafNodeKeys(menuItemConfig);

    const menuIdToPathMap: MenuIdToPathMapType = {};
    const menuPathToIdMap: MenuPathToIdMapType = {};

    leafMenuIds.forEach((menuId) => {
      const menu = data.find((item) => item.menuId === menuId);

      if (menu) {
        menuIdToPathMap[menuId] = menu.menuUrl;
        menuPathToIdMap[menu.menuUrl] = menuId;
      }
    });

    return {
      flatMenuData: data,
      menuItemConfig,
      leafMenuIds,
      menuIdToPathMap,
      menuPathToIdMap,
      status: LOADING_STATUS.SUCCESS,
    };
  }

  if (action.type === 'LOADING_FAIL') {
    return {
      status: LOADING_STATUS.FAILED,
    };
  }

  return state;
}

const MenuAndFunc: FC<PropsWithChildren> = (props) => {
  const { activeRoleId } = useUserRoles();
  const [state, dispatch] = useReducer(menuFuncReducer, {
    status: LOADING_STATUS.SUCCESS,
  } as State);

  useEffect(() => {
    async function fetchMenuAndFunc() {
      try {
        dispatch({
          type: 'LOADING_BEGIN',
        });

        const resData = await getMenuByRole({
          pageId: 1,
          pageSize: 1000,
        });
        // const list = [
        //   {
        //     menuId: 504,
        //     menuName: '报盘端接入管理',
        //     menuUrl: '/inquiry/offerAccessManage',
        //     parentMenuId: 5,
        //     workGroupFlag: 0,
        //   },
        // ];
        // const _list = [...resData?.data?.resultList, ...list];
        // 接口业务码返回错误或者数据为空，则认为是异常情况
        if (resData.code !== 0 || resData?.data?.resultList?.length === 0) {
          throw new Error('Failed to fetch menu and function');
        }

        dispatch({
          type: 'LOADING_SUCCESS',
          // payload: _list,
          payload: resData?.data?.resultList,
        });
      } catch (error) {
        dispatch({
          type: 'LOADING_FAIL',
        });
      }
    }

    if (activeRoleId) {
      fetchMenuAndFunc();
    }
  }, [activeRoleId]);

  if (state.status === LOADING_STATUS.LOADING) {
    return <PageLoading isLoading={true} />;
  }

  if (state.status === LOADING_STATUS.FAILED) {
    message.error('菜单权限获取异常');
  }

  return (
    <MenuFuncContext.Provider value={omit(state, 'status')}>
      {props.children}
    </MenuFuncContext.Provider>
  );
};

export default MenuAndFunc;
