import React, { type FC, useCallback, useMemo } from 'react';
import { useHistory } from '@oula/oula';
import { logout as cleanCookieAndRedirectToLoginPage } from '@/utils/utils';
import { useUserRoles } from '@/hooks';
import { MenuItemProps } from '@/wrappers/MenuFunc/MenuFuncContext';
import Logo from './components/NavLogo';
import RoleSelection from './components/NavRoleSelection';
import User from './components/NavUser';
import Menu from './components/NavMenu';
import styles from './index.less';
import projectBStyles from './projectBStyles.less';
import useAuthState from '@/hooks/useAuthState';
import { UserInfoResponseDataType, userLogout } from '@/services/auth/index';

interface NavbarProps {
  onMenuOpen: (path: string) => void;
  currentPath: string;
  menuItem?: MenuItemProps[];
  /**
   * 菜单路径到菜单 id 的映射
   */
  transformMenuPathtoId: (path: string) => number;
  /**
   * 菜单 id 到菜单路径的映射
   */
  transformMenuIdtoPath: (id: number) => string;
  /**
   * 角色切换时的回调，目前是清除 keepalive 缓存
   */
  onRoleChange: () => void;
  /**
   * 用户信息
   */
  userInfo?: UserInfoResponseDataType;
}

const Navbar: FC<NavbarProps> = ({
  onMenuOpen,
  menuItem,
  currentPath,
  transformMenuPathtoId,
  transformMenuIdtoPath,
  onRoleChange,
  userInfo,
}) => {
  // 从获取的当前 path 来提取当前激活的菜单 id
  const [authData, setAuthState] = useAuthState();
  const activeMenuId = useMemo(() => {
    const activeId = transformMenuPathtoId(currentPath);
    return activeId;
  }, [currentPath, transformMenuPathtoId]);

  const { availableRoles, activeRoleId, setActiveRoleId } = useUserRoles();
  const { push } = useHistory();

  // 退出登录
  const handleLogout = useCallback(() => {
    async function logout() {
      await userLogout();
      cleanCookieAndRedirectToLoginPage();
    }
    onRoleChange();
    logout();
  }, []);

  // 切换角色
  const handleSwitchRole = useCallback(
    (roleId: number) => {
      if (roleId && setActiveRoleId) {
        setActiveRoleId(roleId);
        onRoleChange();
      }
    },
    [setActiveRoleId, onRoleChange]
  );

  // 从菜单组件点击事件的获取 key，并转换为需要打开的菜单路径
  const handleMenuClick = useCallback(
    (e: { key: string }) => {
      const clickedMenuIdStr = e?.key || '';
      const clickedMenuId = Number(clickedMenuIdStr);
      if (!clickedMenuIdStr || Number.isNaN(clickedMenuId)) {
        return;
      }

      // 查找点击的菜单项
      const findMenuItem = (items: MenuItemProps[] = []): MenuItemProps | undefined => {
        for (const item of items) {
          if (item.key === clickedMenuIdStr) {
            return item;
          }
          if (item.children) {
            const found = findMenuItem(item.children);
            if (found) return found;
          }
        }
        return undefined;
      };

      const clickedMenuItem = findMenuItem(menuItem);

      // 如果菜单项有子菜单，跳转到第一个子菜单的页面
      if (clickedMenuItem?.children && clickedMenuItem.children.length > 0) {
        // 找到第一个子菜单
        const firstChild = clickedMenuItem.children[0];
        // 递归查找第一个叶子节点（实际可访问的页面）
        const findFirstLeafPath = (item: MenuItemProps): string => {
          if (item.children && item.children.length > 0) {
            return findFirstLeafPath(item.children[0]);
          }
          return item.key;
        };

        const firstLeafMenuIdStr = findFirstLeafPath(firstChild);
        const firstLeafMenuId = Number(firstLeafMenuIdStr);
        if (!Number.isNaN(firstLeafMenuId)) {
          const menuPathToOpen = transformMenuIdtoPath(firstLeafMenuId);
          if (menuPathToOpen) {
            push(menuPathToOpen);
            return;
          }
        }
      }

      // 如果没有子菜单或跳转失败，保持原有逻辑
      const menuPathToOpen = transformMenuIdtoPath(clickedMenuId);
      if (!menuPathToOpen) {
        return;
      }
      onMenuOpen(menuPathToOpen);
    },
    [menuItem, onMenuOpen, transformMenuIdtoPath, push]
  );

  return (
    <div className={styles.navbarContainer}>
      <Logo />
      {activeRoleId && availableRoles && (
        <div style={{ marginLeft: 24, flex: '0 0 auto' }}>
          <RoleSelection
            availableRoles={availableRoles}
            onSwitchRole={handleSwitchRole}
            activeRoleId={activeRoleId}
          />
        </div>
      )}
      <div style={{ flex: 1, marginLeft: 40 }}>
        <Menu
          menuData={menuItem || []}
          activeId={String(activeMenuId)}
          onClick={handleMenuClick}
          className={projectBStyles.customTopMenu}
        />
      </div>
      <div style={{ justifySelf: 'flex-end', flexShrink: 0 }}>
        <User onLogout={handleLogout} userInfo={userInfo} />
      </div>
    </div>
  );
};

export default Navbar;
