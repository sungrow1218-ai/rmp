import { FormSchema } from '@/components/Form';
import {
  SECURITY_AGGREGATION__MAP,
  SECURITY_CONTROL_TYPES__MAP,
} from '@/utils/dict';
import React from 'react';
import SecurityTypeSelect from '@/components/SecurityTypeSelectRebuild';
import SecuritySelect from '@/components/SecuritySelect';
import { FORM_MODES } from '@/pages/ruleSetting/constant';
import SecurityPoolSelect from '../component/SecurityPoolSelect';
import { transformDictToSelectOptionsNumber } from '@/utils/utils';
import DynamicDimensionSelect from '../component/DynamicDimensionSelect';

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
            SECURITY_CONTROL_TYPES__MAP.KEY_4,
          ]),
          onChange() {
            formAction.setFieldsValue({
              securitySetIdList: null,
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
      field: 'securityFilterClassList',
      label: '证券类别列表',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
      render: () => (
        <SecurityTypeSelect
          secuControl={[
            '10',
            '11',
            '1201',
            '1202',
            '1301',
            '1302',
            '1303',
            '1304',
            '1401',
            '1402',
            '1404',
            '1501',
          ]}
          style={{ width: '360px' }}
        />
      ),
    },
    {
      field: 'excludeSecurityList',
      label: '排除证券列表',
      required: false,
      component: 'Input',
      ifShow: ({ values }) =>
        values.securityControlType ===
        Number(SECURITY_CONTROL_TYPES__MAP.KEY_1.code),
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
  ];
};
