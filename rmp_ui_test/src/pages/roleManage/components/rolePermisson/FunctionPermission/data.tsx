import { MenuAuthListParamType } from '@/pages/roleManage/contant/typing';
import { Checkbox } from '@ht/sprite-ui';
import type { ColumnsType } from '@ht/sprite-ui/es/table';
import React from 'react';
import { getAllChildrenNodes } from './util';

export enum AuthType {
  NONE = 0,
  CHECKED = 1,
}

export interface DataType {
  key: React.ReactNode;
  menuName?: string;
  menuId: number;
  parentMenuId: number;
  functionName?: string;
  functionId?: number;
  empowerAuth?: AuthType;
  useAuth?: AuthType;
  children?: DataType[];
}

export interface MenuAuth {
  menuId: number;
  menuName: string;
  parentMenuId: number;
  empowerAuth?: AuthType;
  useAuth?: AuthType;
  functionAuthList: MenuFuncAuth[];
}

export interface MenuFuncAuth {
  functionId: number;
  functionName: string;
  useAuth: AuthType;
}

export type CheckEventFunction = (
  node: DataType,
  key: 'empowerAuth' | 'useAuth',
  checked: boolean
) => void;

export const getColumns = (
  handleCheck: CheckEventFunction,
  menusAuth: MenuAuthListParamType[],
  isEIP: boolean
): ColumnsType<DataType> => [
  {
    dataIndex: 'menuName',
    key: 'menu',
    title: '菜单',
  },
  {
    dataIndex: 'functionName',
    key: 'functionName',
    align: 'center',
    title: '功能',
  },
  {
    dataIndex: 'useAuth',
    key: 'useAuth',
    title: '使用权限',
    align: 'center',
    width: 200,
    render: (_, record) => {
      const menuAuth = menusAuth.find((i) => i.menuId === record.menuId);
      let disabled = false;
      // 没有权限
      if (isEIP || !menuAuth || menuAuth.empowerAuth === AuthType.NONE) {
        disabled = true;
      }
      // 有权限，但是子节点存在勾中但无修改权限的
      const childNodes = getAllChildrenNodes(record);
      for (const item of childNodes) {
        const childAuth = menusAuth.find((i) => i.menuId === item.menuId);
        if (
          childAuth &&
          childAuth.empowerAuth === AuthType.NONE &&
          item.useAuth === AuthType.CHECKED
        ) {
          disabled = true;
          break;
        }
      }
      if (record.useAuth === undefined) return null;
      return (
        <Checkbox
          checked={record.useAuth === AuthType.CHECKED}
          disabled={disabled}
          onChange={() =>
            handleCheck(record, 'useAuth', record.useAuth !== AuthType.CHECKED)
          }
        />
      );
    },
  },
  {
    dataIndex: 'empowerAuth',
    key: 'empowerAuth',
    title: '授权权限',
    align: 'center',
    width: 200,
    render: (_, record) => {
      const menuAuth = menusAuth.find((i) => i.menuId === record.menuId);
      let disabled = false;
      // 没有权限
      if (isEIP || !menuAuth || menuAuth.empowerAuth === AuthType.NONE) {
        disabled = true;
      }
      // 有权限，但是子节点存在勾中但无修改权限的
      const childNodes = getAllChildrenNodes(record);
      for (const item of childNodes) {
        const childAuth = menusAuth.find((i) => i.menuId === item.menuId);
        if (
          childAuth &&
          childAuth.empowerAuth === AuthType.NONE &&
          item.empowerAuth === AuthType.CHECKED
        ) {
          disabled = true;
          break;
        }
      }
      if (record.empowerAuth === undefined) return null;
      return (
        <Checkbox
          checked={record.empowerAuth === AuthType.CHECKED}
          disabled={disabled}
          onChange={() =>
            handleCheck(
              record,
              'empowerAuth',
              record.empowerAuth !== AuthType.CHECKED
            )
          }
        />
      );
    },
  },
];
