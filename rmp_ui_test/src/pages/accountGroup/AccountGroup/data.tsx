import { ResponseAccountGroupItem } from '@/services/accountGroup';
import { ReactNode } from 'react';

export interface TreeData {
  key: string;
  title: React.ReactNode;
  workGroupId: number;
  workGroupName: string;
  sobId: number;
  selectable: boolean;
  isLeaf: boolean;
  icon?: ReactNode;
  createUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
  dynamicFlag?: number;
  acctGroupId?: number;
  acctGroupName?: string;
  acctGroupRemark?: string;
  bookType?: number;
  bookLevel?: number;
  createRoleId?: number;
  children?: TreeData[];
}

export enum DynamicFlag {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
}

export enum Mode {
  ADD = 'add',
  EDIT = 'edit',
}

export type SelectedItem = ResponseAccountGroupItem & { sobId: number };
