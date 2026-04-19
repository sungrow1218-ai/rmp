import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAliveController } from 'react-activation';
import { useHistory } from '@oula/oula';
import { Layout, message } from '@ht/sprite-ui';
import { useMenuFunc, useUserRoles } from '@/hooks';
import {
  userInfo as getUserInfo,
  type UserInfoResponseDataType,
} from '@/services/auth/index';
import TabBar from './NavTabBar';
import Navbar from './Navbar';
import { getIsIfram } from '@/utils/utils';
import { queryRoleAllAuthority } from '@/services/roleManage';
import useAuthState from '@/hooks/useAuthState';
import SubMenu from './components/SubMenu';

const { Header, Content } = Layout;

const TabsLayout: FC<PropsWithChildren> = ({ children }) => {
  const { menuPathToIdMap, menuIdToPathMap, menuItemConfig, flatMenuData } =
    useMenuFunc();
  const { drop: dropCache, clear: dropAllCache } = useAliveController();
  const {
    location: { pathname: currentPath },
    push,
  } = useHistory();
  const [userInfo, setUserInfo] = useState<UserInfoResponseDataType>();

  const handleRouteOpen = useCallback(
    (path: string) => {
      push(path);
    },
    [push]
  );

  const handleRoleChange = useCallback(() => {
    handleRouteOpen('/welcome');
    dropAllCache();
  }, [handleRouteOpen, dropAllCache]);

  const transformMenuIdtoPath = useCallback(
    (menuId?: number) => {
      return menuIdToPathMap?.[menuId || -1] || '';
    },
    [menuIdToPathMap]
  );

  const transformMenuPathtoId = useCallback(
    (menuPath: string) => {
      return menuPathToIdMap?.[menuPath] || -1;
    },
    [menuPathToIdMap]
  );

  useEffect(() => {
    if (currentPath === '/') {
      handleRouteOpen('/welcome');
    }
  }, [currentPath, handleRouteOpen]);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        console.log('开始获取用户信息...');
        const result = await getUserInfo();
        console.log('用户信息API响应:', result);

        if (result.code !== 0) {
          console.error('用户信息获取失败:', result.message);
          throw new Error(result.message || '获取用户信息失败');
        }

        console.log('用户信息获取成功:', result.data);
        setUserInfo(result.data);
      } catch (error) {
        console.error('用户信息获取异常:', error);
        message.error({
          content: `[用户信息获取错误] ${(error as any).message}`,
        });
      }
    }
    fetchUserInfo();
  }, []);
  // const  = useHistory();

  const isIfram = getIsIfram();

  // 切换角色 获取角色权限
  const [authData, setAuthState] = useAuthState();
  const { activeRoleId } = useUserRoles();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        if (!activeRoleId) return;
        const res = await queryRoleAllAuthority({
          queryRoleId: activeRoleId,
        });
        if (res.code !== 0) {
          throw new Error('获取角色权限失败');
        }

        if (res.data && res.data.resultList.length > 0) {
          const data = res.data.resultList[0];
          setAuthState(data);
        } else {
          setAuthState(null);
        }
      } catch (error) {}
    };
    fetchAuthData();
  }, [activeRoleId]);

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {isIfram ? null : (
        <Header
          style={{
            padding: 0,
            height: 56,
            background: '#001529',
            lineHeight: '56px',
          }}
        >
          {menuItemConfig && (
            <Navbar
              onMenuOpen={handleRouteOpen}
              currentPath={currentPath}
              transformMenuPathtoId={transformMenuPathtoId}
              transformMenuIdtoPath={transformMenuIdtoPath}
              menuItem={menuItemConfig}
              onRoleChange={handleRoleChange}
              userInfo={userInfo}
            />
          )}
        </Header>
      )}
      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        {isIfram ? null : (
          <Header style={{ padding: 0, height: 0, background: 'transparent', display: 'none' }}>
            {flatMenuData && (
              <TabBar
                currentPath={currentPath}
                transformMenuIdtoPath={transformMenuIdtoPath}
                transformMenuPathtoId={transformMenuPathtoId}
                handleMenuOpen={handleRouteOpen}
                flatMenuData={flatMenuData}
                dropCache={dropCache}
                onReset={handleRoleChange}
              />
            )}
          </Header>
        )}
        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          {isIfram ? null : <SubMenu />}
          <Content style={{
            flex: 1,
            padding: '16px',
            background: '#f0f2f5',
            overflow: 'auto',
            marginLeft: isIfram ? 0 : 240
          }}>
            <div style={{
              background: '#ffffff',
              height: '100%',
              borderRadius: '4px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
              overflow: 'auto',
              padding: '16px'
            }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TabsLayout;
