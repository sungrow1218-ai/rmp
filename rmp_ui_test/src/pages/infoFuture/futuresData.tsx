// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import {
  ARBITRAGE_TYPE,
  CURRENCY_TYPE,
  DELIVERY_METHOD,
  INFORMATION_SOURCE,
  TRADE_MARKET_FUTURE,
} from '@/utils/dictInfo';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import {
  SECURITY_CATEGORY_LEVEL,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import dayjs, { locale } from 'dayjs';

import 'dayjs/locale/zh-cn';

const SECURITY_CATEGORY_LEVEL_FUTURE = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期货')!,
];

// 期货信息列定义
export const columnFutures: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_FUTURE) || '--',
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
        SECURITY_CATEGORY_LEVEL_FUTURE
      ) || '--',
  },
  {
    title: '期货品种',
    dataIndex: 'futuresKindCode',
    render: (value) => value || '--',
  },
  {
    title: '币种类型',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  {
    title: '合约月份',
    dataIndex: 'contractMonth',
    render: (value) => value || '--',
  },
  {
    title: '交割日',
    dataIndex: 'lastDeliveryDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '合约乘数',
    dataIndex: 'contractMultiplier',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  // { title: '持仓量', dataIndex: 'marketPositionAmount' },
  {
    title: '前一日市场持仓总量',
    dataIndex: 'preMarketPosiAmount',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '限价单最小下单量',
    dataIndex: 'limitOrderAmountMin',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '限价单最大下单量',
    dataIndex: 'limitOrderAmountMax',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '市价单最小下单量',
    dataIndex: 'marketOrderAmountMin',
    render: (value) => (value === null || value === undefined ? '--' : value),
  },
  {
    title: '市价单最大下单量',
    dataIndex: 'marketOrderAmountMax',
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

// 期货基础表单schema
export const basicSchemasFut: FormSchema[] = [
  {
    field: 'informationSystemId',
    label: '资讯来源',
    component: 'Select',
    required: true,
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
    componentProps: {
      placeholder: '请选择交易市场',
      style: { width: '240px' },
      options: TRADE_MARKET_FUTURE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'futuresKindCode',
    label: '期货品种',
    component: 'Select',
    componentProps: {
      placeholder: '请选择期货品种',
      style: { width: '240px' },
    },
  },
  {
    field: 'tradeCurrencyCode',
    label: '币种类型',
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
        SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期货')
          ? [SECURITY_CATEGORY_LEVEL.find((i) => i.name === '期货')!]
          : []
      ),
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      treeDefaultExpandAll: true,
    },
  },
  {
    field: 'contractMonth',
    label: '合约月份',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请输入合约月份',
      style: { width: '240px' },
      picker: 'month',
      format: 'YYYYMM',

      // addonAfter: <UnitAddon unit="月" />,
    },
  },
  {
    field: 'lastDeliveryDate',
    label: '交割日',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择交割日',
      style: { width: '240px' },
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

// 期货交易表单schema
export const tradeSchemasFut: FormSchema[] = [
  {
    field: 'contractMultiplier',
    label: '合约乘数',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入合约乘数',
      min: 0,
      max: 9999999999, // 十位数的最大值
      precision: 0, // 整数精度
      formatter: (value) => {
        return value
          ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : '';
      },
      parser: (value) => {
        if (value == null) return '';
        return value.replace(/\$\s?|(,*)/g, '');
      },
      style: { width: '240px' },
    },
  },
  // {
  //   field: 'marketPositionAmount',
  //   label: '持仓量',
  //   component: 'InputNumber',
  //   required: true,
  //   componentProps: {
  //     placeholder: '请输入',
  //     style: { width: '240px' },
  //     addonAfter: <UnitAddon unit="手" />,
  //   },
  // },
  {
    field: 'preMarketPosiAmount',
    label: '前一日市场持仓量',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入前一日持仓量',
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      style: { width: '240px' },
      suffix: '手',
    },
  },
  {
    field: 'limitOrderAmountMin',
    label: '限价单最小下单量',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入限价单最小下单量',
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      style: { width: '240px' },
    },
  },
  {
    field: 'limitOrderAmountMax',
    label: '限价单最大下单量',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入限价单最大下单量',
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      style: { width: '240px' },
    },
  },
  {
    field: 'marketOrderAmountMin',
    label: '市价单最小下单量',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入市价单最小下单量',
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      style: { width: '240px' },
    },
  },
  {
    field: 'marketOrderAmountMax',
    label: '市价单最大下单量',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入市价单最大下单量',
      min: 0,
      max: 9999999999999999.9999,
      precision: 4, // 保留4位小数
      style: { width: '240px' },
    },
  },
];

// =================================期货品种=====================================
export const columnFuturesKind: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_FUTURE) || '--',
  },
  {
    title: '期货品种代码',
    dataIndex: 'futuresKindCode',
    render: (value) => value || '--',
  },
  {
    title: '期货品种名称',
    dataIndex: 'futuresKindName',
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

export const basicSchemasFuturesKind: FormSchema[] = [
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
      options: TRADE_MARKET_FUTURE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'futuresKindCode',
    label: '期货品种代码',
    component: 'Input',
    rules: [{ required: true, message: '请输入期货品种代码' }],
    componentProps: {
      placeholder: '请输入期货品种代码',
      style: { width: '240px' },
    },
  },
  {
    field: 'futuresKindName',
    label: '期货品种名称',
    component: 'Input',
    rules: [{ required: true, message: '请输入期货品种名称' }],
    componentProps: {
      placeholder: '请输入期货品种名称',
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

// =================================期货组合单=====================================
export const columnContract: BasicColumn[] = [
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_FUTURE) || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'securityCode',
    render: (value) => value || '--',
  },
  {
    title: '第一合约代码',
    dataIndex: 'firstSecurityCode',
    render: (value) => value || '--',
  },
  {
    title: '第二合约代码',
    dataIndex: 'secondSecurityCode',
    render: (value) => value || '--',
  },
  {
    title: '上市日期',
    dataIndex: 'listDate',
    render: (value) =>
      value ? dayjs(String(value), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
  },
  {
    title: '套利类型',
    dataIndex: 'arbitrageType',
    render: (value) =>
      transformDictCodeToNameHelper(value, ARBITRAGE_TYPE) || '--',
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

export const basicSchemasContract: FormSchema[] = [
  {
    field: 'informationSystemId',
    label: '资讯来源',
    component: 'Select',
    rules: [{ required: true, message: '请选择资讯来源' }],
    componentProps: {
      placeholder: '请选择',
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
      options: TRADE_MARKET_FUTURE.map((i) => ({
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
    field: 'firstSecurityCode',
    label: '第一合约代码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入第一合约代码',
      style: { width: '240px' },
    },
  },
  {
    field: 'secondSecurityCode',
    label: '第二合约代码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入第二合约代码',
      style: { width: '240px' },
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
    field: 'arbitrageType',
    label: '套利类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择套利类型',
      style: { width: '240px' },
      options: ARBITRAGE_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
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
