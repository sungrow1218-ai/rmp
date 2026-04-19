// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { ColumnItem } from '@/components/ColManage/ColManage';
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import {
  SECURITY_CATEGORY_LEVEL,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import {
  BOARD_TYPE,
  CURRENCY_TYPE,
  INFORMATION_SOURCE,
  TRADE_MARKET,
  TRADE_MARKET_STOCK,
  TRADE_STATUS,
  TRADE_UNIT_TYPE,
} from '@/utils/dictInfo';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import dayjs from 'dayjs';
import React from 'react';
import { StockItem } from '@/services/securityInfo';
import { isFinite } from 'lodash';

export enum FORM_MODE {
  ADD = 1,
  EDIT = 2,
}

export enum SecurityRelation {
  LSDAHZQDMGX = 1,
  KZZDMHZQDMGX = 2,
  BTSCTYZQDMGZ = 3,
}

export const SecurityRelationMap: Recordable = {
  [SecurityRelation.LSDAHZQDMGX]: '临时代码和证券代码关系',
  [SecurityRelation.KZZDMHZQDMGX]: '可转债代码和证券代码关系',
  [SecurityRelation.BTSCTYZQDMGZ]: '不同市场同一证券代码关系',
};

const SECURITY_CATEGORY_LEVEL_STOCK = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '股票')!,
];

export const getColumns = (
  relativeClick: (stock: StockItem) => void
): BasicColumn[] => [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_STOCK) || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'securityCode',
    render: (value) => value || '--',
  },
  {
    title: '证券名称',
    dataIndex: 'securityName',
    render: (value) => value || '--',
  },
  {
    title: '证券类别',
    dataIndex: 'securityType',
    render: (value) =>
      transformDictTreeCodeToNameHelper(value, SECURITY_CATEGORY_LEVEL_STOCK),
  },
  {
    title: '币种类别',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  {
    title: '板块类型',
    dataIndex: 'boardType',
    render: (value) => transformDictCodeToNameHelper(value, BOARD_TYPE) || '--',
  },
  {
    title: '总股本',
    dataIndex: 'totalShare',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '流通股本',
    dataIndex: 'outstandingShare',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '证券关联代码',
    dataIndex: '24',
    render: (value, record) => (
      <div
        style={{ color: '#bb744a', cursor: 'pointer' }}
        onClick={() => relativeClick(record as StockItem)}
      >
        查看详情
      </div>
    ),
  },
  {
    title: '交易单位类型',
    dataIndex: 'tradeUnitType',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_UNIT_TYPE) || '--',
  },
  {
    title: '交易单位数量',
    dataIndex: 'tradeUnitAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '交易状态',
    dataIndex: 'tradeStatus',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_STATUS) || '--',
  },
  {
    title: '上市时间',
    dataIndex: 'listDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '退市时间',
    dataIndex: 'delistDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '发行人编号',
    dataIndex: 'issuerOrganizationCode',
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

export const columnOptions: ColumnItem[] = getColumns(() => {}).map((i) => ({
  label: i.title as string,
  value: i.dataIndex,
  disabled: i.dataIndex === 'securityCode',
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
      options: TRADE_MARKET_STOCK.map((i) => ({
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
      treeData: processData(SECURITY_CATEGORY_LEVEL_STOCK),
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      treeDefaultExpandAll: true,
    },
  },
  {
    field: 'tradeCurrencyCode',
    label: '币种类别',
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
    component: 'Select',
    componentProps: {
      placeholder: '请选择币种类别',
      style: { width: '300px' },
      options: CURRENCY_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'boardType',
    label: '板块类型',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.boardType && !value) {
            return Promise.reject(new Error('请选择板块类型'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'Select',
    componentProps: {
      placeholder: '请选择板块类型',
      style: { width: '300px' },
      options: BOARD_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'issuerOrganizationCode',
    label: '发行人编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入发行人编号',
      style: { width: '300px' },
    },
  },
  {
    field: 'listDate',
    label: '上市日期',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.listDate && !value) {
            return Promise.reject(new Error('请选择上市日期'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择上市日期',
      style: { width: '300px' },
    },
  },
  {
    field: 'delistDate',
    label: '退市日期',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.delistDate && !value) {
            return Promise.reject(new Error('请选择退市日期'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择退市日期',
      style: { width: '300px' },
    },
  },
];

export const relaSchemas: FormSchema[] = [
  {
    field: 'secuCodeRelaType',
    label: '关联类型',
    component: 'Select',
    rules: [{ required: true, message: '请选择关联类型' }],
    componentProps: {
      placeholder: '请选择关联类型',
      style: { width: '300px' },
      options: [
        {
          label: SecurityRelationMap[SecurityRelation.LSDAHZQDMGX],
          value: SecurityRelation.LSDAHZQDMGX,
        },
        {
          label: SecurityRelationMap[SecurityRelation.KZZDMHZQDMGX],
          value: SecurityRelation.KZZDMHZQDMGX,
        },
        {
          label: SecurityRelationMap[SecurityRelation.BTSCTYZQDMGZ],
          value: SecurityRelation.BTSCTYZQDMGZ,
        },
      ],
    },
  },
  {
    field: 'relatedSecurityCode',
    label: '关联证券代码',
    component: 'Input',
    rules: [{ required: true, message: '请填写关联证券代码' }],
    componentProps: {
      placeholder: '请填写关联证券代码',
      style: { width: '300px' },
    },
  },
  {
    field: 'relatedMarketId',
    label: '关联交易市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择关联交易市场' }],
    componentProps: {
      placeholder: '请选择关联交易市场',
      style: { width: '300px' },
      options: TRADE_MARKET.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'effectiveDate',
    label: '生效日期',
    component: 'DatePicker',
    componentProps: {
      style: { width: '300px' },
    },
  },
  {
    field: 'expireDate',
    label: '失效日期',
    component: 'DatePicker',
    componentProps: {
      style: { width: '300px' },
    },
  },
];

export const getTradeSchemas = (
  mode: FORM_MODE,
  originValue: Recordable
): FormSchema[] => [
  {
    field: 'totalShare',
    label: '总股本',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.totalShare) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入总股本'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入总股本',
      style: { width: '300px' },
      suffix: '股',
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'outstandingShare',
    label: '流通股本',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.outstandingShare) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入流通股本'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入流通股本',
      style: { width: '300px' },
      suffix: '股',
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'tradeUnitType',
    label: '交易单位类型',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.tradeUnitType && !value) {
            return Promise.reject(new Error('请选择交易单位类型'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择交易单位类型',
      style: { width: '300px' },
      options: TRADE_UNIT_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'tradeUnitAmount',
    label: '交易单位数量',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.tradeUnitAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入交易单位数量'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '交易单位数量',
      style: { width: '300px' },
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'tradeStatus',
    label: '交易状态',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.tradeStatus) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请选择交易状态'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择交易状态',
      style: { width: '300px' },
      options: TRADE_STATUS.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
];
