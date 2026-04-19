/**
 * 路由配置
 * 基于 rmp_ui_test 的格式，与 UMI 风格保持一致
 */

export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path:'/login',
        component: './login',
      },
      {
        path: '/',
        component: '../layouts/TabsLayout',
        // 登录态拦截 -> 用户角色列表获取+有效性校验拦截 -> 菜单和功能获取+有效性校验
        wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc','@/wrappers/UseExtSys','@/wrappers/RouteGuard'],
        routes: [
          {
            // 欢迎页
            path: '/welcome',
            name: 'welcome',
            component: './welcome',
          },
          {
            // 报表查看
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
            path: '/rule-settings',
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
            // 规则管理 - 规则设置
            path: '/rule/ruleSetting',
            name: 'ruleSetting',
            component: './rule/settings',
          },
          {
            // 规则管理 - 动态维度
            path: '/rule/dynamicDimension',
            name: 'dynamicDimension',
            component: './rule/dynamic-dimension',
          },
          {
            // 规则管理 - 券池管理
            path: '/rule/securityPool',
            name: 'securityPool',
            component: './rule/security-pool',
          },
          {
            // 规则管理 - 席位组管理
            path: '/rule/seatGroup',
            name: 'seatGroup',
            component: './rule/seat-group',
          },
          {
            // 规则管理 - 账户组管理
            path: '/rule/accountGroup',
            name: 'accountGroup',
            component: './rule/account-group',
          },
          {
            // 规则管理 - 规则豁免管理
            path: '/affairs/ruleApproveExempt',
            name: 'exemptions',
            component: './rule/exemptions',
          },
          {
            // 权限管理- 角色管理
            path: '/authority/roleManage',
            name: 'roleManage',
            component: './role/manage',
          },
          {
            // 权限管理- 用户管理
            path: '/authority/userManage',
            name: 'userManage',
            component: './user/manage',
          },
          {
            // 权限管理- 流程管理
            path: '/affairs/processManage',
            name: 'processManage',
            component: './process/manage',
          },
          {
            // 运维管理 - 风控触警查询
            path: '/operations/riskControlAlarm',
            name: 'riskControlAlarm',
            component: './risk-control/alarm',
          },
          {
            // 期货期权设置
            path: '/rule/futureOptionLimit',
            name: 'futureOptionLimit',
            component: './rule/future-option-limit',
          },
          {
            // 通用限仓设置
            path: '/rule/generalLimit',
            name: 'generalLimit',
            component: './rule/general-limit',
          },
          {
            // 委托查询
            path: '/inquiry/entrustInquiry',
            name: 'entrustInquiry',
            component: './inquiry/entrust',
          },
          {
            // 挂单查询
            path: '/inquiry/pendingEntrust',
            name: 'pendingEntrust',
            component: './inquiry/pending-entrust',
          },
          {
            // 持仓查询
            path: '/inquiry/position',
            name: 'position',
            component: './inquiry/position',
          },
          {
            // 证券资讯管理-股票
            path: '/info/stocks',
            name: 'stocks',
            component: './info/stocks',
          },
          {
            // 证券资讯管理-债券
            path: '/info/bonds',
            name: 'bonds',
            component: './info/bonds',
          },
          {
            // 证券资讯管理-基金
            path: '/info/fund',
            name: 'fund',
            component: './info/fund',
          },
          {
            // 证券资讯管理-期货
            path: '/info/futures',
            name: 'futures',
            component: './info/futures',
          },
          {
            // 证券资讯管理-期权
            path: '/info/options',
            name: 'options',
            component: './info/options',
          },
          {
            // 证券资讯管理-指数
            path: '/info/index',
            name: 'index',
            component: './info/index',
          },
          {
            // 证券资讯管理-证券
            path: '/info/buyback',
            name: 'buyback',
            component: './info/buyback',
          },
          {
            // 证券资讯管理-贵金属
            path: '/info/preciousMetals',
            name: 'preciousMetals',
            component: './info/preciousMetals',
          },
          {
            //运维-报盘段接入管理
            path: '/inquiry/offerAccessManage',
            name: 'offerAccessManage',
            component: './inquiry/offer-access-manage',
          },
          {
            name: '404',
            path: '/exception',
            component: './exception/404',
          },
          {
            name: '403',
            path: '/exception',
            component: './exception/403',
          },
          {
            component: './exception/404',
          },
        ],
      },
    ],
  },
];

// 导出路由配置
export const getRoutes = () => {
  return [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path:'/login',
          component: './login',
        },
        {
          path: '/',
          component: '../layouts/TabsLayout',
          wrappers: ['@/wrappers/LoginStatusCheckPoint', '@/wrappers/UserRole', '@/wrappers/MenuFunc','@/wrappers/UseExtSys','@/wrappers/RouteGuard'],
          routes: [
            {
              // 欢迎页
              path: '/welcome',
              name: 'welcome',
              component: './welcome',
            },
            {
              // 报表查看
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
              path: '/rule-settings',
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
              sibling: true,
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
              path: '/single-route-edit/:id',
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
      ],
    },
  ];
};