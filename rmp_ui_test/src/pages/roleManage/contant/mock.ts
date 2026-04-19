import { PaginationType } from '@/components/Pagination/Pagination';
import { CommonResponseWrapper } from '@/services/typing';
import { RolePermissonProps } from './typing';
import { string } from 'prop-types';

const mockRequsest = async <T>(data: T) => {
  return new Promise<CommonResponseWrapper<T>>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data,
        message: 'success',
      });
    }, 1000);
  });
};
export async function queryRoleAccountAuthority() {
  return mockRequsest({
    pageId: 1,
    pageSize: 10000,
    resultList: [
      {
        roleId: 1,
        acctAuthList: [
          {
            departCode: '10001',
            departName: '证投',
            extSysId: 100,
            queryAuth: 0,
            operateAuth: 1,
          },

          {
            departCode: '10001',
            departName: '证投',
            extSysId: 209,
            queryAuth: 0,
            operateAuth: 1,
          },
          {
            departCode: '10001',
            extSysId: 398,
            queryAuth: 0,
            operateAuth: 0,
          },
          {
            departCode: '20001',
            extSysId: 188,
            queryAuth: 0,
            operateAuth: 0,
          },
          {
            departCode: '30001',
            extSysId: 18888,
            queryAuth: 0,
            operateAuth: 1,
          },
        ],
      },
    ],
  });
}
export async function queryRoleBaseInfo(
  param: {
    filterCondition?: RolePermissonProps[];
  } & PaginationType
) {
  return mockRequsest({
    pageId: 1,
    pageSize: 10000,
    resultList: [
      {
        roleId: 1001,
        roleName: '运营角色',
        roleDescrip: 'test111',
        roleStatus: 0,
        createUserNo: '20250108',
        updateUserNo: 'string',
        createDateTime: 'string',
        lastUpdatTime: 'string',
      },
      {
        roleId: 1002,
        roleName: '集团风控角色',
        roleDescrip: 'test集团风控角色',
        roleStatus: 0,
        createUserNo: '20250108',
        updateUserNo: 'string',
        createDateTime: 'string',
        lastUpdatTime: 'string',
      },
      {
        roleId: 1003,
        roleName: '集团合规角色',
        roleDescrip: 'test合规',
        roleStatus: 0,
        createUserNo: '20250108',
        updateUserNo: 'string',
        createDateTime: 'string',
        lastUpdatTime: 'string',
      },
      {
        roleId: 1004,
        roleName: '交易组员',
        roleDescrip: '交易组',
        roleStatus: 0,
        createUserNo: '20250108',
        updateUserNo: 'string',
        createDateTime: 'string',
        lastUpdatTime: 'string',
      },
    ],
  });
}
export async function queryRoleUsers(
  param: {
    filterCondition: RolePermissonProps;
  } & PaginationType
) {
  console.log(param, 'params');

  const array = [
    {
      roleId: 1001,
      roleName: '运营角色',
      userCode: '010271',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 1002,
      roleName: '集团风控角色',
      userCode: '010271',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 1002,
      roleName: '集团风控角色',
      userCode: '018566',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 10031,
      roleName: '交易室风控合规管理角色',
      userCode: '018566',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 1004,
      roleName: '系统运维角色',
      userCode: '018566',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 1003,
      roleName: '集团合规角色',
      userCode: '080212',
      lastUpdateTime: '1111111',
    },
    {
      roleId: 1004,
      roleName: '交易组员',
      userCode: '042390',
      lastUpdateTime: '1111111',
    },
  ];
  return mockRequsest({
    pageId: 1,
    pageSize: 10000,
    resultList: !param.filterCondition.userCode
      ? array
      : array.filter((r) =>
          r.userCode.includes(param.filterCondition.userCode)
        ),
  });
}

export async function getMenuInfo() {
  return mockRequsest({
    pageId: 1,
    pageSize: 10000,
    resultList: [
      {
        menuId: 1,
        menuName: '规则管理',
        menuUrl: '/rule',
        parentMenuId: -1,
        workGroupId: 2,
        functionList: [
          {
            functionId: 1,
            functionName: '用户管理',
            functionDescrip: '管理用户使用',
          },
          {
            functionId: 2,
            functionName: '用户权限',
            functionDescrip: '管理用户权限',
          },
        ],
      },
      {
        menuId: 81,
        menuName: '风控触警查询-1',
        menuUrl: '/operations/riskControlAlarm/5',
        parentMenuId: 3,
        workGroupId: 2,
      },
      {
        menuId: 8,
        menuName: '券池管理',
        menuUrl: '/rule/securityPool',
        parentMenuId: 1,
        workGroupId: 2,
      },
      {
        menuId: 7,
        menuName: '动态维度',
        menuUrl: '/rule/dynamicDimension',
        parentMenuId: 1,
        workGroupId: 2,
      },
      {
        menuId: 45,
        menuName: '委托查询-1',
        menuUrl: '/inquiry/entrustInquiry/6',
        parentMenuId: 5,
        workGroupId: 2,
      },
      {
        menuId: 93,
        menuName: '规则设置-3',
        menuUrl: '/rule/ruleSetting/3',
        parentMenuId: 1,
        workGroupId: 2,
      },
    ],
  });
}
