import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';
import React from 'react';
import MarketSelect from '../component/MarketSelect';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
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
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySetIdList: null,
              securityFilterClassList: null,
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
      defaultValue: 1,
      componentProps: {
        options: transformDictToSelectOptionsNumber([
          SECURITY_AGGREGATION__MAP.TOGETHER,
        ]),
        style: { width: '240px' },
      },
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
      field: 'securityFilterClassList',
      label: '证券范围列表',
      required: true,
      component: 'Select',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      render: () => (
        <SecurityTypeSelect
          secuControl={['1301', '1302', '1303', '1304', '1401', '1402']}
          style={{ width: '360px' }}
        />
      ),
    },
    {
      field: 'marketId',
      label: '交易市场',
      component: 'Input',
      render: () => (
        <MarketSelect
          style={{ width: '240px' }}
          marketsCodeUseForControl={['3', '4', '7', '9', '107']}
        />
      ),
    },
  ];
};
