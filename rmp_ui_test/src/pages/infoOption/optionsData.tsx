// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import {
  CURRENCY_TYPE,
  DELIVERY_METHOD,
  INFORMATION_SOURCE,
  OPTION_TYPE,
  TRADE_MARKET,
  TRADE_MARKET_OPTION,
} from '@/utils/dictInfo';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import {
  SECURITY_CATEGORY_LEVEL,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import dayjs from 'dayjs';

const SECURITY_CATEGORY_LEVEL_OPTION = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期权')!,
];

// 期权信息列定义
export const columnOptions: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_OPTION) || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'securityCode',
    render: (value) => value || '--',
  },
  {
    title: '证券名称',
    dataIndex: 'securityName',
    ellipsis: true,
    render: (value) => value || '--',
  },
  {
    title: '证券类别',
    dataIndex: 'securityType',
    render: (value) =>
      transformDictTreeCodeToNameHelper(
        value,
        SECURITY_CATEGORY_LEVEL_OPTION
      ) || '--',
  },
  {
    title: '期权类型',
    dataIndex: 'optionType',
    render: (value) =>
      transformDictCodeToNameHelper(value, OPTION_TYPE) || '--',
  },
  {
    title: '期权品种',
    dataIndex: 'optionKindCode',
    render: (value) => value || '--',
  },
  {
    title: '币种类型',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  {
    title: '行权价格',
    dataIndex: 'exercisePrice',
    render: (value) => {
      if (value === null || value === undefined || value === '') {
        return '--';
      }
      return value;
    },
  },
  {
    title: '行权日期',
    dataIndex: 'exerciseDate',
    width: 240,
    render: (_, record) => {
      const startDate = record.exerciseBeginDate || '--';
      const endDate = record.exerciseEndDate || '--';

      if (startDate && endDate) {
        return `${startDate} 至 ${endDate}`;
      } else if (startDate) {
        return startDate;
      } else if (endDate) {
        return endDate;
      }
      return '--';
    },
  },
  {
    title: '标的证券代码',
    dataIndex: 'underlyingSecurityCode',
    render: (value) => value || '--',
  },
  {
    title: '标的券市场',
    dataIndex: 'underlyingMarketId',
    render: (value) =>
      transformDictCodeToNameHelper(value, TRADE_MARKET_OPTION) || '--',
  },
  {
    title: '合约乘数',
    dataIndex: 'contractMultiplier',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '限价单最小下单量',
    dataIndex: 'limitOrderAmountMin',
    ellipsis: true,
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '限价单最大下单量',
    dataIndex: 'limitOrderAmountMax',
    ellipsis: true,
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '市价单最小下单量',
    dataIndex: 'marketOrderAmountMin',
    ellipsis: true,
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '市价单最大下单量',
    dataIndex: 'marketOrderAmountMax',
    ellipsis: true,
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '上市日期',
    dataIndex: 'listDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '最后交易日',
    dataIndex: 'lastTradeDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
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
// 期权基础表单schema
export const basicSchemasOpt: FormSchema[] = [
  {
    field: 'informationSystemId',
    label: '资讯来源',
    component: 'Select',
    rules: [{ required: true, message: '请选择资讯来源' }],
    componentProps: {
      placeholder: '请选择资讯来源',
      style: { width: '240px' },
      options: INFORMATION_SOURCE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'securityCode',
    label: '证券代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入证券代码' }],
    componentProps: {
      placeholder: '请输入证券代码',
      style: { width: '240px' },
    },
  },
  {
    field: 'securityName',
    label: '证券名称',
    component: 'Input',
    rules: [
      { required: true, message: '请输入证券名称' },
      {
        pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/, // 只允许字母、数字、中文和空格
        message: '证券名称不能包含特殊字符',
      },
    ],
    componentProps: {
      placeholder: '请输入证券名称',
      style: { width: '240px' },
    },
  },
  {
    field: 'marketId',
    label: '交易市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择交易市场' }],
    required: true,
    componentProps: {
      placeholder: '请选择交易市场',
      style: { width: '240px' },
      options: TRADE_MARKET_OPTION.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'optionType',
    label: '期权类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择期权类型',
      style: { width: '240px' },
      options: OPTION_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'optionKindCode',
    label: '期权品种',
    component: 'Select',
    componentProps: {
      placeholder: '请选择期权品种',
      style: { width: '240px' },
    },
  },
  {
    field: 'tradeCurrencyCode',
    label: '币种',
    component: 'Select',
    componentProps: {
      placeholder: '请选择币种类别',
      style: { width: '240px' },
      options: CURRENCY_TYPE.map((i) => ({
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
      style: { width: '240px' },
      treeData: processData(
        SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期权')
          ? [SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期权')!]
          : []
      ),
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      treeDefaultExpandAll: true,
    },
  },
  {
    field: 'exercisePrice',
    label: '行权价格',
    component: 'InputNumber',
    componentProps: {
      // step: 0.0001,
      min: 0,
      max: 9999999999999999.999999999999, // Decimal(20,12) 最大值
      precision: 12, // 保留12位小数
      placeholder: '请输入行权价格',
      style: { width: '240px' },
      suffix: '元',
    },
  },
  {
    field: 'exerciseDate',
    label: '行权日期',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      style: { width: '240px' },
    },
  },
  {
    field: 'underlyingSecurityCode',
    label: '标的证券代码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入标的证券代码',
      style: { width: '240px' },
    },
  },
  {
    field: 'underlyingMarketId',
    label: '标的券市场',
    component: 'Select',
    componentProps: {
      placeholder: '请选择标的券市场',
      style: { width: '240px' },
      options: TRADE_MARKET.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'listDate',
    label: '上市日期',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择上市日期',
      style: { width: '240px' },
    },
  },
  {
    field: 'lastTradeDate',
    label: '最后交易日',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择最后交易日',
      style: { width: '240px' },
    },
  },
];

// 期权交易表单schema
export const tradeSchemasOpt: FormSchema[] = [
  {
    field: 'contractMultiplier',
    label: '合约乘数',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      placeholder: '请输入合约乘数',
      style: { width: '240px' },
    },
  },
  {
    field: 'limitOrderAmountMin',
    label: '限价单最小下单量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      placeholder: '请输入限价单最小下单量',
      style: { width: '240px' },
    },
  },
  {
    field: 'limitOrderAmountMax',
    label: '限价单最大下单量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      placeholder: '请输入限价单最大下单量',
      style: { width: '240px' },
    },
  },
  {
    field: 'marketOrderAmountMin',
    label: '市价单最小下单量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      placeholder: '请输入市价单最小下单量',
      style: { width: '240px' },
    },
  },
  {
    field: 'marketOrderAmountMax',
    label: '市价单最大下单量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      placeholder: '请输入市价单最大下单量',
      style: { width: '240px' },
    },
  },
];

// ====================================期权品种===========================================
export const columnOptionsKind: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_OPTION) || '--',
  },
  {
    title: '期权品种代码',
    dataIndex: 'optionKindCode',
    render: (value) => value || '--',
  },
  {
    title: '期权品种名称',
    dataIndex: 'optionKindName',
    render: (value) => value || '--',
  },
  {
    title: '交割方式',
    dataIndex: 'deliveryMethod',
    render: (value) =>
      transformDictCodeToNameHelper(value, DELIVERY_METHOD) || '--',
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

export const basicSchemasOptionKind: FormSchema[] = [
  {
    field: 'informationSystemId',
    label: '资讯来源',
    component: 'Select',
    rules: [{ required: true, message: '请选择资讯来源' }],
    componentProps: {
      placeholder: '请选择资讯来源',
      style: { width: '240px' },
      options: INFORMATION_SOURCE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'marketId',
    label: '交易市场',
    component: 'Select',
    rules: [{ required: true, message: '请选择交易市场' }],
    componentProps: {
      placeholder: '请选择交易市场',
      style: { width: '240px' },
      options: TRADE_MARKET_OPTION.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'optionKindCode',
    label: '期权品种代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入期权品种代码' }],
    required: true,
    componentProps: {
      placeholder: '请输入期权品种代码',
      style: { width: '240px' },
    },
  },
  {
    field: 'optionKindName',
    label: '期权品种名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入期权品种名称' }],
    componentProps: {
      placeholder: '请输入期权品种名称',
      style: { width: '240px' },
    },
  },
  {
    field: 'deliveryMethod',
    label: '交割方式',
    component: 'Select',
    componentProps: {
      placeholder: '请选择交割方式',
      style: { width: '240px' },
      options: DELIVERY_METHOD.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
];
