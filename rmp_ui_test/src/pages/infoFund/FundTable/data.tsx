// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React from 'react';
import { FormSchema } from '@/components/Form';
import { BasicColumn } from '@/components/Table';
import {
  CURRENCY_TYPE,
  FUND_INVEST_CLASS,
  FUND_INVEST_NATURE,
  FUND_ISSUE_TYPE,
  FUND_RISK_PROFIT_TYPE,
  INFORMATION_SOURCE,
  TRADE_MARKET,
  TRADE_MARKET_FUND,
  TRADE_UNIT_TYPE,
} from '@/utils/dictInfo';
import {
  SECURITY_CATEGORY_LEVEL,
  transformDictCodeToNameHelper,
} from '@/utils/dict';
import { processData, transformDictTreeCodeToNameHelper } from '@/utils/utils';
import { ColumnItem } from '@/components/ColManage/ColManage';
import dayjs from 'dayjs';
import {
  FundItem,
  OrganInfoItem,
  queryIssuerRating,
  queryOrganInfo,
  RatingItem,
} from '@/services/securityInfo';
import { SecurityRelation, SecurityRelationMap } from '@/pages/infoStocks/data';
import { LinkOutlined } from '@ant-design/icons';
import { isFinite } from 'lodash';

export enum FORM_MODE {
  ADD = 1,
  EDIT = 2,
}

const SECURITY_CATEGORY_LEVEL_FUND = [
  SECURITY_CATEGORY_LEVEL.find((i) => i.name === '基金')!,
];

export const getColumns = (
  ratingClick: (value: any) => void,
  linkClick: (value: any) => void,
  relativeClick: (value: any) => void
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
      transformDictCodeToNameHelper(value, TRADE_MARKET_FUND) || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'securityCode',
    render: (value) => value || '--',
  },
  {
    title: '证券名称',
    dataIndex: 'securityName',
    width: 250,
    render: (value, record, index) => {
      if (String(record.securityType).startsWith('120202')) {
        return (
          <div>
            {value}
            <LinkOutlined
              onClick={() => linkClick(record)}
              style={{ color: '#bb744a', marginLeft: '8px', cursor: 'pointer' }}
            />
          </div>
        );
      } else {
        return value;
      }
    },
  },
  {
    title: '证券类别',
    dataIndex: 'securityType',
    render: (value) =>
      transformDictTreeCodeToNameHelper(value, SECURITY_CATEGORY_LEVEL_FUND),
  },
  {
    title: '币种类别',
    dataIndex: 'tradeCurrencyCode',
    render: (value) => value || '--',
  },
  {
    title: '基金发行总份额',
    dataIndex: 'issueTotalAmount',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: '基金投资分类',
    dataIndex: 'fundInvestClass',
    render: (value) =>
      transformDictCodeToNameHelper(value, FUND_INVEST_CLASS) || '--',
  },
  {
    title: '基金风险收益类型',
    dataIndex: 'fundRiskProfitType',
    render: (value) =>
      transformDictCodeToNameHelper(value, FUND_RISK_PROFIT_TYPE) || '--',
  },
  {
    title: '基金投资性质',
    dataIndex: 'fundInvestNature',
    render: (value) =>
      transformDictCodeToNameHelper(value, FUND_INVEST_NATURE) || '--',
  },
  {
    title: '昨日单位净值',
    dataIndex: 'previousNav',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: 'ETF申报单位',
    dataIndex: 'etfReportUnit',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: 'T日预估现金余额',
    dataIndex: 'estimateCashBalance',
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
  },
  {
    title: 'T-1日基准单位净值',
    dataIndex: 'etfPreBasisNav',
    width: 180,
    render: (value) => (isFinite(value) ? value.toLocaleString('en-US') : '--'),
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
    title: '证券关联代码',
    dataIndex: 'relativeCode',
    render: (value, record) => (
      <div
        style={{ color: '#bb744a', cursor: 'pointer' }}
        onClick={() => relativeClick(record as FundItem)}
      >
        查看详情
      </div>
    ),
  },
  {
    title: '外部评级',
    dataIndex: 'ratingCol',
    render: (value, record) => (
      <div
        style={{ color: '#bb744a', cursor: 'pointer' }}
        onClick={() => ratingClick(record)}
      >
        查看详情
      </div>
    ),
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

export const columnOptions: ColumnItem[] = getColumns(
  () => {},
  () => {},
  () => {}
).map((i) => ({
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
      options: TRADE_MARKET_FUND.map((i) => ({
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
      treeData: processData(SECURITY_CATEGORY_LEVEL_FUND),
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
  {
    field: 'fundInvestClass',
    label: '基金投资分类',
    component: 'Select',
    rules: [{ required: true, message: '请选择基金投资分类' }],
    componentProps: {
      placeholder: '请选择基金投资分类',
      style: { width: '300px' },
      options: FUND_INVEST_CLASS.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'fundIssueType',
    label: '基金发行分类',
    component: 'Select',
    rules: [{ required: true, message: '请选择基金发行分类' }],
    componentProps: {
      placeholder: '请选择基金发行分类',
      style: { width: '300px' },
      options: FUND_ISSUE_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'fundRiskProfitType',
    label: '基金风险收益类型',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.fundRiskProfitType &&
            !value
          ) {
            return Promise.reject(new Error('请选择基金风险收益类型'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择基金风险收益类型',
      style: { width: '300px' },
      options: FUND_RISK_PROFIT_TYPE.map((i) => ({
        label: `${i.code}-${i.name}`,
        value: i.code,
      })),
    },
  },
  {
    field: 'fundInvestNature',
    label: '基金投资性质',
    component: 'Select',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.fundInvestNature &&
            !value
          ) {
            return Promise.reject(new Error('请选择基金投资性质'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择基金投资性质',
      style: { width: '300px' },
      options: FUND_INVEST_NATURE.map((i) => ({
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
    component: 'DatePicker',
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
    componentProps: {
      placeholder: '请选择上市日期',
      style: { width: '300px' },
    },
  },
  {
    field: 'delistDate',
    label: '退市日期',
    component: 'DatePicker',
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
    componentProps: {
      placeholder: '请选择退市日期',
      style: { width: '300px' },
    },
  },
];

export const getRatingSchemas = (
  mode: FORM_MODE,
  originValue: Recordable
): FormSchema[] => [
  {
    field: 'ratingOrganizationCode',
    label: '外部评级机构',
    component: 'ApiSelect',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            originValue.ratingOrganizationCode &&
            !value
          ) {
            return Promise.reject(new Error('请选择外部评级机构'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择外部评级机构',
      style: { width: '300px' },
      api: async (params: any) => {
        const {
          data: { resultList },
        } = await queryOrganInfo(params);
        return resultList.map((i: OrganInfoItem) => ({
          label: `${i.organizationCode}-${i.organizationName}`,
          value: `${i.organizationCode}`,
          ...i,
        }));
      },
      params: {
        pageId: 1,
        pageSize: 5000,
      },
    },
  },
  {
    field: 'externalRating',
    label: '外部评级',
    component: 'ApiSelect',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.externalRating && !value) {
            return Promise.reject(new Error('请选择外部评级'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择外部评级',
      style: { width: '300px' },
      api: async () => {
        const {
          data: { resultList },
        } = await queryIssuerRating();
        return resultList.map((i: RatingItem) => ({
          label: `${i.ratingCode}-${i.ratingName}`,
          value: `${i.ratingCode}`,
          ...i,
        }));
      },
    },
  },
  {
    field: 'ratingDate',
    label: '外部评级日期',
    component: 'DatePicker',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (mode === FORM_MODE.EDIT && originValue.ratingDate && !value) {
            return Promise.reject(new Error('请选择外部评级日期'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请选择外部评级日期',
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
    field: 'issueTotalAmount',
    label: '发行总数量',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.issueTotalAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入发行总数量'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入发行总数量',
      style: { width: '300px' },
      suffix: '元',
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'totalAmount',
    label: '当前总份额',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.totalAmount) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入当前总份额'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入当前总份额',
      style: { width: '300px' },
      suffix: '元',
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
  {
    field: 'previousNav',
    label: '昨日单位净值',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.previousNav) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入昨日单位净值'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入昨日单位净值',
      style: { width: '300px' },
      suffix: '元',
      precision: 12,
      min: 0,
      max: 99999999.999999999999,
    },
  },
  {
    field: 'etfReportUnit',
    label: 'ETF申报单位',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.etfReportUnit) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入ETF申报单位'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入ETF申报单位',
      style: { width: '300px' },
      suffix: '手',
    },
  },
  {
    field: 'estimateCashBalance',
    label: 'T日预估现金余额',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.estimateCashBalance) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入T日预估现金余额'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入T日预估现金余额',
      style: { width: '300px' },
      suffix: '元',
      precision: 2,
      min: 0,
      max: 999999999999999999.99,
    },
  },
  {
    field: 'etfPreBasisNav',
    label: 'T-1日基准单位净值',
    component: 'InputNumber',
    rules: [
      {
        validator: (_, value) => {
          if (mode === FORM_MODE.ADD) {
            return Promise.resolve();
          }
          if (
            mode === FORM_MODE.EDIT &&
            isFinite(originValue.etfPreBasisNav) &&
            !isFinite(value)
          ) {
            return Promise.reject(new Error('请输入T-1日基准单位净值'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: '请输入T-1日基准单位净值',
      style: { width: '300px' },
      suffix: '元',
      precision: 12,
      min: 0,
      max: 99999999.999999999999,
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
      placeholder: '请输入交易单位数量',
      style: { width: '300px' },
      precision: 4,
      min: 0,
      max: 9999999999999999.9999,
    },
  },
];
