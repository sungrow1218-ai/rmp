// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { ColumnItem } from '@/components/ColManage/ColManage';
import { FormSchema } from '@/components/Form';
import SecuritySelectSimple from '@/pages/infoStocks/components/SecuritySelectSimple';
import { BasicColumn } from '@/components/Table';
import {
  SECURITY_CATEGORY_LEVEL,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import {
  CURRENCY_TYPE,
  INFORMATION_SOURCE,
  TRADE_MARKET_INDEX,
  TRADE_MARKET_STOCK,
} from '@/utils/dictInfo';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import dayjs from 'dayjs';
import React from 'react';
import { isFinite } from 'lodash';

export enum FORM_MODE {
  ADD = 1,
  EDIT = 2,
}

const SECURITY_CATEGORY_LEVEL_INDEX = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '指数')!,
];

export const indexColumns: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_INDEX) || '--',
  },
  { title: '证券代码', dataIndex: 'securityCode' },
  { title: '证券名称', dataIndex: 'securityName' },
  {
    title: '证券类别',
    dataIndex: 'securityType',
    render: (value) =>
      transformDictTreeCodeToNameHelper(value, SECURITY_CATEGORY_LEVEL_INDEX),
  },
  {
    title: '币种类别',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  // { title: '交易币种', dataIndex: 'tradeCurrencyCode' },
  // { title: '昨收盘价', dataIndex: 'previousClosePrice' },
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

export const columnIndexOptions: ColumnItem[] = indexColumns.map((i) => ({
  label: i.title as string,
  value: i.dataIndex,
  disabled: i.dataIndex === 'securityCode',
}));

export const ingredientColumns: BasicColumn[] = [
  {
    title: '资讯来源',
    dataIndex: 'informationSystemId',
    render: (value) =>
      transformDictCodeToNameHelper(value, INFORMATION_SOURCE) || '--',
  },
  { title: '成分股代码', dataIndex: 'componentSecurityCode' },
  { title: '成分股名称', dataIndex: 'securityName' },
  {
    title: '成分股所属市场',
    dataIndex: 'componentMarketId',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_MARKET_STOCK) || '--',
  },
  { title: '指数代码', dataIndex: 'indexCode' },
  {
    title: '指数权重',
    dataIndex: 'indexWeight',
    render: (value) =>
      isFinite(value) ? `${value.toLocaleString('en-US')}%` : '--',
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

export const columnIngredientOptions: ColumnItem[] = ingredientColumns.map(
  (i) => ({
    label: i.title as string,
    value: i.dataIndex,
    disabled: ['componentSecurityCode', 'indexCode'].includes(
      i.dataIndex as string
    ),
  })
);

export const getBasicIndexSchemas = (
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
    field: 'securityCode',
    label: '证券代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入证券代码' }],
    componentProps: {
      placeholder: '请输入证券代码',
      style: { width: '300px' },
    },
  },
  {
    field: 'securityName',
    label: '证券名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入证券名称' }],
    componentProps: {
      placeholder: '请输入证券名称',
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
      options: TRADE_MARKET_INDEX.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'securityType',
    label: '证券类别',
    component: 'TreeSelect',
    rules: [{ required: true, message: '请选择证券类别' }],
    componentProps: {
      placeholder: '请选择证券类别',
      style: { width: '300px' },
      treeData: processData(SECURITY_CATEGORY_LEVEL_INDEX),
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      treeDefaultExpandAll: true,
    },
  },
  {
    field: 'tradeCurrencyCode',
    label: '币种类别',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.tradeCurrencyCode &&
            !value
          ) {
            return Promise.reject(new Error('请选择币种类别'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择币种类别',
      style: { width: '300px' },
      options: CURRENCY_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
];

export const getBasicIngredientSchemas = (
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
    field: 'indexCode',
    label: '指数代码',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true,
      style: { width: '300px' },
    },
  },
  {
    field: 'indexMarketId',
    component: 'InputNumber',
    show: false,
  },
  {
    field: 'componentSecurity',
    label: '成分股代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入成分股代码', type: 'object' }],
    render: ({ values }) => (
      <SecuritySelectSimple
        style={{ width: '300px' }}
        disabled={mode === FORM_MODE.EDIT}
        marketId={values.indexMarketId}
      />
    ),
  },
  {
    field: 'componentSecurityCode',
    component: 'Input',
    show: false,
  },
  {
    field: 'componentSecurityName',
    label: '成分股名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入成分股名称' }],
    componentProps: {
      style: { width: '300px' },
      disabled: true,
    },
  },
  {
    field: 'componentMarketId',
    label: '成分股所属市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择成分股所属市场' }],
    componentProps: {
      style: { width: '300px' },
      disabled: true,
      options: TRADE_MARKET_STOCK.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'indexWeight',
    label: '指数权重',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.indexWeight) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入指数权重'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入指数权重',
      style: { width: '300px' },
      suffix: '%',
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
];
