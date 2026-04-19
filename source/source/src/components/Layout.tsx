import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Select, Spin, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppstoreFilled, BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useMenuFunc } from '@/hooks';
import { transformMenuData, getActiveTopMenu } from '../utils/menuUtils';
import { logout } from '@/utils/utils';

const { Header, Sider, Content } = AntLayout;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flatMenuData, menuItemConfig, leafMenuIds, menuIdToPathMap, menuPathToIdMap } = useMenuFunc();

  // 临时占位符 - 这些功能需要从独立的钩子获取
  const loading = false;
  const error = null;
  const workGroupList = [
    { workGroupId: 1, workGroupName: '默认工作台', sobId: 1 }
  ];
  const activeWorkGroup = workGroupList[0];
  const setActiveWorkGroup = () => {};
  const userRoles = {
    activeRoleId: 1,
    availableRoles: [
      { roleId: 1, roleName: '默认角色' }
    ]
  };
  const setActiveRole = () => {};
  const hasPermission = (path: string) => true;

  // 根据当前路径和菜单数据判断激活的一级菜单
  const [activeTopMenu, setActiveTopMenu] = useState('report');
  const [topMenuItems, setTopMenuItems] = useState<any[]>([]);
  const [sideMenuItems, setSideMenuItems] = useState<any[]>([]);
  const [sideMenuTitle, setSideMenuTitle] = useState('');

  // 初始化菜单数据和更新侧边菜单
  useEffect(() => {
    if (flatMenuData) {
      const currentPath = location.pathname;

      // 获取菜单转换数据
      const { topMenuItems, sideMenuMap, menuTitleMap } = transformMenuData(flatMenuData);
      setTopMenuItems(topMenuItems);

      // 根据当前路径获取激活的顶级菜单
      const activeMenu = getActiveTopMenu(currentPath, flatMenuData);
      setActiveTopMenu(activeMenu);
      setSideMenuItems(sideMenuMap[activeMenu] || []);
      setSideMenuTitle(menuTitleMap[activeMenu] || '');
    }
  }, [flatMenuData, location.pathname]);

  // 当activeTopMenu变化时更新侧边菜单
  useEffect(() => {
    if (flatMenuData && activeTopMenu) {
      const { sideMenuMap, menuTitleMap } = transformMenuData(flatMenuData);
      setSideMenuItems(sideMenuMap[activeTopMenu] || []);
      setSideMenuTitle(menuTitleMap[activeTopMenu] || '');
    }
  }, [flatMenuData, activeTopMenu]);

  const handleTopMenuClick = (e: any) => {
    setActiveTopMenu(e.key);

    // 获取当前可用的菜单项
    const currentTopMenuItems = topMenuItems.length > 0 ? topMenuItems : defaultTopMenuItems;

    // 找到点击的菜单项
    const clickedMenuItem = currentTopMenuItems.find(item => item.key === e.key);

    if (clickedMenuItem) {
      // 导航到该菜单项的URL
      navigate(clickedMenuItem.key);
    } else {
      // 如果找不到菜单项，根据键值导航
      switch (e.key) {
        case 'rule':
          navigate('/rule-settings');
          break;
        case 'query':
          navigate('/alert-query');
          break;
        case 'task':
          navigate('/process');
          break;
        case 'report':
          navigate('/welcome');
          break;
        default:
          navigate('/welcome');
      }
    }
  };

  // 使用默认顶级菜单项（当API数据未加载时）
  const defaultTopMenuItems = [
    { key: 'rule', label: '规则管理' },
    { key: 'query', label: '综合查询' },
    { key: 'task', label: '事务管理' },
    { key: 'report', label: '报表管理' },
  ];

  const handleUserMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        await logout();
        message.success('退出登录成功');
      } catch (error) {
        console.error('退出登录失败:', error);
        message.error('退出登录失败，请重试');
      }
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
        { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
      ]}
      onClick={handleUserMenuClick}
    />
  );

  // 处理工作台切换
  const handleWorkGroupChange = (value: string) => {
    const selectedGroup = workGroupList.find(group => group.workGroupId.toString() === value);
    if (selectedGroup) {
      setActiveWorkGroup(selectedGroup);
    }
  };

  // 处理角色切换
  const handleRoleChange = (roleId: number) => {
    setActiveRole(roleId);
  };

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5]">
        <Spin size="large" tip="加载菜单数据中..." />
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">{error}</div>
          <div className="text-gray-600">请检查网络连接或联系管理员</div>
        </div>
      </div>
    );
  }

  // 简化权限检查 - 由RouteGuard处理
  // 这里只负责渲染布局，权限检查在RouteGuard中完成

  return (
    <AntLayout className="h-screen w-screen overflow-hidden bg-[#f0f2f5]">
      <Header className="flex items-center bg-[#001529] px-6 h-14 shadow-md z-10">
        <div className="text-white text-lg font-bold flex items-center gap-3 w-[280px] shrink-0">
          <div className="w-8 h-8 bg-[#1890ff] rounded flex items-center justify-center shadow-inner">
            <AppstoreFilled className="text-white text-lg" />
          </div>
          <span className="tracking-wide">交易合规监控系统</span>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeTopMenu]}
          onClick={handleTopMenuClick}
          className="bg-transparent border-none flex-1 h-14 leading-[56px] text-base custom-top-menu"
          items={topMenuItems.length > 0 ? topMenuItems : defaultTopMenuItems}
        />

        <div className="flex items-center gap-6 text-white shrink-0">
          {/* 角色选择器 */}
          {userRoles.availableRoles.length > 1 && (
            <Select
              value={userRoles.activeRoleId}
              onChange={handleRoleChange}
              className="w-32 custom-role-select"
              variant="borderless"
              options={userRoles.availableRoles.map(role => ({
                value: role.roleId,
                label: role.roleName,
              }))}
            />
          )}

          <div className="relative cursor-pointer hover:text-gray-300 transition-colors">
            <BellOutlined className="text-xl" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <Dropdown menu={{ items: userMenu.props.items, onClick: userMenu.props.onClick }} placement="bottomRight" arrow>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
              <Avatar size="small" icon={<UserOutlined />} className="bg-[#1890ff]" />
              <span className="text-sm font-medium">018566</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <AntLayout className="flex-1">
        <Sider width={220} className="bg-white border-r border-gray-200 shadow-sm z-0 flex flex-col">
          {/* 顶部工作台选择器 - 极简扁平化设计 */}
          <div className="pt-5 pb-2 px-3 shrink-0">
            <div className="text-[11px] text-gray-400 mb-1 px-3 font-medium tracking-wider">当前空间</div>
            <Select
              value={activeWorkGroup?.workGroupId.toString()}
              onChange={handleWorkGroupChange}
              className="w-full custom-space-select"
              variant="borderless"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 220, borderRadius: 8, padding: 4 }}
              options={workGroupList.map(group => ({
                value: group.workGroupId.toString(),
                label: group.workGroupName,
              }))}
            />
          </div>

          <div className="py-2 flex-1 overflow-y-auto">
            <div className="px-6 mt-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {sideMenuTitle}
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              className="border-none custom-side-menu"
              items={sideMenuItems}
              onClick={({ key }) => navigate(key)}
            />
          </div>
        </Sider>
        <Content className="overflow-hidden relative bg-[#f0f2f5] p-4 flex-1">
          <div className="bg-white h-full rounded shadow-sm overflow-hidden relative">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
export default Layout;
