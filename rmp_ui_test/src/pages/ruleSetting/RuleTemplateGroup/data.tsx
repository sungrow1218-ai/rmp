import React from 'react';
import { ColumnItem } from '@/components/ColManage/ColManage';
import { FormSchema } from '@/components/Form';
import dayjs from 'dayjs';
import { Badge } from 'antd';
import { Status } from './type';
import { ColumnsType } from 'antd/es/table';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';

export const searchSchemas: FormSchema[] = [
  {
    field: 'ruleTmplGroupId',
    label: '指标组编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      allowClear: true,
      style: { width: '240px' },
    },
  },
  {
    field: 'ruleTmplGroupName',
    label: '指标组名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      allowClear: true,
      style: { width: '240px' },
    },
  },
  {
    field: 'status',
    label: '启用状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已启用', value: Status.ENABLE },
        { label: '已停用', value: Status.DISABLE },
      ],
      placeholder: '请输入',
      allowClear: true,
      style: { width: '240px' },
    },
  },
  {
    field: 'createUserCode',
    label: '创建人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      allowClear: true,
      style: { width: '240px' },
    },
  },
];

export const defaultColumns: ColumnsType<RuleTemplateGroupIDTO> = [
  {
    title: '指标组编号',
    width: 120,
    minWidth: 120,
    dataIndex: 'ruleTmplGroupId',
    align: 'center',
  },
  {
    title: '指标组名称',
    width: 250,
    minWidth: 250,
    dataIndex: 'ruleTmplGroupName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '启用状态',
    width: 120,
    minWidth: 120,
    dataIndex: 'status',
    align: 'left',
    render(value: number) {
      return (
        <div>
          <Badge
            color={value === Status.ENABLE ? '#3F88F1' : '#F94736'}
            size="small"
            style={{ marginRight: '8px' }}
          />
          {value === Status.ENABLE ? (
            <span style={{ color: '#3F88F1' }}>已启用</span>
          ) : (
            <span style={{ color: '#F94736' }}>已停用</span>
          )}
        </div>
      );
    },
  },
  {
    title: '包含规则类型数',
    dataIndex: 'ruleTypes',
    align: 'left',
    width: 140,
    minWidth: 140,
    render: (_: any, record: Recordable) => {
      return (
        <span
          style={{
            display: 'inline-block',
            width: '40px',
            height: '32px',
            background: 'rgba(16,179,234,0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(16,179,234,0.2)',
            textAlign: 'center',
            lineHeight: '32px',
            color: '#0FB3E9',
          }}
        >
          {record.ruleTemplateList.length ?? ''}
        </span>
      );
    },
  },
  {
    title: '创建用户',
    dataIndex: 'createUserCode',
    width: 140,
    minWidth: 140,
    align: 'left',
  },
  {
    title: '更新用户',
    dataIndex: 'updateUserCode',
    width: 140,
    minWidth: 140,
    align: 'left',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    minWidth: 180,
    align: 'left',
    render: (value) =>
      value
        ? dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
        : '--',
  },
  {
    title: '更新时间',
    dataIndex: 'lastUpdateTime',
    width: 180,
    minWidth: 180,
    align: 'left',
    render: (value) =>
      value
        ? dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
        : '--',
  },
];

export const columnOptions: ColumnItem[] = defaultColumns.map((i: any) => ({
  label: i.title,
  value: i.dataIndex,
}));
