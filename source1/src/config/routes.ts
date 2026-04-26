/**
 * 路由配置
 * 基于 react-router-dom v6 的配置式路由
 */

export default [
  {
    path: '/login',
    name: 'login',
    component: './auth/login',
  },
  {
    path: '/',
    component: '../components/Layout',
    // 登录态拦截 -> 用户角色列表获取+有效性校验拦截 -> 菜单和功能获取+有效性校验
    wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc', '@/wrappers/RouteGuard'],
    routes: [
      {
        // 首页/报表查看
        path: '/',
        name: 'report',
        component: './report/view',
      },
      {
        // 额度管理
        path: '/quota-manage',
        name: 'quotaManage',
        component: './quota/management',
      },
      {
        // 额度调整
        path: '/quota-adjustment',
        name: 'quotaAdjustment',
        component: './quota/adjustment',
      },
      {
        // 流程管理
        path: '/process',
        name: 'process',
        component: './process/management',
      },
      {
        // 规则设置
        path: '/rule/ruleSetting',
        name: 'ruleSettings',
        component: './rule/settings',
      },
      {
        // 规则创建
        path: '/rule-create',
        name: 'ruleCreate',
        component: './rule/create',
      },
      {
        // 单规则创建
        path: '/single-rule-create',
        name: 'singleRuleCreate',
        component: './rule/single/create',
      },
      {
        // 规则编辑
        path: '/rule-edit/:id',
        name: 'ruleEdit',
        component: './rule/edit',
      },
      {
        // 单规则编辑
        path: '/single-rule-edit/:id',
        name: 'singleRuleEdit',
        component: './rule/single/edit',
      },
      {
        // 规则查看
        path: '/rule-view/:id',
        name: 'ruleView',
        component: './rule/view',
      },
      {
        // 单规则查看
        path: '/single-rule-view/:id',
        name: 'singleRuleView',
        component: './rule/single/view',
      },
      {
        // 账户组管理
        path: '/account-group',
        name: 'accountGroup',
        component: './account-group',
      },
      {
        // 账户系统接口示例
        path: '/example/account-system',
        name: 'accountSystemExample',
        component: './example/account-system',
      },
      {
        // 安全组管理
        path: '/security-group',
        name: 'securityGroup',
        component: './security/group',
      },
      {
        // 告警查询
        path: '/alert-query',
        name: 'alertQuery',
        component: './alert/query',
      },
      {
        // 404 页面
        path: '*',
        name: '404',
        component: './exception/404',
      },
    ],
  },
];
