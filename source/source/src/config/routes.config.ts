import { lazy } from 'react';

// ԭ�л���ҳ��
const Login = lazy(() => import('@/pages/login/Login'));
const Layout = lazy(() => import('@/components/Layout'));
const Welcome = lazy(() => import('@/pages/welcome/Welcome'));
const Exception403 = lazy(() => import('@/pages/exception/403').catch(() => ({ default: () => <div>403 Forbidden</ div > })));
const Exception404 = lazy(() => import('@/pages/exception/404').catch(() => ({ default: () => <div>404 Not Found</ div > })));

// �������
const RuleSettings = lazy(() => import('@/pages/rule/RuleSettings'));
const DynamicDimension = lazy(() => import('@/pages/rule/DynamicDimension'));
const SecurityPool = lazy(() => import('@/pages/rule/SecurityPool'));
const SeatGroup = lazy(() => import('@/pages/rule/SeatGroup'));
const AccountGroup = lazy(() => import('@/pages/rule/AccountGroup'));
const FutureOptionLimit = lazy(() => import('@/pages/rule/FutureOptionLimit'));
const GeneralLimit = lazy(() => import('@/pages/rule/GeneralLimit'));

// �������/���̹���
const RuleApproveExempt = lazy(() => import('@/pages/affairs/RuleApproveExempt'));
const ProcessManage = lazy(() => import('@/pages/affairs/ProcessManage'));

// Ȩ�޹���
const RoleManage = lazy(() => import('@/pages/authority/RoleManage'));
const UserManage = lazy(() => import('@/pages/authority/UserManage'));

// ��ά����
const RiskControlAlarm = lazy(() => import('@/pages/operations/RiskControlAlarm'));

// ��ѯ
const EntrustInquiry = lazy(() => import('@/pages/inquiry/EntrustInquiry'));
const PendingEntrust = lazy(() => import('@/pages/inquiry/PendingEntrust'));
const Position = lazy(() => import('@/pages/inquiry/Position'));
const OfferAccessManage = lazy(() => import('@/pages/inquiry/OfferAccessManage'));

// ֤ȯ��Ѷ����
const InfoStocks = lazy(() => import('@/pages/info/Stocks'));
const InfoBonds = lazy(() => import('@/pages/info/Bonds'));
const InfoFund = lazy(() => import('@/pages/info/Fund'));
const InfoFutures = lazy(() => import('@/pages/info/Futures'));
const InfoOptions = lazy(() => import('@/pages/info/Options'));
const InfoIndex = lazy(() => import('@/pages/info/Index'));
const InfoBuyback = lazy(() => import('@/pages/info/Buyback'));
const InfoPreciousMetals = lazy(() => import('@/pages/info/PreciousMetals'));

// �����Ѵ��ڵ�ҳ�� (�����Է������ط��õ�)
const RuleCreate = lazy(() => import('@/pages/rule/RuleCreate').catch(() => ({ default: () => <div>WIP </div> })));
const RuleEdit = lazy(() => import('@/pages/rule/RuleEdit').catch(() => ({ default: () => <div>WIP </div> })));
const RuleView = lazy(() => import('@/pages/rule/RuleView').catch(() => ({ default: () => <div>WIP </div> })));
const SingleRuleCreate = lazy(() => import('@/pages/rule/SingleRuleCreate').catch(() => ({ default: () => <div>WIP </div> })));
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
    meta: { title: '��¼', requiresAuth: false, hideInMenu: true },
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc', '@/wrappers/UseExtSys', '@/wrappers/RouteGuard'],
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome, meta: { title: '��ӭҳ��', icon: 'home', requiresAuth: true } },

      // �������
      { path: '/rule/ruleSetting', name: 'ruleSetting', component: RuleSettings, meta: { title: '��������', requiresAuth: true } },
      { path: '/rule/dynamicDimension', name: 'dynamicDimension', component: DynamicDimension, meta: { title: '��̬ά��', requiresAuth: true } },
      { path: '/rule/securityPool', name: 'securityPool', component: SecurityPool, meta: { title: 'ȯ�ع���', requiresAuth: true } },
      { path: '/rule/seatGroup', name: 'seatGroup', component: SeatGroup, meta: { title: 'ϯλ�����', requiresAuth: true } },
      { path: '/rule/accountGroup', name: 'accountGroup', component: AccountGroup, meta: { title: '�˻������', requiresAuth: true } },
      { path: '/rule/futureOptionLImit', name: 'futureOptionLImit', component: FutureOptionLimit, meta: { title: '�ڻ���Ȩ����', requiresAuth: true } },
      { path: '/rule/generalLimit', name: 'generalLimit', component: GeneralLimit, meta: { title: 'ͨ���޲�����', requiresAuth: true } },

      // ����/���̹���
      { path: '/affairs/ruleApproveExempt', name: 'ruleApproveExempt', component: RuleApproveExempt, meta: { title: '����������', requiresAuth: true } },
      { path: '/affairs/processManage', name: 'processManage', component: ProcessManage, meta: { title: '���̹���', requiresAuth: true } },

      // Ȩ�޹���
      { path: '/authority/roleManage', name: 'roleManage', component: RoleManage, meta: { title: '��ɫ����', requiresAuth: true } },
      { path: '/authority/userManage', name: 'userManage', component: UserManage, meta: { title: '�û�����', requiresAuth: true } },

      // ��ά����
      { path: '/operations/riskControlAlarm', name: 'riskControlAlarm', component: RiskControlAlarm, meta: { title: '��ش�����ѯ', requiresAuth: true } },

      // ��ѯ
      { path: '/inquiry/entrustInquiry', name: 'entrustInquiry', component: EntrustInquiry, meta: { title: 'ί�в�ѯ', requiresAuth: true } },
      { path: '/inquiry/pendingEntrust', name: 'pendingEntrust', component: PendingEntrust, meta: { title: '�ҵ���ѯ', requiresAuth: true } },
      { path: '/inquiry/position', name: 'position', component: Position, meta: { title: '�ֲֲ�ѯ', requiresAuth: true } },
      { path: '/inquiry/offerAccessManage', name: 'offerAccessManage', component: OfferAccessManage, meta: { title: '���̶ν������', requiresAuth: true } },

      // ֤ȯ��Ѷ����
      { path: '/info/stocks', name: 'stocks', component: InfoStocks, meta: { title: '��Ʊ', requiresAuth: true } },
      { path: '/info/bonds', name: 'bonds', component: InfoBonds, meta: { title: 'ծȯ', requiresAuth: true } },
      { path: '/info/fund', name: 'fund', component: InfoFund, meta: { title: '����', requiresAuth: true } },
      { path: '/info/futures', name: 'futures', component: InfoFutures, meta: { title: '�ڻ�', requiresAuth: true } },
      { path: '/info/options', name: 'options', component: InfoOptions, meta: { title: '��Ȩ', requiresAuth: true } },
      { path: '/info/index', name: 'index', component: InfoIndex, meta: { title: 'ָ��', requiresAuth: true } },
      { path: '/info/buyback', name: 'buyback', component: InfoBuyback, meta: { title: '�ع�', requiresAuth: true } },
      { path: '/info/preciousMetals', name: 'preciousMetals', component: InfoPreciousMetals, meta: { title: '�����', requiresAuth: true } },

      // ����༭��� (����������ڲ���תʹ��)
      { path: '/rule-create', name: 'ruleCreate', component: RuleCreate, meta: { hideInMenu: true, requiresAuth: true } },
      { path: '/rule-edit/:id', name: 'ruleEdit', component: RuleEdit, meta: { hideInMenu: true, requiresAuth: true } },
      { path: '/rule-view/:id', name: 'ruleView', component: RuleView, meta: { hideInMenu: true, requiresAuth: true } },
      { path: '/single-rule-create', name: 'singleRuleCreate', component: SingleRuleCreate, meta: { hideInMenu: true, requiresAuth: true } },
      { path: '/single-rule-edit/:id', name: 'singleRuleEdit', component: SingleRuleEdit, meta: { hideInMenu: true, requiresAuth: true } },
      { path: '/single-rule-view/:id', name: 'singleRuleView', component: SingleRuleView, meta: { hideInMenu: true, requiresAuth: true } },

      // �쳣ҳ��
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
