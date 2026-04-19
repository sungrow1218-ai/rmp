import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

import { ApiConfig, MenuConfig } from '../config/env';
import type { MenuItemType, WorkGroupList, RoleItemType } from '../services/api';
import { extendOptions } from '@/utils/request';
import { getMenuDataWithReport } from '@/services/menu';

// 根据配置选择使用真实API还是模拟API
const useMockAPI = ApiConfig.useMockData;

// 导入API模块
let api: any;

// 加载API模块
const loadApiModule = async () => {
  if (useMockAPI) {
    // 使用模拟API
    const mockApiModule = await import('../services/mockApi');
    api = mockApiModule.mockApi;
  } else {
    // 使用真实API
    const apiModule = await import('../services/api');
    api = apiModule;
  }
};

// 立即开始加载API模块
loadApiModule();

// 菜单项属性类型
export interface MenuItemProps {
  label: string;
  key: string;
  children?: MenuItemProps[];
}

// 菜单功能类型
export interface MenuFuncType {
  flatMenuData: MenuItemType[];
  menuItemConfig: MenuItemProps[];
  leafMenuIds: number[];
  menuIdToPathMap: Record<number, string>;
  menuPathToIdMap: Record<string, number>;
}

// 工作台类型
export interface WorkGroupInfo {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}

// 用户角色类型
export interface UserRoleInfo {
  activeRoleId: number | null;
  availableRoles: RoleItemType[];
}

// 菜单上下文类型
interface MenuContextType {
  // 菜单相关
  menuFunc: MenuFuncType | null;
  loading: boolean;
  error: string | null;

  // 工作台相关
  workGroupList: WorkGroupInfo[];
  activeWorkGroup: WorkGroupInfo | null;

  // 用户角色相关
  userRoles: UserRoleInfo;

  // 方法
  fetchMenuData: (roleId?: number) => Promise<void>;
  setActiveWorkGroup: (workGroup: WorkGroupInfo) => void;
  setActiveRole: (roleId: number) => void;
  refreshMenuData: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 构建菜单项配置
function buildMenuItemConfig(menus: MenuItemType[] = []): MenuItemProps[] {
  const menuMap: Record<number, MenuItemProps> = {};
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
    if (menu.parentMenuId && menu.parentMenuId !== -1 && menuMap[menu.parentMenuId]) {
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

// 获取叶子节点ID列表
function getLeafNodeKeys(menuTree: MenuItemProps[]): number[] {
  const leafIds: number[] = [];

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

// 菜单提供者组件
export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuFunc, setMenuFunc] = useState<MenuFuncType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [workGroupList, setWorkGroupList] = useState<WorkGroupInfo[]>([]);
  const [activeWorkGroup, setActiveWorkGroup] = useState<WorkGroupInfo | null>(null);

  const [userRoles, setUserRoles] = useState<UserRoleInfo>({
    activeRoleId: null,
    availableRoles: [],
  });

  // 获取工作台列表
  const fetchWorkGroups = useCallback(async () => {
    try {
      const response = await api.queryWorkGroup({
        pageId: 1,
        pageSize: 1000,
        authFlag: 1,
      });

      if (response.code === 0 && response.data.resultList.length > 0) {
        const workGroups: WorkGroupInfo[] = response.data.resultList.map(item => ({
          workGroupId: item.workGroupId,
          workGroupName: item.workGroupName,
          sobId: item.sobId,
        }));

        setWorkGroupList(workGroups);

        // 默认选择第一个工作台
        if (!activeWorkGroup && workGroups.length > 0) {
          setActiveWorkGroup(workGroups[0]);
        }
      }
    } catch (error) {
      console.error('获取工作台列表失败:', error);
      // 使用默认工作台数据
      const defaultWorkGroups: WorkGroupInfo[] = [
        { workGroupId: 1, workGroupName: '交易室合规风控工作台', sobId: 1 },
        { workGroupId: 2, workGroupName: '经纪业务风控工作台', sobId: 2 },
        { workGroupId: 3, workGroupName: '自营业务风控工作台', sobId: 3 },
        { workGroupId: 4, workGroupName: 'QFII业务风控工作台', sobId: 4 },
      ];
      setWorkGroupList(defaultWorkGroups);
      setActiveWorkGroup(defaultWorkGroups[0]);
    }
  }, [activeWorkGroup]);

  // 获取用户角色
  const fetchUserRoles = useCallback(async () => {
    try {
      const response = await api.getCurrentUserRoles({
        pageId: 1,
        pageSize: 1000,
      });

      if (response.code === 0 && response.data.resultList.length > 0) {
        const firstRoleId = response.data.resultList[0].roleId;
        console.log('🔍 [MenuContext] 获取到用户角色，第一个角色ID:', firstRoleId);
        setUserRoles({
          activeRoleId: firstRoleId,
          availableRoles: response.data.resultList,
        });

        // 设置默认的Role-Id请求头
        console.log('🔍 [MenuContext] 设置默认Role-Id请求头:', firstRoleId);
        extendOptions({ headers: { 'Role-Id': `${firstRoleId}` } });
      }
    } catch (error) {
      console.error('获取用户角色失败:', error);
      // 使用默认角色数据
      const defaultRoles: RoleItemType[] = [
        {
          roleId: 1,
          roleName: '系统管理员',
          roleRemark: '拥有所有权限',
          createUserNo: 'system',
          updateUserNo: 'system',
          createDateTime: Date.now(),
          lastUpdateTime: Date.now(),
        },
        {
          roleId: 2,
          roleName: '风控专员',
          roleRemark: '风控相关操作权限',
          createUserNo: 'system',
          updateUserNo: 'system',
          createDateTime: Date.now(),
          lastUpdateTime: Date.now(),
        },
      ];
      setUserRoles({
        activeRoleId: defaultRoles[0].roleId,
        availableRoles: defaultRoles,
      });
    }
  }, []);

  // 获取菜单数据
  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 使用新的菜单服务获取数据（包含后端数据和本地添加的报表管理菜单）
      const menuData = await getMenuDataWithReport({
        pageId: 1,
        pageSize: 1000,
      });

      const menuItemConfig = buildMenuItemConfig(menuData);
      const leafMenuIds = getLeafNodeKeys(menuItemConfig);

      const menuIdToPathMap: Record<number, string> = {};
      const menuPathToIdMap: Record<string, number> = {};

      leafMenuIds.forEach((menuId) => {
        const menu = menuData.find((item) => item.menuId === menuId);
        if (menu) {
          menuIdToPathMap[menuId] = menu.menuUrl;
          menuPathToIdMap[menu.menuUrl] = menuId;
        }
      });

      setMenuFunc({
        flatMenuData: menuData,
        menuItemConfig,
        leafMenuIds,
        menuIdToPathMap,
        menuPathToIdMap,
      });
    } catch (error) {
      console.error('获取菜单数据失败:', error);
      setError('菜单权限获取异常');

      // 使用默认菜单数据（基于现有布局）
      const defaultMenuData: MenuItemType[] = [
        {
          menuId: 1,
          menuName: '规则管理',
          parentMenuId: -1,
          menuUrl: '/rule-settings',
          functionList: [],
        },
        {
          menuId: 2,
          menuName: '规则设置',
          parentMenuId: 1,
          menuUrl: '/rule-settings',
          functionList: [
            { functionId: 1, functionName: '新增规则', functionDescrip: '创建新规则' },
            { functionId: 2, functionName: '编辑规则', functionDescrip: '修改现有规则' },
            { functionId: 3, functionName: '删除规则', functionDescrip: '删除规则' },
          ],
        },
        {
          menuId: 3,
          menuName: '账户组管理',
          parentMenuId: 1,
          menuUrl: '/account-group',
          functionList: [
            { functionId: 4, functionName: '新增账户组', functionDescrip: '创建新账户组' },
            { functionId: 5, functionName: '编辑账户组', functionDescrip: '修改账户组' },
          ],
        },
        {
          menuId: 4,
          menuName: '证券组管理',
          parentMenuId: 1,
          menuUrl: '/security-group',
          functionList: [
            { functionId: 6, functionName: '新增证券组', functionDescrip: '创建新证券组' },
            { functionId: 7, functionName: '编辑证券组', functionDescrip: '修改证券组' },
          ],
        },
        {
          menuId: 5,
          menuName: '综合查询',
          parentMenuId: -1,
          menuUrl: '/alert-query',
          functionList: [],
        },
        {
          menuId: 6,
          menuName: '触警信息查询',
          parentMenuId: 5,
          menuUrl: '/alert-query',
          functionList: [
            { functionId: 8, functionName: '查询触警', functionDescrip: '查询风控触警信息' },
            { functionId: 9, functionName: '导出数据', functionDescrip: '导出触警数据' },
          ],
        },
        {
          menuId: 7,
          menuName: '事务管理',
          parentMenuId: -1,
          menuUrl: '/process',
          functionList: [],
        },
        {
          menuId: 8,
          menuName: '流程列表',
          parentMenuId: 7,
          menuUrl: '/process',
          functionList: [
            { functionId: 10, functionName: '审批流程', functionDescrip: '审批待办流程' },
            { functionId: 11, functionName: '查看详情', functionDescrip: '查看流程详情' },
          ],
        },
        {
          menuId: 9,
          menuName: '报表管理',
          parentMenuId: -1,
          menuUrl: '/',
          functionList: [],
        },
        {
          menuId: 10,
          menuName: '股票集中度查询',
          parentMenuId: 9,
          menuUrl: '/',
          functionList: [
            { functionId: 12, functionName: '查询报表', functionDescrip: '查询股票集中度' },
            { functionId: 13, functionName: '导出报表', functionDescrip: '导出报表数据' },
          ],
        },
        {
          menuId: 11,
          menuName: '集中度额度管理',
          parentMenuId: 9,
          menuUrl: '/quota-manage',
          functionList: [
            { functionId: 14, functionName: '调整额度', functionDescrip: '调整集中度额度' },
            { functionId: 15, functionName: '批量调整', functionDescrip: '批量调整额度' },
          ],
        },
      ];

      const menuItemConfig = buildMenuItemConfig(defaultMenuData);
      const leafMenuIds = getLeafNodeKeys(menuItemConfig);

      const menuIdToPathMap: Record<number, string> = {};
      const menuPathToIdMap: Record<string, number> = {};

      leafMenuIds.forEach((menuId) => {
        const menu = defaultMenuData.find((item) => item.menuId === menuId);
        if (menu) {
          menuIdToPathMap[menuId] = menu.menuUrl;
          menuPathToIdMap[menu.menuUrl] = menuId;
        }
      });

      setMenuFunc({
        flatMenuData: defaultMenuData,
        menuItemConfig,
        leafMenuIds,
        menuIdToPathMap,
        menuPathToIdMap,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 设置活动角色
  const setActiveRole = useCallback((roleId: number) => {
    console.log('🔍 [MenuContext] 设置活动角色:', roleId);
    setUserRoles(prev => ({
      ...prev,
      activeRoleId: roleId,
    }));

    // 设置请求头 Role-Id，用于后续API调用的权限控制
    console.log('🔍 [MenuContext] 更新Role-Id请求头:', roleId);
    extendOptions({ headers: { 'Role-Id': `${roleId}` } });

    // 角色切换后重新获取菜单数据
    fetchMenuData();
  }, [fetchMenuData]);

  // 刷新菜单数据
  const refreshMenuData = useCallback(async () => {
    await fetchMenuData();
  }, [fetchMenuData]);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 并行获取工作台和角色数据
        await Promise.all([
          fetchWorkGroups(),
          fetchUserRoles(),
        ]);

        // 确保在获取菜单数据之前设置了Role-Id请求头
        if (userRoles.activeRoleId) {
          console.log('🔍 [MenuContext] 初始化时设置Role-Id请求头:', userRoles.activeRoleId);
          extendOptions({ headers: { 'Role-Id': `${userRoles.activeRoleId}` } });
        }
        await fetchMenuData();
      } catch (error) {
        console.error('初始化数据失败:', error);
        // 使用配置中的默认数据
        setWorkGroupList(MenuConfig.defaultWorkGroupData);
        setUserRoles({
          activeRoleId: MenuConfig.defaultRoleData[0].roleId,
          availableRoles: MenuConfig.defaultRoleData,
        });

        // 设置默认Role-Id请求头
        console.log('🔍 [MenuContext] 设置默认Role-Id请求头:', MenuConfig.defaultRoleData[0].roleId);
        extendOptions({ headers: { 'Role-Id': `${MenuConfig.defaultRoleData[0].roleId}` } });

        const menuItemConfig = buildMenuItemConfig(MenuConfig.defaultMenuData);
        const leafMenuIds = getLeafNodeKeys(menuItemConfig);

        const menuIdToPathMap: Record<number, string> = {};
        const menuPathToIdMap: Record<string, number> = {};

        leafMenuIds.forEach((menuId) => {
          const menu = MenuConfig.defaultMenuData.find((item) => item.menuId === menuId);
          if (menu) {
            menuIdToPathMap[menuId] = menu.menuUrl;
            menuPathToIdMap[menu.menuUrl] = menuId;
          }
        });

        setMenuFunc({
          flatMenuData: MenuConfig.defaultMenuData,
          menuItemConfig,
          leafMenuIds,
          menuIdToPathMap,
          menuPathToIdMap,
        });
      }
    };

    initializeData();
  }, [fetchWorkGroups, fetchUserRoles, fetchMenuData, userRoles.activeRoleId]);

  // 处理工作台切换
  const handleSetActiveWorkGroup = useCallback((workGroup: WorkGroupInfo) => {
    setActiveWorkGroup(workGroup);
    // 工作台切换后可能需要重新获取某些数据
    // 这里可以根据需要添加相关逻辑
  }, []);

  const value: MenuContextType = {
    menuFunc,
    loading,
    error,
    workGroupList,
    activeWorkGroup,
    userRoles,
    fetchMenuData,
    setActiveWorkGroup: handleSetActiveWorkGroup,
    setActiveRole,
    refreshMenuData,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

// 使用菜单上下文的Hook
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
};

// 检查是否有访问某个路径的权限
export const useMenuPermission = () => {
  const { menuFunc } = useMenu();

  const hasPermission = useCallback((path: string): boolean => {
    if (!menuFunc) return false;
    return menuFunc.menuPathToIdMap.hasOwnProperty(path);
  }, [menuFunc]);

  const hasFunctionPermission = useCallback((functionId: number): boolean => {
    if (!menuFunc) return false;
    return menuFunc.flatMenuData.some(menu =>
      menu.functionList.some(func => func.functionId === functionId)
    );
  }, [menuFunc]);

  return {
    hasPermission,
    hasFunctionPermission,
    menuFunc,
  };
};