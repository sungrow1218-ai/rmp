import { MenuItemType } from '../services/api';

// 菜单项类型（用于Ant Design Menu组件）
export interface AntMenuItem {
  key: string;
  label: string;
  children?: AntMenuItem[];
}

// 将API菜单数据转换为Ant Design Menu需要的格式（支持多级菜单）
export const transformMenuData = (menuData: MenuItemType[]): {
  topMenuItems: AntMenuItem[];
  sideMenuMap: Record<string, AntMenuItem[]>;
  menuTitleMap: Record<string, string>;
} => {
  // 顶级菜单（parentMenuId为-1或不存在）
  const topLevelMenus = menuData.filter(menu =>
    !menu.parentMenuId || menu.parentMenuId === -1
  );

  // 构建顶级菜单项
  const topMenuItems: AntMenuItem[] = topLevelMenus.map(menu => ({
    key: menu.menuUrl,
    label: menu.menuName,
  }));

  // 构建侧边菜单映射
  const sideMenuMap: Record<string, AntMenuItem[]> = {};
  const menuTitleMap: Record<string, string> = {};

  // 递归构建菜单树
  const buildMenuTree = (parentId: number): AntMenuItem[] => {
    const children = menuData.filter(menu => menu.parentMenuId === parentId);

    return children.map(childMenu => {
      const grandChildren = buildMenuTree(childMenu.menuId);

      return {
        key: childMenu.menuUrl,
        label: childMenu.menuName,
        children: grandChildren.length > 0 ? grandChildren : undefined,
      };
    });
  };

  topLevelMenus.forEach(topMenu => {
    // 构建该顶级菜单下的所有子菜单树
    const sideMenuItems = buildMenuTree(topMenu.menuId);

    sideMenuMap[topMenu.menuUrl] = sideMenuItems;
    menuTitleMap[topMenu.menuUrl] = topMenu.menuName;
  });

  return {
    topMenuItems,
    sideMenuMap,
    menuTitleMap,
  };
};

// 根据当前路径获取激活的顶级菜单
export const getActiveTopMenu = (pathname: string, menuData: MenuItemType[]): string => {
  // 默认菜单
  const defaultMenu = 'report';

  if (!menuData || menuData.length === 0) {
    return defaultMenu;
  }

  // 查找当前路径对应的菜单
  const currentMenu = menuData.find(menu =>
    menu.menuUrl === pathname ||
    (pathname.startsWith(menu.menuUrl) && menu.menuUrl !== '/')
  );

  if (!currentMenu) {
    return defaultMenu;
  }

  // 如果是子菜单，找到其父菜单
  if (currentMenu.parentMenuId && currentMenu.parentMenuId !== -1) {
    const parentMenu = menuData.find(menu => menu.menuId === currentMenu.parentMenuId);
    if (parentMenu) {
      return parentMenu.menuUrl;
    }
  }

  // 如果是顶级菜单，直接返回
  return currentMenu.menuUrl;
};

// 根据API菜单数据生成工作台选项
export const generateWorkGroupOptions = (workGroupList: Array<{ workGroupId: number; workGroupName: string; sobId: number }>) => {
  return workGroupList.map(group => ({
    value: group.workGroupId.toString(),
    label: group.workGroupName,
  }));
};

// 检查用户是否有某个功能的权限
export const hasFunctionPermission = (
  functionId: number,
  menuData: MenuItemType[]
): boolean => {
  if (!menuData || menuData.length === 0) {
    return false;
  }

  return menuData.some(menu =>
    menu.functionList.some(func => func.functionId === functionId)
  );
};

// 获取当前页面的功能列表
export const getCurrentPageFunctions = (
  pathname: string,
  menuData: MenuItemType[]
): Array<{ functionId: number; functionName: string; functionDescrip: string }> => {
  if (!menuData || menuData.length === 0) {
    return [];
  }

  const currentMenu = menuData.find(menu =>
    menu.menuUrl === pathname ||
    (pathname.startsWith(menu.menuUrl) && menu.menuUrl !== '/')
  );

  if (!currentMenu) {
    return [];
  }

  return currentMenu.functionList;
};

// 将菜单数据转换为路由守卫需要的格式
export const getProtectedRoutes = (menuData: MenuItemType[]): string[] => {
  if (!menuData || menuData.length === 0) {
    return ['/', '/quota-manage', '/process', '/rule-settings', '/alert-query'];
  }

  // 获取所有叶子菜单的路径
  const leafMenus = menuData.filter(menu =>
    !menuData.some(child => child.parentMenuId === menu.menuId)
  );

  return leafMenus.map(menu => menu.menuUrl);
};