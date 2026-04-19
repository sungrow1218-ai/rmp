/**
 * !!! 注意: 这里的hash路由，在 umi 编译时会被统一添加上 ./config.ts 中的 hashPrefix 配置项
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
            component: './welcome',   // pages文件夹下
          },
          {
            // 规则管理 - 规则设置
            path: '/rule/ruleSetting',
            name: 'ruleSetting',
            component: './ruleSetting',
          },
          {
            // 规则管理 - 动态维度
            path: '/rule/dynamicDimension',
            name: 'dynamicDimension',
            component: './dynamicDimension',
          },
          {
            // 规则管理 - 券池管理
            path: '/rule/securityPool',
            name: 'securityPool',
            component: './securityPool',
          },
          {
            // 规则管理 - 席位组管理
            path: '/rule/seatGroup',
            name: 'seatGroup',
            component: './seatGroup',
          },
           {
            // 规则管理 - 账户组管理
            path: '/rule/accountGroup',
            name: 'accountGroup',
            component: './accountGroup',
          },
          {
            // 规则管理 - 规则豁免管理
            path: '/affairs/ruleApproveExempt',
            name: 'exemptions',
            component: './exemptions',
          },
          {
            // 权限管理- 角色管理
            path: '/authority/roleManage',
            name: 'roleManage',
            component: './roleManage',
          },
          {
            // 权限管理- 用户管理
            path: '/authority/userManage',
            name: 'userManage',
            component: './userManage',
          },
          {
            // 权限管理- 流程管理
            path: '/affairs/processManage',
            name: 'processManage',
            component: './processManage',
          },
          {
            // 运维管理 - 风控触警查询
            path: '/operations/riskControlAlarm',
            name: 'riskControlAlarm',
            component: './riskControlAlarm',
          },
          {
            // 期货期权设置
            path: '/rule/futureOptionLImit',
            name: 'futuresOptions',
            component: './futuresOptions',
          },
          {
            // 通用限仓设置
            path: '/rule/generalLimit',
            name: 'generalLimit',
            component: './generalLimit',
          },
          {
            // 委托查询
            path: '/inquiry/entrustInquiry',
            name: 'entrust',
            component: './entrust',
          },
          {
            // 挂单查询
            path: '/inquiry/pendingEntrust',
            name: 'pendingEntrust',
            component: './pendingEntrust',
          },
          {
            // 持仓查询
            path: '/inquiry/position',
            name: 'position',
            component: './position',
          },
          {
            // 证券资讯管理-股票
            path: '/info/stocks',
            name: 'stocks',
            component: './infoStocks',
          },
          {
            // 证券资讯管理-债券
            path: '/info/bonds',
            name: 'bonds',
            component: './infoBonds',
          },
          {
            // 证券资讯管理-基金
            path: '/info/fund',
            name: 'fund',
            component: './infoFund',
          },
          ///info/futuresAndOptions
          // {
          //   // 证券资讯管理-期货期权
          //   path: '/info/futuresAndOptions',
          //   name: 'futuresAndOptions',
          //   component: './infofuturesAndOptions',
          // },
          {
            // 证券资讯管理-期货
            path: '/info/futures',
            name: 'future',
            component: './infoFuture',
          },
          {
            // 证券资讯管理-期货
            path: '/info/options',
            name: 'option',
            component: './infoOption',
          },
          {
            // 证券资讯管理-指数
            path: '/info/index',
            name: 'index',
            component: './infoIndex',
          },
          {
            // 证券资讯管理-证券
            path: '/info/buyback',
            name: 'buyback',
            component: './infoBuyback',
          },
          {
            // 证券资讯管理-贵金属
            path: '/info/preciousMetals',
            name: 'preciousMetals',
            component: './infoPreciousMetals',
          },
          {
            //运维-报盘段接入管理
            path: '/inquiry/offerAccessManage',
            name: 'offerAccessManage',
            component: './offerAccessManage',
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
