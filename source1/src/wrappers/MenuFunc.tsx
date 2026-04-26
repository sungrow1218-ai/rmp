import React, {
  useEffect,
  useReducer,
  type PropsWithChildren,
  type FC,
} from 'react';
import { getMenuByRole, type MenuItemType } from '@/services/api';
import { Spin, message } from 'antd';
import { useUserRoles } from '@/hooks';
import MenuFuncContext, {
  type MenuItemProps,
  type MenuIdToPathMapType,
  type MenuPathToIdMapType,
  type LeafMenuIdListType,
} from './MenuFuncContext';
import { omit } from 'lodash';

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
        menuMap[menu.parentMenuId].children!.push(menuMap[menu.menuId]);
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

const MenuFunc: FC<PropsWithChildren> = (props) => {
  const { activeRoleId } = useUserRoles();
  const [state, dispatch] = useReducer(menuFuncReducer, {
    status: LOADING_STATUS.LOADING,
  } as State);

  useEffect(() => {
    // 只有在 activeRoleId 有效且组件已挂载时才执行
    if (!activeRoleId) return;

    let isMounted = true;

    async function fetchMenuAndFunc() {
      try {
        if (isMounted) {
          dispatch({
            type: 'LOADING_BEGIN',
          });
        }

        const resData = await getMenuByRole({
          pageId: 1,
          pageSize: 1000,
        });

        // 接口业务码返回错误或者数据为空，则认为是异常情况
        if (resData.code !== 0 || resData?.data?.resultList?.length === 0) {
          throw new Error('Failed to fetch menu and function');
        }

        if (isMounted) {
          dispatch({
            type: 'LOADING_SUCCESS',
            payload: resData?.data?.resultList,
          });
        }
      } catch (error) {
        console.error('获取菜单权限失败:', error);
        if (isMounted) {
          dispatch({
            type: 'LOADING_FAIL',
          });
          // 使用 setTimeout 避免在渲染过程中显示消息
          setTimeout(() => {
            message.error('菜单权限获取异常');
          }, 0);
        }
      }
    }

    fetchMenuAndFunc();

    return () => {
      isMounted = false;
    };
  }, [activeRoleId]);

  if (state.status === LOADING_STATUS.LOADING) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="加载菜单权限中..." />
      </div>
    );
  }

  if (state.status === LOADING_STATUS.FAILED) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">菜单权限加载失败</div>
          <div className="text-gray-600">菜单权限获取异常</div>
        </div>
      </div>
    );
  }

  return (
    <MenuFuncContext.Provider value={omit(state, 'status')}>
      {props.children}
    </MenuFuncContext.Provider>
  );
};

export default MenuFunc;