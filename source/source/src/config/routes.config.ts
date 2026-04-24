import { lazy } from 'react';

// 原有基础页面
const Login = lazy(() => import('@/pages/login/Login'));
const Layout = lazy(() => import('@/components/Layout'));
const Welcome = lazy(() => import('@/pages/welcome/Welcome'));
const Exception403 = lazy(() => import('@/pages/exception/403').catch(() => ({ default: () => <div>403 Forbidden</ div > })));
const Exception404 = lazy(() => import('@/pages/exception/404').catch(() => ({ default: () => <div>404 Not Found</ div > })));

// 规则设置子菜单（独立目录）
const RuleSettings = lazy(() => import('@/pages/ruleSetting/RuleSettings'));
const DynamicDimension = lazy(() => import('@/pages/dynamicDimension/DynamicDimension'));
const SecurityPool = lazy(() => import('@/pages/securityPool/SecurityPool'));
const SeatGroup = lazy(() => import('@/pages/seatGroup/SeatGroup'));
const AccountGroup = lazy(() => import('@/pages/accountGroup/AccountGroupManagement'));
const FutureOptionLimit = lazy(() => import('@/pages/futureOptionLimit/FutureOptionLimit'));
const GeneralLimit = lazy(() => import('@/pages/generalLimit/GeneralLimit'));

// 审批流程/流程管理
const RuleApproveExempt = lazy(() => import('@/pages/affairs/RuleApproveExempt'));
const ProcessManage = lazy(() => import('@/pages/affairs/ProcessManage'));

// 权限管理
const RoleManage = lazy(() => import('@/pages/authority/RoleManage'));
const UserManage = lazy(() => import('@/pages/authority/UserManage'));

// 运维管理
const RiskControlAlarm = lazy(() => import('@/pages/operations/RiskControlAlarm'));

// 查询
const EntrustInquiry = lazy(() => import('@/pages/inquiry/EntrustInquiry'));
const PendingEntrust = lazy(() => import('@/pages/inquiry/PendingEntrust'));
const Position = lazy(() => import('@/pages/inquiry/Position'));
const OfferAccessManage = lazy(() => import('@/pages/inquiry/OfferAccessManage'));

// 证券资讯管理
const InfoStocks = lazy(() => import('@/pages/info/Stocks'));
const InfoBonds = lazy(() => import('@/pages/info/Bonds'));
const InfoFund = lazy(() => import('@/pages/info/Fund'));
const InfoFutures = lazy(() => import('@/pages/info/Futures'));
const InfoOptions = lazy(() => import('@/pages/info/Options'));
const InfoIndex = lazy(() => import('@/pages/info/Index'));
const InfoBuyback = lazy(() => import('@/pages/info/Buyback'));
const InfoPreciousMetals = lazy(() => import('@/pages/info/PreciousMetals'));

// 规则已存在的页面 (可以放后续调用的)
const RuleCreate = lazy(() => import('@/pages/rule/RuleCreate').catch(() => ({ default: () => <div>WIP </div> })));
const RuleEdit = lazy(() => import('@/pages/rule/RuleEdit').catch(() => ({ default: () => <div>WIP </div> })));
const RuleView = lazy(() => import('@/pages/rule/RuleView').catch(() => ({ default: () => <div>WIP </div> })));
const SingleRuleCreate = lazy(() => import('@/pages/rule/SingleRuleCreate').catch(() => ({ default: () => <div>WIP </div> })));

// 示例页面
const AccountSystemExamplePage = lazy(() => import('@/pages/example/AccountSystemExamplePage').catch(() => ({ default: () => <div>示例页面加载中...</div> })));
const SingleRuleEdit = lazy(() => import('@/pages/rule/SingleRuleEdit').catch(() => ({ default: () => <div>WIP </div> })));
const SingleRuleView = lazy(() => import('@/pages/rule/SingleRuleView').catch(() => ({ default: () => <div>WIP </div> })));

export interface RouteConfig {
  path: string;
  name: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  wrappers?: string[];
  children?: RouteConfig[];
  meta?: {
    title?: string;
    icon?: string;
    requiresAuth?: boolean;
    hideInMenu?: boolean;
  };
}

export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录', requiresAuth: false, hideInMenu: true },
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc', '@/wrappers/UseExtSys', '@/wrappers/RouteGuard'],
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome, meta: { title: '欢迎页面', icon: 'home', requiresAuth: true } },

      // 规则设置子菜单（独立路径）
      { path: '/ruleSetting', name: 'ruleSetting', component: RuleSettings, meta: { title: '规则设置', requiresAuth: true } },
      { path: '/dynamicDimension', name: 'dynamicDimension', component: DynamicDimension, meta: { title: '动态维度', requiresAuth: true } },
      { path: '/securityPool', name: 'securityPool', component: SecurityPool, meta: { title: '证券池管理', requiresAuth: true } },
      { path: '/seatGroup', name: 'seatGroup', component: SeatGroup, meta: { title: '席位组管理', requiresAuth: true } },
      { path: '/accountGroup', name: 'accountGroup', component: AccountGroup, meta: { title: '账户组管理', requiresAuth: true } },
      { path: '/futureOptionLimit', name: 'futureOptionLimit', component: FutureOptionLimit, meta: { title: '期货期权限制', requiresAuth: true } },
      { path: '/generalLimit', name: 'generalLimit', component: GeneralLimit, meta: { title: '通用限买管理', requiresAuth: true } },

      // 审批/流程管理
      { path: '/affairs/ruleApproveExempt', name: 'ruleApproveExempt', component: RuleApproveExempt, meta: { title: '审批豁免管理', requiresAuth: true } },
      { path: '/affairs/processManage', name: 'processManage', component: ProcessManage, meta: { title: '流程管理', requiresAuth: true } },

      // 权限管理
      { path: '/authority/roleManage', name: 'roleManage', component: RoleManage, meta: { title: '角色管理', requiresAuth: true } },
      { path: '/authority/userManage', name: 'userManage', component: UserManage, meta: { title: '用户管理', requiresAuth: true } },

      // 运维管理
      { path: '/operations/riskControlAlarm', name: 'riskControlAlarm', component: RiskControlAlarm, meta: { title: '风控告警查询', requiresAuth: true } },

      // 查询
      { path: '/inquiry/entrustInquiry', name: 'entrustInquiry', component: EntrustInquiry, meta: { title: '委托查询', requiresAuth: true } },
      { path: '/inquiry/pendingEntrust', name: 'pendingEntrust', component: PendingEntrust, meta: { title: '业务查询', requiresAuth: true } },
      { path: '/inquiry/position', name: 'position', component: Position, meta: { title: '持仓查询', requiresAuth: true } },
      { path: '/inquiry/offerAccessManage', name: 'offerAccessManage', component: OfferAccessManage, meta: { title: '报价准入管理', requiresAuth: true } },

      // 证券资讯管理
      { path: '/info/stocks', name: 'stocks', component: InfoStocks, meta: { title: '股票', requiresAuth: true } },
      { path: '/info/bonds', name: 'bonds', component: InfoBonds, meta: { title: '债券', requiresAuth: true } },
      { path: '/info/fund', name: 'fund', component: InfoFund, meta: { title: '基金', requiresAuth: true } },
      { path: '/info/futures', name: 'futures', component: InfoFutures, meta: { title: '期货', requiresAuth: true } },
      { path: '/info/options', name: 'options', component: InfoOptions, meta: { title: '期权', requiresAuth: true } },
      { path: '/info/index', name: 'index', component: InfoIndex, meta: { title: '指数', requiresAuth: true } },
      { path: '/info/buyback', name: 'buyback', component: InfoBuyback, meta: { title: '回购', requiresAuth: true } },
      { path: '/info/preciousMetals', name: 'preciousMetals', component: InfoPreciousMetals, meta: { title: '贵金属', requiresAuth: true } },

      // 规则编辑页面 (可以放在内部跳转使用)
      // { path: '/rule-create', name: 'ruleCreate', component: RuleCreate, meta: { hideInMenu: true, requiresAuth: true } },
      // { path: '/rule-edit/:id', name: 'ruleEdit', component: RuleEdit, meta: { hideInMenu: true, requiresAuth: true } },
      // { path: '/rule-view/:id', name: 'ruleView', component: RuleView, meta: { hideInMenu: true, requiresAuth: true } },
      // { path: '/single-rule-create', name: 'singleRuleCreate', component: SingleRuleCreate, meta: { hideInMenu: true, requiresAuth: true } },
      // { path: '/single-rule-edit/:id', name: 'singleRuleEdit', component: SingleRuleEdit, meta: { hideInMenu: true, requiresAuth: true } },
      // { path: '/single-rule-view/:id', name: 'singleRuleView', component: SingleRuleView, meta: { hideInMenu: true, requiresAuth: true } },

      // 异常页面
      { path: '/exception/403', name: '403', component: Exception403, meta: { hideInMenu: true } },
      { path: '/exception/404', name: '404', component: Exception404, meta: { hideInMenu: true } },
      { path: '*', name: 'notFound', component: Exception404, meta: { hideInMenu: true } },
    ],
  },
];

export const allRoutes: RouteConfig[] = [...publicRoutes, ...protectedRoutes];

export const getRouteByName = (name: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.name === name) return route;
      if (route.children) {
        const found = findRoute(route.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  return findRoute(allRoutes);
};

export const getMenuRoutes = (): RouteConfig[] => {
  const extractMenuRoutes = (routes: RouteConfig[]): RouteConfig[] => {
    return routes
      .filter(route => route.meta && !route.meta.hideInMenu)
      .map(route => ({
        ...route,
        children: route.children ? extractMenuRoutes(route.children) : undefined,
      }));
  };
  return extractMenuRoutes(protectedRoutes);
};

export {
  Login, Layout, Welcome, Exception403, Exception404,
  RuleSettings, DynamicDimension, SecurityPool, SeatGroup, AccountGroup, FutureOptionLimit, GeneralLimit,
  RuleApproveExempt, ProcessManage, RoleManage, UserManage, RiskControlAlarm,
  EntrustInquiry, PendingEntrust, Position, OfferAccessManage,
  InfoStocks, InfoBonds, InfoFund, InfoFutures, InfoOptions, InfoIndex, InfoBuyback, InfoPreciousMetals,
  RuleCreate, RuleEdit, RuleView, SingleRuleCreate, SingleRuleEdit, SingleRuleView
};
