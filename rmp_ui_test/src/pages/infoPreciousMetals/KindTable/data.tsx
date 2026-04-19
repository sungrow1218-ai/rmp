import { ColumnItem } from '@/components/ColManage/ColManage';
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import {
  INFORMATION_SOURCE,
  QUOTE_UNIT,
  TRADE_MARKET_PRECIOUS_METALS,
} from '@/utils/dictInfo';
import dayjs from 'dayjs';
import { FORM_MODE } from '../data';

export const columns: BasicColumn[] = [
  {
    title: '资讯来源',
    dataIndex: 'informationSystemId',
    render: (value) =>
      transformDictCodeToNameHelper(value, INFORMATION_SOURCE) || '--',
  },
  {
    title: '交易市场',
    dataIndex: 'marketId',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_MARKET_PRECIOUS_METALS) ||
      '--',
  },
  {
    title: '贵金属品种代码',
    dataIndex: 'prcsMetalKindCode',
    render: (value) => value || '--',
  },
  {
    title: '贵金属品种名称',
    dataIndex: 'prcsMetalKindName',
    render: (value) => value || '--',
  },
  {
    title: '报价单位',
    dataIndex: 'quoteUnit',
    render: (value) => transformDictCodeToNameHelper(value, QUOTE_UNIT) || '--',
  },
  {
    title: '创建用户',
    dataIndex: 'createUserCode',
    render: (value) => value || '--',
  },
  {
    title: '更新用户',
    dataIndex: 'updateUserCode',
    render: (value) => value || '--',
  },
  {
    title: '创建时间',
    dataIndex: 'createDateTime',
    width: 180,
    render: (value) =>
      value
        ? dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
        : '--',
  },
  {
    title: '更新时间',
    dataIndex: 'lastUpdateTime',
    width: 180,
    render: (value) =>
      value
        ? dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
        : '--',
  },
];

export const columnOptions: ColumnItem[] = columns.map((i) => ({
  label: i.title as string,
  value: i.dataIndex,
  disabled: i.dataIndex === 'prcsMetalKindCode',
}));

export const getBasicSchemas = (
  mode: FORM_MODE,
  originValue: Recordable
): FormSchema[] => [
  {
    field: 'informationSystemId',
    label: '资讯来源',
    component: 'Select',
    rules: [{ required: true, message: '请选择资讯来源' }],
    componentProps: {
      placeholder: '请选择资讯来源',
      options: INFORMATION_SOURCE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
      style: { width: '300px' },
    },
  },
  {
    field: 'marketId',
    label: '交易市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择交易市场' }],
    componentProps: {
      placeholder: '请选择交易市场',
      style: { width: '300px' },
      options: TRADE_MARKET_PRECIOUS_METALS.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'prcsMetalKindCode',
    label: '贵金属品种代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入贵金属品种代码' }],
    componentProps: {
      placeholder: '请输入贵金属品种代码',
      style: { width: '300px' },
    },
  },
  {
    field: 'prcsMetalKindName',
    label: '贵金属品种名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入贵金属品种名称' }],
    componentProps: {
      placeholder: '请输入贵金属品种名称',
      style: { width: '300px' },
    },
  },
  {
    field: 'quoteUnit',
    label: '报价单位',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.quoteUnit && !value) {
            return Promise.reject(new Error('请选择报价单位'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择报价单位',
      style: { width: '300px' },
      options: QUOTE_UNIT.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
];
