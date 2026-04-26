// 模拟API服务
// 用于开发环境，提供与真实API相同的接口

import {
  CommonResponseIWrapper,
  CommonResponseWrapper,
  MenuItemType,
  FunctionItemType,
  WorkGroupList,
  RoleItemType,
  UserInfoResponseDataType,
} from './api';

// 模拟菜单数据 - 基于rmp_ui_test的菜单结构
const mockMenuData: MenuItemType[] = [
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
];

// 模拟工作台数据
const mockWorkGroupData: WorkGroupList[] = [
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
];

// 模拟用户角色数据
const mockRoleData: RoleItemType[] = [
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
  {
    roleId: 3,
    roleName: '合规专员',
    roleRemark: '合规相关操作权限',
    createUserNo: 'system',
    updateUserNo: 'system',
    createDateTime: Date.now(),
    lastUpdateTime: Date.now(),
  },
];

// 模拟用户信息数据
const mockUserInfoData: UserInfoResponseDataType = {
  displayName: '系统管理员',
  department: '风险管理部',
  mail: 'admin@htsc.com',
  mobile: '13800138000',
};

// 模拟API响应
const createMockResponse = <T>(
  data: T,
  errorId: number = 0,
  errorMessage: string = 'success'
): CommonResponseIWrapper<T> => ({
  code: errorId,
  errorId,
  message: errorMessage,
  errorMessage,
  data,
});

// 模拟查询菜单权限
export const mockGetMenuByRole = async (
  params: any
): Promise<CommonResponseWrapper<{ resultList: MenuItemType[] }>> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 300));

  return createMockResponse({
    resultList: mockMenuData,
    total: mockMenuData.length,
    page: params.pageId || 1,
    pageSize: params.pageSize || 1000,
  });
};

// 模拟查询工作台
export const mockQueryWorkGroup = async (
  params: any
): Promise<CommonResponseWrapper<{ resultList: WorkGroupList[] }>> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 200));

  return createMockResponse({
    resultList: mockWorkGroupData,
    total: mockWorkGroupData.length,
    page: params.pageId || 1,
    pageSize: params.pageSize || 1000,
  });
};

// 模拟查询用户角色
export const mockGetCurrentUserRoles = async (
  params: any
): Promise<CommonResponseWrapper<{ resultList: RoleItemType[] }>> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 250));

  return createMockResponse({
    resultList: mockRoleData,
    total: mockRoleData.length,
    page: params.pageId || 1,
    pageSize: params.pageSize || 1000,
  });
};

// 模拟查询用户信息
export const mockUserInfo = async (): Promise<
  CommonResponseIWrapper<UserInfoResponseDataType>
> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 150));

  return createMockResponse(mockUserInfoData);
};

// 模拟登录
export const mockUserLogin = async (
  params: any
): Promise<CommonResponseIWrapper<{ token: string }>> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 500));

  return createMockResponse({
    token: 'mock-jwt-token-1234567890',
  });
};

// 模拟登出
export const mockUserLogout = async (): Promise<
  CommonResponseIWrapper<never>
> => {
  // 模拟网络延迟

  await new Promise(resolve => setTimeout(resolve, 100));

  return createMockResponse({} as never);
};

// 模拟Token校验
export const mockValidateToken = async (): Promise<
  CommonResponseIWrapper<string>
> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  return createMockResponse('018566');
};

// 模拟查询菜单配置
export const mockQueryMenuConfig = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  // 构建符合IRuleConfiguration结构的示例数据
  const displayConfig = JSON.stringify({
    Id: "1",
    Name: "规则配置",
    workGroupList: [
      {
        WorkGroupId: 1,
        WorkGroupName: "默认工作台",
        RuleTypeList: {
          rule: [
            {
              Id: "abnormal",
              Name: "异常交易类",
              SubList: [
                {
                  Id: "manipulation",
                  Name: "拉抬打压",
                  SubList: [
                    { Id: "Z01101", Name: "开盘集合竞价阶段拉抬打压控制", SubList: [] },
                    { Id: "Z01102", Name: "连续竞价阶段拉抬打压控制", SubList: [] }
                  ]
                },
                {
                  Id: "false_declaration",
                  Name: "虚假申报",
                  SubList: [
                    { Id: "Z01201", Name: "开盘集合竞价阶段虚假申报控制", SubList: [] },
                    { Id: "Z01202", Name: "连续竞价阶段虚假申报控制", SubList: [] }
                  ]
                },
                {
                  Id: "self_trading",
                  Name: "自买自卖",
                  SubList: [
                    { Id: "Z01301", Name: "开盘集合竞价阶段自买自卖控制", SubList: [] },
                    { Id: "Z01302", Name: "连续竞价阶段自买自卖控制", SubList: [] }
                  ]
                }
              ]
            },
            {
              Id: "large_order",
              Name: "大额申报类",
              SubList: [
                {
                  Id: "stock_large_order",
                  Name: "股票大额申报",
                  SubList: [
                    { Id: "Z03101", Name: "大额申报监控", SubList: [] }
                  ]
                },
                {
                  Id: "derivative_large_order",
                  Name: "衍生品大额申报",
                  SubList: [
                    { Id: "Z03201", Name: "债券交易大额申报监控", SubList: [] },
                    { Id: "Z03202", Name: "期货交易大额申报监控", SubList: [] },
                    { Id: "Z03203", Name: "期权交易大额申报监控", SubList: [] }
                  ]
                }
              ]
            }
          ],
          template: [
            {
              Id: "abnormal",
              Name: "异常交易类",
              SubList: [
                {
                  Id: "manipulation",
                  Name: "拉抬打压",
                  SubList: [
                    { Id: "Z01101", Name: "开盘集合竞价阶段拉抬打压控制", SubList: [] },
                    { Id: "Z01102", Name: "连续竞价阶段拉抬打压控制", SubList: [] }
                  ]
                },
                {
                  Id: "false_declaration",
                  Name: "虚假申报",
                  SubList: [
                    { Id: "Z01201", Name: "开盘集合竞价阶段虚假申报控制", SubList: [] },
                    { Id: "Z01202", Name: "连续竞价阶段虚假申报控制", SubList: [] }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        WorkGroupId: 2,
        WorkGroupName: "测试工作台",
        RuleTypeList: {
          rule: [],
          template: []
        }
      }
    ]
  });

  return createMockResponse({
    resultList: [
      { menuId: 1, displayConfig },
      { menuId: 2, displayConfig: '{"theme":"light","layout":"top"}' },
    ],
    total: 2,
    page: params.pageId || 1,
    pageSize: 1000,
  });
};

// 模拟查询用户菜单配置
export const mockQueryUserMenuConfiguration = async (
  params: any
): Promise<CommonResponseWrapper<any>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 180));

  return createMockResponse({
    resultList: [
      {
        userCode: '018566',
        menuId: 1,
        configuration: '{"displayMode":"list","pageSize":20}',
      },
      {
        userCode: '018566',
        menuId: 2,
        configuration: '{"displayMode":"grid","pageSize":50}',
      },
    ],
    total: 2,
    page: 1,
    pageSize: 1000,
  });
};

// 模拟修改用户菜单配置
export const mockAlterUserMenuConfiguration = async (
  params: any
): Promise<CommonResponseIWrapper<any>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 220));

  return createMockResponse({
    userCode: params.userCode,
    menuId: params.menuId,
    configuration: params.configuration,
  });
};

// 模拟API服务
export const mockApi = {
  // 认证相关
  userLogin: mockUserLogin,
  userLogout: mockUserLogout,
  userInfo: mockUserInfo,
  validateToken: mockValidateToken,

  // 角色相关

  getCurrentUserRoles: mockGetCurrentUserRoles,

  // 菜单相关
  getMenuByRole: mockGetMenuByRole,
  queryWorkGroup: mockQueryWorkGroup,
  queryMenuConfig: mockQueryMenuConfig,
  queryUserMenuConfiguration: mockQueryUserMenuConfiguration,
  alterUserMenuConfiguration: mockAlterUserMenuConfiguration,
};

export default mockApi;