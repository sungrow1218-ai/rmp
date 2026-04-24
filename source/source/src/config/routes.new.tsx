import { lazy } from 'react';
import { createHashRouter, Navigate, type RouteObject } from 'react-router-dom';
import RootLayout, { MainLayoutWrapper } from '../layouts/RootLayout';
import BlankLayout from '../pages/login/BlankLayout';
import TabsLayout from '../components/Layout';

// Pages - lazy load
const Login = lazy(() => import('../pages/login/Login'));
const Welcome = lazy(() => import('../pages/welcome/Welcome'));
const RuleSetting = lazy(() => import('../pages/ruleSetting/RuleSettings'));
const DynamicDimension = lazy(() => import('../pages/dynamicDimension/DynamicDimension'));
const SecurityPool = lazy(() => import('../pages/securityPool/index'));
const SeatGroup = lazy(() => import('../pages/seatGroup/SeatGroup'));
const AccountGroup = lazy(() => import('../pages/accountGroup/index'));
const RuleApproveExempt = lazy(() => import('../pages/affairs/RuleApproveExempt'));
const RoleManage = lazy(() => import('../pages/authority/RoleManage'));
const UserManage = lazy(() => import('../pages/authority/UserManage'));
const ProcessManage = lazy(() => import('../pages/affairs/index'));
const RiskControlAlarm = lazy(() => import('../pages/operations/index'));
const FutureOptionLimit = lazy(() => import('../pages/futureOptionLimit/FutureOptionLimit'));
const GeneralLimit = lazy(() => import('../pages/generalLimit/GeneralLimit'));
const EntrustInquiry = lazy(() => import('../pages/inquiry/EntrustInquiry'));
const PendingEntrust = lazy(() => import('../pages/inquiry/PendingEntrust'));
const Position = lazy(() => import('../pages/inquiry/Position'));
const OfferAccessManage = lazy(() => import('../pages/inquiry/OfferAccessManage'));
const Stocks = lazy(() => import('../pages/info/Stocks'));
const Bonds = lazy(() => import('../pages/info/Bonds'));
const Fund = lazy(() => import('../pages/info/Fund'));
const Futures = lazy(() => import('../pages/info/Futures'));
const Options = lazy(() => import('../pages/info/Options'));
const Index = lazy(() => import('../pages/info/Index'));
const Buyback = lazy(() => import('../pages/info/Buyback'));
const PreciousMetals = lazy(() => import('../pages/info/PreciousMetals'));
const RuleCreate = lazy(() => import('../pages/rule/RuleCreate'));
const RuleEdit = lazy(() => import('../pages/rule/RuleEdit'));
const RuleView = lazy(() => import('../pages/rule/RuleView'));
const SingleRuleCreate = lazy(() => import('../pages/rule/SingleRuleCreate'));
const SingleRuleEdit = lazy(() => import('../pages/rule/SingleRuleEdit'));
const SingleRuleView = lazy(() => import('../pages/rule/SingleRuleView'));
const TestApi = lazy(() => import('../pages/test/TestApi'));
const NotFound = lazy(() => import('../pages/exception/404'));
const Forbidden = lazy(() => import('../pages/exception/403'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <BlankLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: '/',
            element: <MainLayoutWrapper />,
            children: [
              {
                element: <TabsLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="/welcome" replace />,
                  },
                  {
                    path: 'welcome',
                    element: <Welcome />,
                  },
                  {
                    path: 'rule',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/rule/ruleSetting" replace />,
                      },
                    ],
                  },
                  {
                    path: 'inquiry',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/inquiry/alertQuery" replace />,
                      },
                    ],
                  },
                  {
                    path: 'affairs',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/affairs/processManagement" replace />,
                      },
                    ],
                  },
                  {
                    path: 'operations',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/operations/operationsCalendar" replace />,
                      },
                    ],
                  },
                  {
                    path: 'rule/ruleSetting',
                    element: <RuleSetting />,
                  },
                  {
                    path: 'rule/dynamicDimension',
                    element: <DynamicDimension />,
                  },
                  {
                    path: 'rule/securityPool',
                    element: <SecurityPool />,
                  },
                  {
                    path: 'rule/seatGroup',
                    element: <SeatGroup />,
                  },
                  {
                    path: 'rule/accountGroup',
                    element: <AccountGroup />,
                  },
                  {
                    path: 'rule/futureOptionLImit',
                    element: <FutureOptionLimit />,
                  },
                  {
                    path: 'rule/generalLimit',
                    element: <GeneralLimit />,
                  },
                  {
                    path: 'affairs/ruleApproveExempt',
                    element: <RuleApproveExempt />,
                  },
                  {
                    path: 'affairs/processManage',
                    element: <ProcessManage />,
                  },
                  {
                    path: 'authority/roleManage',
                    element: <RoleManage />,
                  },
                  {
                    path: 'authority/userManage',
                    element: <UserManage />,
                  },
                  {
                    path: 'operations/riskControlAlarm',
                    element: <RiskControlAlarm />,
                  },
                  {
                    path: 'inquiry/entrustInquiry',
                    element: <EntrustInquiry />,
                  },
                  {
                    path: 'inquiry/pendingEntrust',
                    element: <PendingEntrust />,
                  },
                  {
                    path: 'inquiry/position',
                    element: <Position />,
                  },
                  {
                    path: 'inquiry/offerAccessManage',
                    element: <OfferAccessManage />,
                  },
                  {
                    path: 'test/api',
                    element: <TestApi />,
                  },
                  {
                    path: 'info/stocks',
                    element: <Stocks />,
                  },
                  {
                    path: 'info/bonds',
                    element: <Bonds />,
                  },
                  {
                    path: 'info/fund',
                    element: <Fund />,
                  },
                  {
                    path: 'info/futures',
                    element: <Futures />,
                  },
                  {
                    path: 'info/options',
                    element: <Options />,
                  },
                  {
                    path: 'info/index',
                    element: <Index />,
                  },
                  {
                    path: 'info/buyback',
                    element: <Buyback />,
                  },
                  {
                    path: 'info/preciousMetals',
                    element: <PreciousMetals />,
                  },
                  {
                    path: 'rule-create',
                    element: <RuleCreate />,
                  },
                  {
                    path: 'rule-edit/:id',
                    element: <RuleEdit />,
                  },
                  {
                    path: 'rule-view/:id',
                    element: <RuleView />,
                  },
                  {
                    path: 'single-rule-create',
                    element: <SingleRuleCreate />,
                  },
                  {
                    path: 'single-rule-edit/:id',
                    element: <SingleRuleEdit />,
                  },
                  {
                    path: 'single-rule-view/:id',
                    element: <SingleRuleView />,
                  },
                ],
              },
            ],
          },
        ],
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
];

const router = createHashRouter(routes);

export default router;


