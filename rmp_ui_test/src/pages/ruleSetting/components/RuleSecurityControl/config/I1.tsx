import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import React from 'react';
import SecuritySelect from '@/components/SecuritySelect';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecurityPoolSelect from '../component/SecurityPoolSelect';
import MarketSelect from '../component/MarketSelect';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';

interface Params {
  mode: keyof typeof FORM_MODES;
}

export const getSchemas = (param: Params): FormSchema[] => {
  return [
    {
      field: 'securityControlType',
      label: '证券控制方式',
      component: 'Select',
      required: true,
      defaultValue: 1,
      componentProps: ({ formAction }) => {
        return {
          options: transformDictToSelectOptionsNumber([
            SECURITY_CONTROL_TYPES__MAP.KEY_1,
            SECURITY_CONTROL_TYPES__MAP.KEY_2,
            SECURITY_CONTROL_TYPES__MAP.KEY_3,
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
            SECURITY_CONTROL_TYPES__MAP.KEY_9,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySetIdList: [],
              securityList: null,
              securityFilterClassList: null,
              excludeSecurityList: null,
            });
          },
          style: { width: '240px' },
        };
      },
    },
    {
      field: 'securitySummaryType',
      label: '证券汇总方式',
      component: 'Select',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.INDEPENDENTLY,
        ]),
        style: { width: '240px' },
      },
    },
    {
      field: 'securityList',
      label: '证券列表',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_3.code),
      render: () => <SecuritySelect style={{ width: '240px' }} />,
    },
    {
      field: 'securityFilterClassList',
      label: '证券类别列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code) ||
        values.securityControlType ===
          Number(SECURITY_CONTROL_TYPES__MAP.KEY_9.code),
      render: () => (
        <SecurityTypeSelect
          secuControl={['10', '11', '12', '13', '14', '15']}
          style={{ width: '360px' }}
        />
      ),
    },
    {
      field: 'securitySetIdList',
      label: '动态维度列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_4.code),
      render: () => (
        <DynamicDimensionSelect mode={param.mode} style={{ width: '240px' }} />
      ),
    },
    {
      field: 'securitySetIdList',
      label: '证券池列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_2.code),
      render: () => (
        <SecurityPoolSelect mode={param.mode} style={{ width: '240px' }} />
      ),
    },
    {
      field: 'securitySetIdList',
      label: '证券池类型列表',
      required: true,
      component: 'Select',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_9.code),
      componentProps: {
        mode: 'multiple',
        options: [{ label: '1-投资证券池', value: 1 }],
        style: { width: '240px' },
      },
    },
    {
      field: 'excludeSecurityList',
      label: '排除证券列表',
      required: false,
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      component: 'Input',
      render: ({ values }) => {
        return (
          <SecuritySelect
            securityType={values.securityFilterClassList}
            style={{ width: '240px' }}
          />
        );
      },
    },
    {
      field: 'marketId',
      label: '市场',
      required: false,
      component: 'Input',
      render: () => (
        <MarketSelect
          marketsCodeUseForControl={[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '9',
            '10',
            '34',
            '35',
            '36',
            '105',
            '107',
          ]}
          style={{ width: '240px' }}
        />
      ),
    },
  ];
};
