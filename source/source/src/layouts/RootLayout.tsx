import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { DataProvider } from '@/store/DataContext';
import LoginStatusCheckPoint from '@/wrappers/LoginStatusCheckPoint';
import UserRole from '@/wrappers/UserRole';
import MenuFunc from '@/wrappers/MenuFunc';
import RouteGuard from '@/wrappers/RouteGuard';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
    <LoadingOutlined className="text-4xl text-blue-500 mb-4" spin />
    <div className="text-gray-600">加载中...</div>
  </div>
);

const RootLayout: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorInfo: '#1890ff',
          borderRadius: 4,
        },
        components: {
          Table: { headerBg: '#fafafa', headerColor: '#333' },
          Tabs: { itemColor: '#666', itemSelectedColor: '#1890ff', inkBarColor: '#1890ff' },
        },
      }}
    >
      <DataProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </DataProvider>
    </ConfigProvider>
  );
};

export const MainLayoutWrapper: React.FC = () => {
  return (
    <LoginStatusCheckPoint>
      <UserRole>
        <MenuFunc>
          <RouteGuard>
            <Outlet />
          </RouteGuard>
        </MenuFunc>
      </UserRole>
    </LoginStatusCheckPoint>
  );
};

export default RootLayout;
