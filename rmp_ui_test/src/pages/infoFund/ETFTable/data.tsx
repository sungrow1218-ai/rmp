// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { ColumnItem } from '@/components/ColManage/ColManage';
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import { transformDictCodeToNameHelper } from '@/utils/dict';
import {
  CASH_REPLACE_FLAG,
  INFORMATION_SOURCE,
  TRADE_MARKET,
  TRADE_MARKET_FUND,
  TRADE_MARKET_STOCK,
} from '@/utils/dictInfo';
import dayjs from 'dayjs';
import React from 'react';
import FundSelectSimple from '../components/FundSelectSimple';
import { isFinite } from 'lodash';

export enum FORM_MODE {
  ADD = 1,
  EDIT = 2,
}

export const columns: BasicColumn[] = [
  {
    title: '资讯来源',
    dataIndex: 'informationSystemId',
    render: (value) =>
      transformDictCodeToNameHelper(value, INFORMATION_SOURCE) || '--',
  },
  {
    title: '交易市场',
    dataIndex: 'componentMarketId',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_MARKET_STOCK) || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'componentSecurityCode',
    render: (value) => value || '--',
  },
  {
    title: '申购替代金额',
    dataIndex: 'purchaseReplaceBalance',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '赎回替代金额',
    dataIndex: 'redeemReplaceBalance',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '证券数量',
    dataIndex: 'securityAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '现金替代标志',
    dataIndex: 'cashReplaceFlag',
    render: (value) =>
      transformDictCodeToNameHelper(value, CASH_REPLACE_FLAG) || '--',
  },
  {
    title: 'ETF基金所属市场',
    dataIndex: 'etfMarketId',
    width: 160,
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_MARKET_FUND) || '--',
  },
  {
    title: 'ETF基金代码',
    dataIndex: 'etfSecurityCode',
    render: (value) => value || '--',
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
  disabled: ['componentSecurityCode', 'etfSecurityCode'].includes(
    i.dataIndex as string
  ),
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
    field: 'componentSecurityCode',
    label: '证券代码',
    component: 'Input',
    rules: [{ required: true, message: '请填写证券代码' }],
    componentProps: {
      placeholder: '请填写证券代码',
      style: { width: '300px' },
      disabled: mode === FORM_MODE.EDIT,
    },
  },
  {
    field: 'componentMarketId',
    label: '交易市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择交易市场' }],
    componentProps: {
      placeholder: '请选择交易市场',
      style: { width: '300px' },
      options: TRADE_MARKET.filter((i) => i.code !== -1).map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
      showSearch: true,
      optionFilterProp: 'label',
      disabled: mode === FORM_MODE.EDIT,
    },
  },
  {
    field: 'etfSecurity',
    label: 'ETF基金代码',
    component: 'Input',
    rules: [{ required: true, message: '请选择ETF基金代码', type: 'object' }],
    render: () => (
      <FundSelectSimple
        securityType={120202}
        style={{ width: '300px' }}
        disabled={mode === FORM_MODE.EDIT}
      />
    ),
  },
  {
    field: 'etfSecurityCode',
    component: 'Input',
    show: false,
  },
  {
    field: 'etfMarketId',
    label: 'ETF基金所属市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择ETF基金所属市场' }],
    componentProps: {
      placeholder: '请选择ETF基金所属市场',
      style: { width: '300px' },
      disabled: true,
      options: TRADE_MARKET_FUND.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'purchaseReplaceBalance',
    label: '申购替代金额',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.purchaseReplaceBalance) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入申购替代金额'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入申购替代金额',
      style: { width: '300px' },
      precision: 2,
      min: 0,
      max: 999999999999999999.99,
    },
  },
  {
    field: 'redeemReplaceBalance',
    label: '赎回替代金额',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.redeemReplaceBalance) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入赎回替代金额'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入赎回替代金额',
      style: { width: '300px' },
      precision: 2,
      min: 0,
      max: 999999999999999999.99,
    },
  },
  {
    field: 'securityAmount',
    label: '证券数量',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.securityAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入证券数量'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入证券数量',
      style: { width: '300px' },
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'cashReplaceFlag',
    label: '现金替代标志',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.cashReplaceFlag &&
            !value
          ) {
            return Promise.reject(new Error('请选择现金替代标志'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择现金替代标志',
      style: { width: '300px' },
      options: CASH_REPLACE_FLAG.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
];
