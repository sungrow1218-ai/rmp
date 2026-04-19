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
  CURRENCY_TYPE,
  DELIVERY_METHOD,
  INFORMATION_SOURCE,
  SETTLE_METHOD,
  TRADE_MARKET_PRECIOUS_METALS,
  TRADE_STATUS,
  TRADE_UNIT_TYPE,
} from '@/utils/dictInfo';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import PreciousMetalKindSelect from '../components/PreciousMetalKindSelect';
import React from 'react';
import dayjs from 'dayjs';
import { FORM_MODE } from '../data';
import { isFinite } from 'lodash';

const SECURITY_CATEGORY_LEVEL_PRECIOUS_METALS = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '贵金属')!,
];

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
      transformDictTreeCodeToNameHelper(
        value,
        SECURITY_CATEGORY_LEVEL_PRECIOUS_METALS
      ),
  },
  {
    title: '币种类别',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  {
    title: '贵金属品种代码',
    dataIndex: 'prcsMetalKindCode',
    render: (value) => value || '--',
  },
  {
    title: '交易单位数量',
    dataIndex: 'tradeUnitAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '交易单位类型',
    dataIndex: 'tradeUnitType',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_UNIT_TYPE) || '--',
  },
  {
    title: '最小申报数量',
    dataIndex: 'minimumReportAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '最大申报数量',
    dataIndex: 'maximumReportAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '交割方式',
    dataIndex: 'deliveryMethod',
    render: (value) =>
      transformDictCodeToNameHelper(value, DELIVERY_METHOD) || '--',
  },
  {
    title: '结算方式',
    dataIndex: 'settleMethod',
    render: (value) =>
      transformDictCodeToNameHelper(value, SETTLE_METHOD) || '--',
  },
  {
    title: '上市时间',
    dataIndex: 'listDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '退市日期',
    dataIndex: 'delistDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '交易状态',
    dataIndex: 'tradeStatus',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_STATUS) || '--',
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
      options: TRADE_MARKET_PRECIOUS_METALS.map((i) => ({
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
      treeData: processData(SECURITY_CATEGORY_LEVEL_PRECIOUS_METALS),
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
    field: 'preciousMetalKind',
    label: '贵金属品种代码',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.preciousMetalKind &&
            !value
          ) {
            return Promise.reject(new Error('请选择贵金属品种代码'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'Input',
    render: ({ values }, opts) => (
      <PreciousMetalKindSelect
        marketId={values.marketId}
        style={{ width: '300px' }}
      />
    ),
  },
  {
    field: 'minimumReportAmount',
    label: '最小申报数量',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.minimumReportAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入最小申报数量'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入最小申报数量',
      style: { width: '300px' },
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'maximumReportAmount',
    label: '最大申报数量',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.maximumReportAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入最大申报数量'));
          }
          return Promise.resolve();
        },
      },
    ],
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入最大申报数量',
      style: { width: '300px' },
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'deliveryMethod',
    label: '交割方式',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.deliveryMethod && !value) {
            return Promise.reject(new Error('请选择交割方式'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择交割方式',
      style: { width: '300px' },
      options: DELIVERY_METHOD.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'settleMethod',
    label: '结算方式',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.settleMethod && !value) {
            return Promise.reject(new Error('请选择结算方式'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择结算方式',
      style: { width: '300px' },
      options: SETTLE_METHOD.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
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

export const getTradeSchemas = (
  mode: FORM_MODE,
  originValue: Recordable
): FormSchema[] => [
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
      placeholder: '请输入交易单位数量',
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
