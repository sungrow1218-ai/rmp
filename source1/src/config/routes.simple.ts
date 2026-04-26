/**
 * 简洁版路由配置
 * 用于渐进式重构
 */

export interface RouteItem {
  path: string;
  name: string;
  component: string; // 组件路径，如 './pages/Login'
  exact?: boolean;
  wrappers?: string[]; // 包装器，如 ['@/wrappers/LoginStatusCheckPoint']
  meta?: {
    title: string;
    icon?: string;
    requiresAuth?: boolean;
    hideInMenu?: boolean;
  };
}

// 路由配置数组
const routes: RouteItem[] = [
  // 公共路由
  {
    path: '/login',
    name: 'login',
    component: './pages/login/Login',
    meta: {
      title: '登录',
      requiresAuth: false,
      hideInMenu: true,
    },
  },

  // 受保护的路由
  {
    path: '/',
    name: 'report',
    component: './pages/report/ReportView',
    exact: true,
    wrappers: ['@/wrappers/LoginStatusCheckPoint','@/wrappers/UserRole'],
    meta: {
      title: '报表查看',
      icon: 'dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/quota-manage',
    name: 'quotaManage',
    component: './pages/quota/QuotaManagement',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '额度管理',
      icon: 'money-collect',
      requiresAuth: true,
    },
  },
  {
    path: '/quota-adjustment',
    name: 'quotaAdjustment',
    component: './pages/quota/QuotaAdjustment',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '额度调整',
      icon: 'edit',
      requiresAuth: true,
    },
  },
  {
    path: '/process',
    name: 'process',
    component: './pages/process/ProcessManagement',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '流程管理',
      icon: 'project',
      requiresAuth: true,
    },
  },
  {
    path: '/rule/ruleSetting',
    name: 'ruleSettings',
    component: './pages/rule/RuleSettings',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '规则设置',
      icon: 'setting',
      requiresAuth: true,
    },
  },
  {
    path: '/rule-create',
    name: 'ruleCreate',
    component: './pages/rule/RuleCreate',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '规则创建',
      icon: 'plus',
      requiresAuth: true,
    },
  },
  {
    path: '/single-rule-create',
    name: 'singleRuleCreate',
    component: './pages/rule/SingleRuleCreate',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '单规则创建',
      icon: 'file-add',
      requiresAuth: true,
    },
  },
  {
    path: '/rule-edit/:id',
    name: 'ruleEdit',
    component: './pages/rule/RuleEdit',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '规则编辑',
      icon: 'edit',
      requiresAuth: true,
      hideInMenu: true,
    },
  },
  {
    path: '/single-rule-edit/:id',
    name: 'singleRuleEdit',
    component: './pages/rule/SingleRuleEdit',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '单规则编辑',
      icon: 'edit',
      requiresAuth: true,
      hideInMenu: true,
    },
  },
  {
    path: '/rule-view/:id',
    name: 'ruleView',
    component: './pages/rule/RuleView',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '规则查看',
      icon: 'eye',
      requiresAuth: true,
      hideInMenu: true,
    },
  },
  {
    path: '/single-rule-view/:id',
    name: 'singleRuleView',
    component: './pages/rule/SingleRuleView',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '单规则查看',
      icon: 'eye',
      requiresAuth: true,
      hideInMenu: true,
    },
  },
  {
    path: '/account-group',
    name: 'accountGroup',
    component: './pages/account-group',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '账户组管理',
      icon: 'team',
      requiresAuth: true,
    },
  },
  {
    path: '/security-group',
    name: 'securityGroup',
    component: './pages/security-group/SecurityGroupManagement',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '安全组管理',
      icon: 'safety',
      requiresAuth: true,
    },
  },
  {
    path: '/alert-query',
    name: 'alertQuery',
    component: './pages/alert/query',
    wrappers: ['@/wrappers/LoginStatusCheckPoint'],
    meta: {
      title: '告警查询',
      icon: 'alert',
      requiresAuth: true,
    },
  },
];

export default routes;
