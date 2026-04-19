// 环境配置
// 参考rmp_ui_test项目的配置

// 应用配置
export const AppConfig = {
  appName: 'riskControlPlatform',
  assetPrefix: '/rmp/aegis/',
};

// API配置
export const ApiConfig = {
  // API基础路径
  baseURL: '/rmp',

  // 接口超时时间（毫秒）
  timeout: 180000, // 3分钟

  // 是否使用模拟数据
  useMockData: import.meta.env.DEV,

  // 代理配置
  proxy: {
    dev: {
      '/rmp/api': {
        target: 'http://10.102.82.119:1080', // 监控SIT
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/rmp\/api/, ''),
      },
      '/rmp/aegis/api': {
        target: 'http://10.102.82.119:11084', // 监控SIT
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/rmp\/aegis\/api/, ''),
      },
    },
  },

  // 错误码配置
  errorCodes: {
    SUCCESS: 0,
    TOKEN_EXPIRED: 90005,
    NO_AUTH: 30000,
  },
};

// 登录认证配置
export const AuthConfig = {
  // Token Cookie键名
  tokenKey: 'risk-manage-token',

  // 登录相关路径
  loginPath: '/login',
  entryPath: '/',

  // API端点
  endpoints: {
    login: '/aegis/api/authority/login',
    logout: '/aegis/api/authority/logout',
    validate: '/aegis/api/authority/validate',
    userInfo: '/aegis/api/authority/userInfo',
    userRoles: '/aegis/api/authority/queryUserRolesByLoginUserId',
  },

  // EIP环境判断
  eipHostnameRegex: /\beip(?!(new|uat|dev|sit)\b)/i,

  // 重定向配置
  redirect: {
    login: (isEip: boolean) => {
      const { protocol, host, pathname } = window.location;
      if (isEip) {
        return `${protocol}//${host}${pathname}`;
      } else {
        return `${protocol}//${host}${pathname}#/login`;
      }
    },
    entry: () => {
      const { protocol, host, pathname } = window.location;
      return `${protocol}//${host}${pathname}#/`;
    },
  },
};

// 菜单配置
export const MenuConfig = {
  // 默认菜单数据（当API不可用时使用）
  defaultMenuData: [
    {
      menuId: 1,
      menuName: '规则管理',
      parentMenuId: -1,
      menuUrl: '/rule-settings',
      functionList: [
        { functionId: 1, functionName: '新增规则', functionDescrip: '创建新规则' },
        { functionId: 2, functionName: '编辑规则', functionDescrip: '修改现有规则' },
        { functionId: 3, functionName: '删除规则', functionDescrip: '删除规则' },
      ],
    },
    {
      menuId: 2,
      menuName: '规则设置',
      parentMenuId: 1,
      menuUrl: '/rule-settings',
      functionList: [
        { functionId: 1, functionName: '新增规则', functionDescrip: '创建新规则' },
        { functionId: 2, functionName: '编辑规则', functionDescrip: '修改现有规则' },
        { functionId: 3, functionName: '删除规则', functionDescrip: '删除规则' },
      ],
    },
    {
      menuId: 3,
      menuName: '账户组管理',
      parentMenuId: 1,
      menuUrl: '/account-group',
      functionList: [
        { functionId: 4, functionName: '新增账户组', functionDescrip: '创建新账户组' },
        { functionId: 5, functionName: '编辑账户组', functionDescrip: '修改账户组' },
      ],
    },
    {
      menuId: 4,
      menuName: '证券组管理',
      parentMenuId: 1,
      menuUrl: '/security-group',
      functionList: [
        { functionId: 6, functionName: '新增证券组', functionDescrip: '创建新证券组' },
        { functionId: 7, functionName: '编辑证券组', functionDescrip: '修改证券组' },
      ],
    },
    {
      menuId: 5,
      menuName: '综合查询',
      parentMenuId: -1,
      menuUrl: '/alert-query',
      functionList: [
        { functionId: 8, functionName: '查询触警', functionDescrip: '查询风控触警信息' },
        { functionId: 9, functionName: '导出数据', functionDescrip: '导出触警数据' },
      ],
    },
    {
      menuId: 6,
      menuName: '触警信息查询',
      parentMenuId: 5,
      menuUrl: '/alert-query',
      functionList: [
        { functionId: 8, functionName: '查询触警', functionDescrip: '查询风控触警信息' },
        { functionId: 9, functionName: '导出数据', functionDescrip: '导出触警数据' },
      ],
    },
    {
      menuId: 7,
      menuName: '事务管理',
      parentMenuId: -1,
      menuUrl: '/process',
      functionList: [
        { functionId: 10, functionName: '审批流程', functionDescrip: '审批待办流程' },
        { functionId: 11, functionName: '查看详情', functionDescrip: '查看流程详情' },
      ],
    },
    {
      menuId: 8,
      menuName: '流程列表',
      parentMenuId: 7,
      menuUrl: '/process',
      functionList: [
        { functionId: 10, functionName: '审批流程', functionDescrip: '审批待办流程' },
        { functionId: 11, functionName: '查看详情', functionDescrip: '查看流程详情' },
      ],
    },
    {
      menuId: 9,
      menuName: '报表管理',
      parentMenuId: -1,
      menuUrl: '/',
      functionList: [
        { functionId: 12, functionName: '查询报表', functionDescrip: '查询股票集中度' },
        { functionId: 13, functionName: '导出报表', functionDescrip: '导出报表数据' },
      ],
    },
    {
      menuId: 10,
      menuName: '股票集中度查询',
      parentMenuId: 9,
      menuUrl: '/',
      functionList: [
        { functionId: 12, functionName: '查询报表', functionDescrip: '查询股票集中度' },
        { functionId: 13, functionName: '导出报表', functionDescrip: '导出报表数据' },
      ],
    },
    {
      menuId: 11,
      menuName: '集中度额度管理',
      parentMenuId: 9,
      menuUrl: '/quota-manage',
      functionList: [
        { functionId: 14, functionName: '调整额度', functionDescrip: '调整集中度额度' },
        { functionId: 15, functionName: '批量调整', functionDescrip: '批量调整额度' },
      ],
    },
  ],

  // 默认工作台数据
  defaultWorkGroupData: [
    {
      workGroupId: 1,
      workGroupName: '交易室合规风控工作台',
      sobId: 1,
    },
    {
      workGroupId: 2,
      workGroupName: '经纪业务风控工作台',
      sobId: 2,
    },
    {
      workGroupId: 3,
      workGroupName: '自营业务风控工作台',
      sobId: 3,
    },
    {
      workGroupId: 4,
      workGroupName: 'QFII业务风控工作台',
      sobId: 4,
    },
  ],

  // 默认角色数据
  defaultRoleData: [
    {
      roleId: 1,
      roleName: '系统管理员',
      roleRemark: '拥有所有权限',
      createUserNo: 'system',
      updateUserNo: 'system',
      createDateTime: Date.now(),
      lastUpdateTime: Date.now(),
    },
    {
      roleId: 2,
      roleName: '风控专员',
      roleRemark: '风控相关操作权限',
      createUserNo: 'system',
      updateUserNo: 'system',
      createDateTime: Date.now(),
      lastUpdateTime: Date.now(),
    },
  ],
};

// 路由配置
export const RouteConfig = {
  // 需要权限校验的路由
  protectedRoutes: [
    '/',
    '/quota-manage',
    '/process',
    '/rule-settings',
    '/rule-create',
    '/single-rule-create',
    '/rule-edit/:id',
    '/single-rule-edit/:id',
    '/rule-view/:id',
    '/single-rule-view/:id',
    '/account-group',
    '/security-group',
    '/alert-query',
  ],

  // 公开路由（不需要权限校验）
  publicRoutes: [
    '/login',
    '/exception/403',
    '/exception/404',
    '/exception/500',
  ],

  // 默认重定向
  defaultRedirect: '/',

  // 无权限重定向
  noPermissionRedirect: '/exception/403',

  // 未登录重定向
  notLoggedInRedirect: '/login',
};

// 导出所有配置
export default {
  AppConfig,
  ApiConfig,
  MenuConfig,
  RouteConfig,
};