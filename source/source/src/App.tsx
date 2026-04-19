import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { DataProvider } from './store/DataContext';
import LoginStatusCheckPoint from './wrappers/LoginStatusCheckPoint';
import UserRole from './wrappers/UserRole';
import MenuFunc from './wrappers/MenuFunc';
import RouteGuard from './wrappers/RouteGuard';
import { Layout } from './components/Layout';
import { LoadingOutlined } from '@ant-design/icons';

// 从 routes.config.ts 导入组件
import {
  Login, Welcome, Exception403, Exception404,
  RuleSettings, DynamicDimension, SecurityPool, SeatGroup, AccountGroup, FutureOptionLimit, GeneralLimit,
  RuleApproveExempt, ProcessManage, RoleManage, UserManage, RiskControlAlarm,
  EntrustInquiry, PendingEntrust, Position, OfferAccessManage,
  InfoStocks, InfoBonds, InfoFund, InfoFutures, InfoOptions, InfoIndex, InfoBuyback, InfoPreciousMetals,
  RuleCreate, RuleEdit, RuleView, SingleRuleCreate, SingleRuleEdit, SingleRuleView
} from './config/routes.config';

// 加载中组件
const LoadingSpinner = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
    <LoadingOutlined className="text-4xl text-blue-500 mb-4" spin />
    <div className="text-gray-600">加载中...</div>
  </div>
);

// 空白布局 - 用于登录页面
const BlankLayout = () => {
  return <Outlet />;
};

// 主布局包装器 - 包含多个包装器
const MainLayout = () => {
  return (
    <LoginStatusCheckPoint>
      <UserRole>
        <MenuFunc>
          <RouteGuard>
            <Layout>
              <Outlet />
            </Layout>
          </RouteGuard>
        </MenuFunc>
      </UserRole>
    </LoginStatusCheckPoint>
  );
};

export default function App() {
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
          <HashRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* 空白布局 - 用于登录页面 */}
                <Route element={<BlankLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* 主布局 - 包含多个包装器 */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/welcome" replace />} />
                  <Route path="welcome" element={<Welcome />} />
                  
                  {/* 规则管理 */}
                  <Route path="rule/ruleSetting" element={<RuleSettings />} />
                  <Route path="rule/dynamicDimension" element={<DynamicDimension />} />
                  <Route path="rule/securityPool" element={<SecurityPool />} />
                  <Route path="rule/seatGroup" element={<SeatGroup />} />
                  <Route path="rule/accountGroup" element={<AccountGroup />} />
                  <Route path="rule/futureOptionLImit" element={<FutureOptionLimit />} />
                  <Route path="rule/generalLimit" element={<GeneralLimit />} />
                  
                  {/* 事务/流程管理 */}
                  <Route path="affairs/ruleApproveExempt" element={<RuleApproveExempt />} />
                  <Route path="affairs/processManage" element={<ProcessManage />} />
                  
                  {/* 权限管理 */}
                  <Route path="authority/roleManage" element={<RoleManage />} />
                  <Route path="authority/userManage" element={<UserManage />} />
                  
                  {/* 运维管理 */}
                  <Route path="operations/riskControlAlarm" element={<RiskControlAlarm />} />
                  
                  {/* 查询 */}
                  <Route path="inquiry/entrustInquiry" element={<EntrustInquiry />} />
                  <Route path="inquiry/pendingEntrust" element={<PendingEntrust />} />
                  <Route path="inquiry/position" element={<Position />} />
                  <Route path="inquiry/offerAccessManage" element={<OfferAccessManage />} />
                  
                  {/* 证券资讯管理 */}
                  <Route path="info/stocks" element={<InfoStocks />} />
                  <Route path="info/bonds" element={<InfoBonds />} />
                  <Route path="info/fund" element={<InfoFund />} />
                  <Route path="info/futures" element={<InfoFutures />} />
                  <Route path="info/options" element={<InfoOptions />} />
                  <Route path="info/index" element={<InfoIndex />} />
                  <Route path="info/buyback" element={<InfoBuyback />} />
                  <Route path="info/preciousMetals" element={<InfoPreciousMetals />} />
                  
                  {/* 规则编辑相关 */}
                  <Route path="rule-create" element={<RuleCreate />} />
                  <Route path="single-rule-create" element={<SingleRuleCreate />} />
                  <Route path="rule-edit/:id" element={<RuleEdit />} />
                  <Route path="single-rule-edit/:id" element={<SingleRuleEdit />} />
                  <Route path="rule-view/:id" element={<RuleView />} />
                  <Route path="single-rule-view/:id" element={<SingleRuleView />} />
                  
                  {/* 异常页面 */}
                  <Route path="exception/403" element={<Exception403 />} />
                  <Route path="exception/404" element={<Exception404 />} />
                </Route>

                {/* 默认重定向到404 */}
                <Route path="*" element={<Navigate to="/exception/404" replace />} />
              </Routes>
            </Suspense>
          </HashRouter>
      </DataProvider>
    </ConfigProvider>
  );
}
