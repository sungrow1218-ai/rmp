import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Layouts
const BlankLayout = lazy(() => import('../pages/login/BlankLayout'));
const TabsLayout = lazy(() => import('../components/Layout'));

// Pages
const Login = lazy(() => import('../pages/login/Login'));
const Welcome = lazy(() => import('../pages/welcome/Welcome'));
const RuleSetting = lazy(() => import('../pages/rule/RuleSettings'));
const DynamicDimension = lazy(() => import('../pages/rule/DynamicDimension'));
const SecurityPool = lazy(() => import('../pages/rule/SecurityPool'));
const SeatGroup = lazy(() => import('../pages/rule/SeatGroup'));
const AccountGroup = lazy(() => import('../pages/rule/AccountGroup'));
const RuleApproveExempt = lazy(() => import('../pages/affairs/RuleApproveExempt'));
const RoleManage = lazy(() => import('../pages/authority/RoleManage'));
const UserManage = lazy(() => import('../pages/authority/UserManage'));
const ProcessManage = lazy(() => import('../pages/affairs/ProcessManage'));
const RiskControlAlarm = lazy(() => import('../pages/operations/RiskControlAlarm'));
const FutureOptionLimit = lazy(() => import('../pages/rule/FutureOptionLimit'));
const GeneralLimit = lazy(() => import('../pages/rule/GeneralLimit'));
const EntrustInquiry = lazy(() => import('../pages/inquiry/EntrustInquiry'));
const PendingEntrust = lazy(() => import('../pages/inquiry/PendingEntrust'));
const Position = lazy(() => import('../pages/inquiry/Position'));
const Stocks = lazy(() => import('../pages/info/Stocks'));
const Bonds = lazy(() => import('../pages/info/Bonds'));
const Fund = lazy(() => import('../pages/info/Fund'));
const Futures = lazy(() => import('../pages/info/Futures'));
const Options = lazy(() => import('../pages/info/Options'));
const Index = lazy(() => import('../pages/info/Index'));
const Buyback = lazy(() => import('../pages/info/Buyback'));
const PreciousMetals = lazy(() => import('../pages/info/PreciousMetals'));
const OfferAccessManage = lazy(() => import('../pages/inquiry/OfferAccessManage'));
const NotFound = lazy(() => import('../pages/exception/404'));
const Forbidden = lazy(() => import('../pages/exception/403'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/',
        element: <TabsLayout />,
        // wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc','@/wrappers/UseExtSys','@/wrappers/RouteGuard'],
        children: [
          {
            path: '/welcome',
            element: <Welcome />,
          },
          {
            path: '/rule/ruleSetting',
            element: <RuleSetting />,
          },
          {
            path: '/rule/dynamicDimension',
            element: <DynamicDimension />,
          },
          {
            path: '/rule/securityPool',
            element: <SecurityPool />,
          },
          {
            path: '/rule/seatGroup',
            element: <SeatGroup />,
          },
          {
            path: '/rule/accountGroup',
            element: <AccountGroup />,
          },
          {
            path: '/affairs/ruleApproveExempt',
            element: <RuleApproveExempt />,
          },
          {
            path: '/authority/roleManage',
            element: <RoleManage />,
          },
          {
            path: '/authority/userManage',
            element: <UserManage />,
          },
          {
            path: '/affairs/processManage',
            element: <ProcessManage />,
          },
          {
            path: '/operations/riskControlAlarm',
            element: <RiskControlAlarm />,
          },
          {
            path: '/rule/futureOptionLImit',
            element: <FutureOptionLimit />,
          },
          {
            path: '/rule/generalLimit',
            element: <GeneralLimit />,
          },
          {
            path: '/inquiry/entrustInquiry',
            element: <EntrustInquiry />,
          },
          {
            path: '/inquiry/pendingEntrust',
            element: <PendingEntrust />,
          },
          {
            path: '/inquiry/position',
            element: <Position />,
          },
          {
            path: '/info/stocks',
            element: <Stocks />,
          },
          {
            path: '/info/bonds',
            element: <Bonds />,
          },
          {
            path: '/info/fund',
            element: <Fund />,
          },
          {
            path: '/info/futures',
            element: <Futures />,
          },
          {
            path: '/info/options',
            element: <Options />,
          },
          {
            path: '/info/index',
            element: <Index />,
          },
          {
            path: '/info/buyback',
            element: <Buyback />,
          },
          {
            path: '/info/preciousMetals',
            element: <PreciousMetals />,
          },
          {
            path: '/inquiry/offerAccessManage',
            element: <OfferAccessManage />,
          },
          {
            path: '/exception/404',
            element: <NotFound />,
          },
          {
            path: '/exception/403',
            element: <Forbidden />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
